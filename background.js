/*
"content_scripts": [ {
   "all_frames": true,
   "js": [ "chance.min.js", "appdynamics1.js" ],
   "run_at": "document_start"
} ],
*/
/*
 * The following replaces the decelerative content scripts, which require
 * high host permissions.
 */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.status !== 'loading') {
        return;
    }

    console.log(tabId, changeInfo)

    chrome.tabs.get(tabId, (tab) => {
        if(tab.url) {
            chrome.tabs.executeScript(tabId, {
                code: 'typeof window["adrum-injector-28F912D2-8904-4339-BB88-25DB5CACCFBC"] === "boolean"',
                runAt: 'document_start',
                allFrames: true
            }, (result) => {
                if(result[0] === true) {
                    console.log('Already injected.')
                } else {
                    chrome.tabs.executeScript(tabId, {
                        file: 'chance.min.js',
                        allFrames: true,
                        runAt: 'document_start',
                    }, () => {
                        chrome.tabs.executeScript(tabId, {
                            file: 'appdynamics1.js',
                            allFrames: true,
                            runAt: 'document_start',
                        }, () => {
                            chrome.tabs.executeScript(tabId, {
                                code: 'window["adrum-injector-28F912D2-8904-4339-BB88-25DB5CACCFBC"] = true;',
                                allFrames: true,
                                runAt: 'document_start',
                            }, () => {
                                console.log('Injection completed.')
                            })
                        })
                    })
                }
            })
        }
    })
})


function toggleSwitch() {
    chrome.storage.local.get("injectionSwitch", function(b) {
        if (0 == b.injectionSwitch || null == b.injectionSwitch) {
            chrome.storage.local.set({
                injectionSwitch: 1
            })
            chrome.browserAction.setBadgeText({
                text: "On"
            });
        } else {
            chrome.storage.local.set({
                injectionSwitch: 0
            })
            chrome.browserAction.setBadgeText({
                text: "Off"
            });
        }

        chrome.runtime.sendMessage({
            message: "updateToggleSwitch"
        });
    })
}

var useragents = [
"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1",
"Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A",
"Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53",
"Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4",
"Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.20 Mobile Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36"
];

chrome.storage.local.get("injectionSwitch", function(a) {
    if (0 == a.injectionSwitch) {
        chrome.browserAction.setBadgeText({
            text: "Off"
        });
    }

    if (1 == a.injectionSwitch) {
        chrome.browserAction.setBadgeText({
            text: "On"
        });
    }
});

chrome.storage.local.get("ua", function(a) {
    if (null == a.ua) {
        chrome.storage.local.set({
            ua: ""
        })
    }
});

chrome.storage.local.get("userDataConfigs", function(a) {
    if (null == a.userDataConfigs) {
        chrome.storage.local.set({
            userDataConfigs: new Object()
        })
    }
});

chrome.storage.local.get("pageConfigs", function(a) {
    if (null == a.pageConfigs) {
        chrome.storage.local.set({
            pageConfigs: new Object()
        })
    }
});

chrome.storage.local.get("geoLocation", function(a) {
    if (null == a.geoLocation) {
        chrome.storage.local.set({
            geoLocation: ""
        })
    }
});

chrome.storage.local.get("cspSwitch", function(a) {
    if (null == a.cspSwitch) {
        chrome.storage.local.set({
            cspSwitch: 0
        })
    }
});

chrome.storage.local.get("cspSwitch", function(b) {
    if (0 != b.cspSwitch && null != b.cspSwitch) {
        console.log("Turning On CSP Override");
        chrome.webRequest.onHeadersReceived.addListener(removeCsp, {
            urls: ["<all_urls>"]
        }, ["responseHeaders"]);
    }
})

chrome.storage.local.get("taoSwitch", function(a) {
    if (null == a.taoSwitch) {
        chrome.storage.local.set({
            taoSwitch: 0
        })
    }
});

chrome.storage.local.get("taoSwitch", function(b) {
    if (0 != b.taoSwitch && null != b.taoSwitch) {
        console.log("Turning On TAO Override");
        chrome.webRequest.onHeadersReceived.addListener(addTaoHeader, {
            urls: ["<all_urls>"]
        }, ["responseHeaders"]);
    }
})

var ua = "";
var geoLocation = "";

chrome.storage.local.get("geoLocation", function(a) {
    if (a.geoLocation != null && a.geoLocation != "") {
        geoLocation = a.geoLocation;
        console.log("Turning On Custom Location");
        chrome.webRequest.onBeforeSendHeaders.addListener(addGeoLocation, {
            urls: ["*://*/*adrum*"]
        }, ["requestHeaders"]);
    }
});

