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
                        file: 'tms.js',
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
                }
            })
        }
    })
})