chrome.storage.local.get("ua", function(a) {
    if (a.ua != null && a.ua != "") {
        ua = a.ua;
        console.log("Turning On UA Mod");
        chrome.webRequest.onBeforeSendHeaders.addListener(modifyUserAgent, {
            urls: ["*://*/*adrum*"]
        }, ["requestHeaders"]);
    }
});

var modifyUserAgent = function(details) {
    console.log("Modifying UA");
    if (ua != null && ua != "") {
        console.log("Selecting random UA");
        var useragent = useragents[Math.floor(Math.random()*useragents.length)];
        console.log("UA = " + useragent);
        for (var i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name.toLowerCase() == 'user-agent') {
                if (ua == "*"){
                    details.requestHeaders[i].value = useragent;
                }
                else{
                    details.requestHeaders[i].value = ua;
                }
                break;
            }
        }
    }
    return {
        requestHeaders: details.requestHeaders
    };
}

var removeCsp = function(details) {
    console.log("Removing CSP Header");
    for (var i = 0; i < details.responseHeaders.length; ++i) {
        if (details.responseHeaders[i].name.toLowerCase() == 'content-security-policy') {
            details.responseHeaders[i].value = '';
            console.log(details)
        }
    }
    return {
        responseHeaders: details.responseHeaders
    };
}

var addTaoHeader = function(details) {
    console.log("Adding TAO Header");
    var foundExisting = false;

    for (var i = 0; i < details.responseHeaders.length; ++i) {
        if (details.responseHeaders[i].name.toLowerCase() == 'timing-allow-origin') {
            details.responseHeaders[i].value = '*';
            foundExisting = true;
        }
    }

    if (foundExisting == false){
        details.responseHeaders.push({
            name: "Timing-Allow-Origin",
            value: "*"
        });
    }

    return {
        responseHeaders: details.responseHeaders
    };
}

var addGeoLocation = function(details) {
    if (geoLocation != null && geoLocation != ""){
        console.log("Modifying Location");
        if (geoLocation == "*"){
            var randomIP = chance.ip();
            console.log("Generating IP Address");
            console.log("IP = " + randomIP);
            details.requestHeaders.push({
                name: "X-Forwarded-For",
                value: randomIP
            });
        }
        else{
            details.requestHeaders.push({
                name: "X-Forwarded-For",
                value: geoLocation
            });
        }
        return {
            requestHeaders: details.requestHeaders
        };
    }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message == "removeCspOn") {
            console.log("Turning on CSP Override");
            chrome.webRequest.onHeadersReceived.addListener(removeCsp, {
                urls: ["<all_urls>"]
            }, ["blocking", "responseHeaders"]);
        }

        if (request.message == "removeCspOff") {
            chrome.webRequest.onHeadersReceived.removeListener(removeCsp);
        }

        if (request.message == "addTaoHeaderOn") {
            console.log("Turning on TAO Override");
            chrome.webRequest.onHeadersReceived.addListener(addTaoHeader, {
                urls: ["<all_urls>"]
            }, ["blocking", "responseHeaders"]);
        }

        if (request.message == "addTaoHeaderOff") {
            chrome.webRequest.onHeadersReceived.removeListener(addTaoHeader);
        }

        if (request.message == "uaOn") {
            chrome.storage.local.get("ua", function(a) {
                if (a.ua != null && a.ua != "") {
                    ua = a.ua;
                    console.log("Turning on UA Mod");
                    chrome.webRequest.onBeforeSendHeaders.addListener(modifyUserAgent, {
                        urls: ["*://*/*adrum*"]
                    }, ["blocking", "requestHeaders"]);
                }
            });
        }

        if (request.message == "uaOff") {
            chrome.webRequest.onBeforeSendHeaders.removeListener(modifyUserAgent);
        }

        if (request.message == "geoLocationOn") {
            chrome.storage.local.get("geoLocation", function(a) {
                if (a.geoLocation != null && a.geoLocation != "") {
                    geoLocation = a.geoLocation;
                    console.log("Turning On Custom Location");
                    chrome.webRequest.onBeforeSendHeaders.addListener(addGeoLocation, {
                        urls: ["*://*/*adrum*"]
                    }, ["blocking", "requestHeaders"]);
                }
            });
        }

        if (request.message == "geoLocationOff") {
            chrome.webRequest.onBeforeSendHeaders.removeListener(addGeoLocation);
        }
    }
);
