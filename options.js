
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message == "updateToggleSwitch"){
            updateToggleSwitch();
        }
    }
);

function updateToggleSwitch() {
    chrome.storage.local.get("injectionSwitch", function(b) {
        if (1 == b.injectionSwitch) {
            document.getElementById("status").innerHTML = "Injection is On";
        } else {
            document.getElementById("status").innerHTML = "Injection is Off";
        }
    })
}

function toggleSwitch() {
    var a = document.getElementById("agentLocation").value;
    chrome.storage.local.get("injectionSwitch", function(b) {
        if (0 == b.injectionSwitch || null == b.injectionSwitch) {
            chrome.storage.local.set({
                injectionSwitch: 1
            })
            document.getElementById("status").innerHTML = "Injection is On";
            chrome.browserAction.setBadgeText({
                text: "On"
            });
        } else {
            chrome.storage.local.set({
                injectionSwitch: 0
            })
            document.getElementById("status").innerHTML = "Injection is Off";
            chrome.browserAction.setBadgeText({
                text: "Off"
            });
        }

        chrome.runtime.sendMessage({
            message: "updateToggleSwitch"
        });
    })
}

function requestPermissions(permissions = ['webRequest']) {
  return new Promise((resolve, reject) => {
    chrome.permissions.request({
      permissions
    }, function (granted) {
      console.log(granted)
      resolve()
    })
  })
}

function toggleCspSwitch() {
  // WebRequestBlocking is required to load the headers sync and modify them
  requestPermissions(['webRequest', 'webRequestBlocking']).then(() => {
    chrome.storage.local.get("cspSwitch", function(b) {
        if (0 == b.cspSwitch || null == b.cspSwitch) {
            chrome.storage.local.set({
                cspSwitch: 1
            })
            chrome.runtime.sendMessage({
                message: "removeCspOn"
            });
            document.getElementById("cspStatus").innerHTML = "Content Security Policy Override On";
        } else {
            chrome.storage.local.set({
                cspSwitch: 0
            })
            chrome.runtime.sendMessage({
                message: "removeCspOff"
            });
            document.getElementById("cspStatus").innerHTML = "Content Security Policy Override Off";
        }
    })
  })
}

function toggleAutoRefreshOnBeaconSwitch() {
  chrome.storage.local.get("autoRefreshValue", function(b) {
    console.log(b, null == b.autoRefreshValue, 0 == b.autoRefreshValue )
    if (null == b.autoRefreshValue || 0 == b.autoRefreshValue ) {
      console.log('ON')
      chrome.storage.local.set({
          autoRefreshValue: 1
      })
      document.getElementById("autoRefreshOnBeaconStatus").innerHTML = "Auto Refresh On Beacon On";
      document.getElementById("autoRefreshValue").value = 1
      document.getElementById("autoRefreshValue").removeAttribute('disabled')
      document.getElementById("saveAutoRefreshValue").removeAttribute('disabled')
    } else {
      console.log('OFF')
      chrome.storage.local.set({
          autoRefreshValue: 0
      })
      document.getElementById("autoRefreshOnBeaconStatus").innerHTML = "Auto Refresh On Beacon Off";
      document.getElementById("autoRefreshValue").value = ''
      document.getElementById("autoRefreshValue").setAttribute('disabled', true)
      document.getElementById("saveAutoRefreshValue").setAttribute('disabled', true)
    }
  })
}

function updateAutoRefreshValue() {
  $("#autoRefreshValueConfirm").show()
  chrome.storage.local.set({
    "autoRefreshValue": parseInt(document.getElementById("autoRefreshValue").value)
  })
  setTimeout('$("#autoRefreshValueConfirm").fadeOut("slow")', 5000);
}



function toggleTaoSwitch() {
  // WebRequestBlocking is required to load the headers sync and modify them
  requestPermissions(['webRequest', 'webRequestBlocking']).then(() => {
    chrome.storage.local.get("taoSwitch", function(b) {
        if (0 == b.taoSwitch || null == b.taoSwitch) {
            chrome.storage.local.set({
                taoSwitch: 1
            })
            chrome.runtime.sendMessage({
                message: "addTaoHeaderOn"
            });
            document.getElementById("taoStatus").innerHTML = "Timing Allow Origin Override On";
        } else {
            chrome.storage.local.set({
                taoSwitch: 0
            })
            chrome.runtime.sendMessage({
                message: "addTaoHeaderOff"
            });
            document.getElementById("taoStatus").innerHTML = "Timing Allow Origin Override Off";
        }
    })
  })
}

function setTextBoxDefaults() {
    chrome.storage.local.get("agentLocation", function(a) {
        if (a.agentLocation != null) {
            document.getElementById("agentLocation").value = a.agentLocation;
        } else {
            chrome.storage.local.set({
                agentLocation: "https://cdn.appdynamics.com/adrum/adrum-latest.js"
            })
            document.getElementById("agentLocation").value = "https://cdn.appdynamics.com/adrum/adrum-latest.js";
        }
    });

    /*chrome.storage.local.get("beaconLocationHttp", function(a) {
        if (a.beaconLocationHttp != null) {
            document.getElementById("beaconLocationHttp").value = a.beaconLocationHttp;
        } else {
            chrome.storage.local.set({
                beaconLocationHttp: "http://col.eum-appdynamics.com"
            })
            document.getElementById("beaconLocationHttp").value = "https://col.eum-appdynamics.com";
        }
    });

    chrome.storage.local.get("beaconLocationHttps", function(a) {
        if (a.beaconLocationHttps != null) {
            document.getElementById("beaconLocationHttps").value = a.beaconLocationHttps;
        } else {
            chrome.storage.local.set({
                beaconLocationHttps: "https://col.eum-appdynamics.com"
            })
            document.getElementById("beaconLocationHttps").value = "https://col.eum-appdynamics.com";
        }
    });*/

    chrome.storage.local.get("adrumAppKey", function(a) {
        if (a.adrumAppKey != null) {
            document.getElementById("adrumAppKey").value = a.adrumAppKey;
        } else {
            chrome.storage.local.set({
                adrumAppKey: ""
            })
        }
    });

    chrome.storage.local.get("urlFilter", function(a) {
        if (a.urlFilter != null) {
            document.getElementById("urlFilter").value = a.urlFilter;
        } else {
            chrome.storage.local.set({
                urlFilter: ""
            })
        }
    });

    chrome.storage.local.get("agentConfigJS", function(a) {
      console.log(a, editor)
        if (a.agentConfigJS != null) {
            editor.setValue(a.agentConfigJS);
        } else {
            chrome.storage.local.set({
                agentConfigJS: ""
            })
        }
    });

    chrome.storage.local.get("ua", function(a) {
        if (a.ua != null) {
            document.getElementById("ua").value = a.ua;
        } else {
            chrome.storage.local.set({
                ua: ""
            })
        }
    });

    chrome.storage.local.get("geoLocation", function(a) {
        if (a.geoLocation != null) {
            document.getElementById("geoLocation").value = a.geoLocation;
        } else {
            chrome.storage.local.set({
                geoLocation: ""
            })
        }
    });
}

function saveAgentSettings() {
    $("#agentLocationWarning").fadeOut("slow");
    var agentLocation = document.getElementById("agentLocation").value;
    if (agentLocation == "") {
        document.getElementById("agentLocation").value = "https://cdn.appdynamics.com/adrum/adrum-latest.js";
        agentLocation = "https://cdn.appdynamics.com/adrum/adrum-latest.js";
    }

    $("#urlFilterConfirm").fadeIn("slow");
    var urlFilter = document.getElementById("urlFilter").value;
    chrome.storage.local.set({
        urlFilter: urlFilter
    });
    setTimeout('$("#urlFilterConfirm").fadeOut("slow")', 5000);

    /*var beaconLocationHttp = document.getElementById("beaconLocationHttp").value;
    if (beaconLocationHttp == "") {
        document.getElementById("beaconLocationHttp").value = "http://col.eum-appdynamics.com";
        beaconLocationHttp = "http://col.eum-appdynamics.com";
    }

    var beaconLocationHttps = document.getElementById("beaconLocationHttps").value;
    if (beaconLocationHttps == "") {
        document.getElementById("beaconLocationHttps").value = "https://col.eum-appdynamics.com";
        beaconLocationHttp = "https://col.eum-appdynamics.com";
    }*/

    /*chrome.storage.local.set({
        beaconLocationHttps: beaconLocationHttps
    });

    chrome.storage.local.set({
        beaconLocationHttp: beaconLocationHttp
    });*/

    var adrumAppKey = document.getElementById("adrumAppKey").value;
    var jqxhr = $.ajax({
            url: agentLocation,
            timeout: 5000,
            beforeSend: function() {
                $("#accordion").wait();
            }
        })
        .done(function(a, b, c) {
            $("#agentSettingConfirm").fadeIn("slow");

            chrome.storage.local.set({
                agentLocation: agentLocation
            });

            chrome.storage.local.set({
                adrumAppKey: adrumAppKey
            });

            setTimeout('$("#agentSettingConfirm").fadeOut("slow")', 5000);
        })
        .fail(function(a, b, c) {
            console.log("Error connecting to specified agent geoLocation...");

            $("#agentLocationWarning").fadeIn("slow");
        })
        .always(function() {
            console.log("Testing against: " + agentLocation + " - Response Code: " + jqxhr.status);
            $("#accordion").unwait()
        });
}

function saveSpoofing() {
    $("#spoofingConfirm").fadeIn("slow");

    var ua = document.getElementById("ua").value;
    if (ua == "") {
        chrome.storage.local.set({
            ua: ""
        });
        chrome.runtime.sendMessage({
            message: "uaOff"
        });
    } else {
        console.log("Setting UA: " + ua);
        requestPermissions(['webRequest', 'webRequestBlocking']).then(() => {
          chrome.storage.local.set({
              ua: ua
          });
          chrome.runtime.sendMessage({
              message: "uaOn"
          });
          //console.log("UA message sent");
        })
    }

    var geoLocation = document.getElementById("geoLocation").value;
    if (geoLocation == "") {
        chrome.storage.local.set({
            geoLocation: ""
        });
        chrome.runtime.sendMessage({
            message: "geoLocationOff"
        });
    } else {
        console.log("Setting geoLocation: " + geoLocation);
        requestPermissions(['webRequest', 'webRequestBlocking']).then(() => {
          chrome.storage.local.set({
              geoLocation: geoLocation
          });
          chrome.runtime.sendMessage({
              message: "geoLocationOn"
          });
        })
        //console.log("Location message sent");
    }

    setTimeout('$("#spoofingConfirm").fadeOut("slow")', 5000);
}

function saveAgentConfigJS() {
    $("#agentConfigJSConfirm").fadeIn("slow");
    var agentConfigJS = editor.getValue();

    chrome.storage.local.set({
        agentConfigJS: agentConfigJS
    });
    setTimeout('$("#agentConfigJSConfirm").fadeOut("slow")', 5000);
}

function resetSession(){
    $("#resetSessionConfirm").fadeIn("slow");
	chrome.tabs.query({}, function(tabs){
        tabs.forEach(function(data, num){
            chrome.tabs.sendMessage(tabs[num].id,{message: "resetSession"});
        });
	});
    setTimeout('$("#resetSessionConfirm").fadeOut("slow")', 5000);
}

function addUserDataRow() {

    chrome.storage.local.get("userDataConfigs", function(a) {

        var userDataConfigs = a.userDataConfigs

        var table = document.getElementById("activeUserDataTable");

        Object.keys(userDataConfigs).forEach(function(userDataURLKey) {

            console.debug(userDataURLKey);
            var urlSet = false;

            userDataConfigs[userDataURLKey].forEach(function(userDataConfig) {

                console.debug(userDataConfig);

                var newRowIndex = table.rows.length;
                var newRow = table.insertRow();

                if(urlSet == false){
                    var newCell = newRow.insertCell();
                    var deleteButton = document.createElement("button");
                    deleteButton.id = userDataURLKey;
                    deleteButton.innerText = "Delete";
                    deleteButton.className = "button";
                    newCell.appendChild(deleteButton);

                    document.getElementById(userDataURLKey).addEventListener("click", function() {
                        //REMOVE FROM STORAGE
                        chrome.storage.local.get("userDataConfigs",function(b){
                            console.debug(userDataURLKey);
                            console.debug("Deleting... " + b.userDataConfigs[userDataURLKey]);
                            delete b.userDataConfigs[userDataURLKey];
                            chrome.storage.local.set({"userDataConfigs": b.userDataConfigs});
                            console.debug(b.userDataConfigs);
                            table.innerHTML = `
                            <table id="activeUserDataTable">
                                <tr>
                                    <th>
                                    </th>
                                    <th>
                                        URL
                                    </th>
                                    <th>
                                        Key (Type)
                                    </th>
                                    <th>
                                        Value
                                    </th>
                                </tr>
                            </table>
                            `;
                            addUserDataRow();
                        });
                    })

                    var newCell = newRow.insertCell();
                    newCell.innerHTML = userDataURLKey;
                    urlSet = true;
                }
                else{
                    var newCell = newRow.insertCell();
                    var newCell = newRow.insertCell();
                }
                var newCell = newRow.insertCell();
                newCell.id = "keyID" + newRowIndex;
                newCell.innerHTML = userDataConfig.key + " (" + userDataConfig.type + ")";
                var newCell = newRow.insertCell();
                newCell.innerHTML = userDataConfig.value;

            })


        });

        $(".button").button();
    });
}

function loadSimpleConfig() {
  editor.setValue(
`(function(config){
    config.adrumExtUrlHttp = "http://cdn.appdynamics.com";
    config.adrumExtUrlHttps = "https://cdn.appdynamics.com";
    config.beaconUrlHttp = "http://fra-col.eum-appdynamics.com";
    config.beaconUrlHttps = "https://fra-col.eum-appdynamics.com";
    config.resTiming = {"bufSize":200,"clearResTimingOnBeaconSend":true};
    config.maxUrlLength = 512;
    config.spa = {"spa2":true};
})(window["adrum-config"] || (window["adrum-config"] = {}));`
  )
}

function loadAdvancedConfig() {
  editor.setValue(
`(function(config){
    config.adrumExtUrlHttp = "http://cdn.appdynamics.com";
    config.adrumExtUrlHttps = "https://cdn.appdynamics.com";
    config.beaconUrlHttp = "http://fra-col.eum-appdynamics.com";
    config.beaconUrlHttps = "https://fra-col.eum-appdynamics.com";
    config.useHTTPSAlways = true;
    config.xd = {"enable":true};
    // config.urlCapture = {"filterURLQuery":true};
    // config.resTiming = {"sampler":"RelevantN","maxNum":5,"bufSize":200,"clearResTimingOnBeaconSend":true};
    // config.geo = {"localIP":"127.0.0.1","city":"Fuerth","region":"Bavaria","country":"Germany"};
    // config.geoResolverUrlHttp = "http://geoserver";
    // config.geoResolverUrlHttps = "https://geoserver";
    // config.maxResUrlSegmentLength = 514;
    // config.maxResUrlSegmentNumber = 5;
    // config.maxUrlLength = 512;
    // config.page = {"title":"page title"};
    // config.spa = {"spa2":{"vp":{"exclude":[{"urls":[{"pattern":".*"}]}]},"clearResTiming":true}};
    (function (info) {
        info.PageView = function() {
          return {
            "userPageName":"page name",
            "userData": {},
            "userDataLong": {},
            "userDataDouble": {}
          };
        };
        info.Ajax = function(context) {
          return {
            "userPageName":"page name",
            "userData": {},
            "userDataLong": {},
            "userDataDouble": {}
          };
        };
        info.VPageView = function() {
          return {
            "userPageName":"page name",
            "userData": {},
            "userDataLong": {},
            "userDataDouble": {}
          }
        }
    })(config.userEventInfo || (config.userEventInfo = {}));
    // config.isZonePromise = true;
    // config.angular = true;
    // config.xhr = {"include":[{"method":"GET"}],"exclude":[{"method":"POST"}],"maxPerPageView":512};
})(window["adrum-config"] || (window["adrum-config"] = {}));`
  )
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("toggle").addEventListener("click", function() {
        toggleSwitch();
    })

    document.getElementById("agentLocation").addEventListener("click", function() {
        $("#agentLocation").select();
    })

    document.getElementById("adrumAppKey").addEventListener("click", function() {
        $("#adrumAppKey").select();
    })

    document.getElementById("urlFilter").addEventListener("click", function() {
        $("#urlFilter").select();
    })

    document.getElementById("ua").addEventListener("click", function() {
        $("#ua").select();
    })

    document.getElementById("geoLocation").addEventListener("click", function() {
        $("#geoLocation").select();
    })

    document.getElementById("saveAgentSettings").addEventListener("click", function() {
        saveAgentSettings();
    })
    document.getElementById("saveSpoofing").addEventListener("click", function() {
        saveSpoofing();
    })

    document.getElementById("toggleCsp").addEventListener("click", function() {
        toggleCspSwitch();
    })

    document.getElementById("toggleTao").addEventListener("click", function() {
        toggleTaoSwitch();
    })

    document.getElementById("toggleAutoRefreshOnBeacon").addEventListener("click", function() {
        toggleAutoRefreshOnBeaconSwitch();
    })

    document.getElementById("saveAgentConfigJS").addEventListener("click", function() {
        saveAgentConfigJS();
    })

    document.getElementById("resetSession").addEventListener("click", function() {
        resetSession();
    })

    document.getElementById("loadSimpleConfig").addEventListener("click", function() {
        loadSimpleConfig();
    })

    document.getElementById("loadAdvancedConfig").addEventListener("click", function() {
        loadAdvancedConfig();
    })

    document.getElementById("saveAutoRefreshValue").addEventListener("click", function() {
      updateAutoRefreshValue();
    })

    document.getElementById("downloadAgentConfigJS").addEventListener("click", function() {
      const link = document.createElement('a')
      link.href = 'data:text/javascript;base64,' + btoa(editor.getValue())
      link.download = 'adrum-config-' + (new Date()).toISOString().split('T')[0] + '.js'
      const event = document.createEvent('MouseEvents')
      event.initEvent('click', true, true)
      link.dispatchEvent(event)
    })
});

$(document).ready(function() {

    $("#accordion").accordion({
        heightStyle: "content",
        active: 0
    });

    var tooltips = $( "[title]" ).tooltip({
      position: {
        my: "left top",
        at: "right+5 top-5",
        collision: "none"
      }
    });

    // Assign the ACE editor to the window to make it accessible
    ace.require("ace/ext/language_tools");
    window.editor = ace.edit("agentConfigJS", {
      // theme: "ace/theme/textmate",
      mode: "ace/mode/javascript",
      autoScrollEditorIntoView: true,
      copyWithEmptySelection: true,
      maxLines: 30,
      minLines: 30,
      wrap: true,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true
    });

    window.editor2 = ace.edit("agentConfigJSValidation", {
      // theme: "ace/theme/textmate",
      mode: "ace/mode/javascript",
      autoScrollEditorIntoView: true,
      copyWithEmptySelection: true,
      maxLines: 30,
      minLines: 30,
      readOnly: true,
      wrap: true,
      showGutter: false
    });

    editor.commands.addCommand({
    name: 'save',
    bindKey: {win: "Ctrl-S", "mac": "Cmd-S"},
    exec: function(editor) {
        document.getElementById('saveAgentConfigJS').click()
      }
    })

    // This is necessary since the code might contain calls to the
    // window like .addEventListener
    const windowHelperIframe = document.createElement('iframe');
    windowHelperIframe.setAttribute('style', 'display: none;');
    document.body.appendChild(windowHelperIframe);

    editor.getSession().on('change', function() {
      const code = editor.getValue();
      let window = windowHelperIframe
      let result = null

      try {
        eval(code);
        result = window['adrum-config'] ? window['adrum-config'] : new Error('No adrum config was defined');
        console.log(result)
        editor2.setValue(cust_stringify(result));
      } catch (e) {
        console.log(e)
      }
    });

    // Custom function to stringify JS object - handles functions
    var cust_stringify = function(obj, prop) {
        var placeholder = '____PLACEHOLDER____';
        var fns = [];
        var json = JSON.stringify(obj, function(key, value) {
          if (typeof value === 'function') {
            fns.push(value);
            return placeholder;
          }
          return value;
        }, 2);
        json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function(_) {
          return fns.shift();
        });
        return json;
    };


    editor.completers.push({
    getCompletions: function(editor, session, pos, prefix, callback) {
        const list = [
          ['appKey', `"${document.getElementById("adrumAppKey").value}"`],
          ['adrumExtUrlHttp', '"${1:http://cdn.appdynamics.com}"'],
          ['adrumExtUrlHttps', '"${1:https://cdn.appdynamics.com}"'],
          ['beaconUrlHttp', '"${1:http://col.eum-appdynamics.com}"'],
          ['beaconUrlHttps', '"${1:https://col.eum-appdynamics.com}"'],
          ['beacon', '{"neverSendImageBeacon":${1:true}}'],
          ['xd', '{"enable":${1:true}}'],
          ['urlCapture', '{"filterURLQuery":${1:true}}'],
          ['resTiming', '{"sampler":"${1:RelevantN}","maxNum":${2:5},"bufSize":${3:200},"clearResTimingOnBeaconSend":${4:true}}'],
          ['geo', '{"localIP":"${1:127.0.0.1}","city":"${2:Fuerth}","region":"${3:Bavaria}","country":"${4:Germany}"}'],
          ['geoResolverUrlHttp', '"${1:http://geoserver}"'],
          ['geoResolverUrlHttps', '"${1:https://geoserver}"'],
          ['maxResUrlSegmentLength', '${1:512}'],
          ['maxResUrlSegmentNumber', '${1:5}'],
          ['maxUrlLength', '${1:512}'],
          ['channel', '{bufferMode: ${1:true}}'],
          ['spa', '{"spa2":{"vp":{"exclude":[{"urls":[{"pattern":"${1:.*}"}]}]},"clearResTiming":${2:true}}}'],
          ['spa2', '{"spa2":${1:true}}'],
          ['isZonePromise', '${1:true}'],
          ['angular', '${1:true}'],
          ['fetch', '${1:true}'],
          ['enablePrimaryMetrics', '${1:true}'],
          ['useHTTPSAlways', '${1:true}'],
          ['page', '{captureTitle:${1:true}, title: ${2:function() {}}}'],
          ['xhr', '{"include":[{"method":"${1:GET}"}],"exclude":[{"method":"${2:POST}"}],"maxPerPageView":${3:512}}'],
          ['userEventInfo',
`{
    PageView: function() {
      \${1}
    },
    Ajax: function(context) {
      \${2}
    },
    VPageView: function() {
      \${3}
    }
  }`
]
        ].map(value => {
            if(Array.isArray(value)) {
              return {
                value: value[0],
                snippet: `${value[0]} = ${value[1]};`,
                meta: 'adrumConfig'
              }
            }
            return {
              value,
              meta: 'adrumConfig'
            }
          }).concat(
            [
              {
                value: 'adrum-config',
                snippet: `(function(config){\n\t\${1://Insert your config here}\n})(window["adrum-config"] || (window["adrum-config"] = {}))`,
                meta: 'adrumConfig'
              },
              {
                value: 'adrum-disable',
                snippet: 'window["adrum-disable"] = ${1:true};',
                meta: 'adrumConfig'
              },
              {
                value: 'adrum-start-time',
                snippet: 'window["adrum-start-time"] = ${1:new Date().getTime()};',
                meta: 'adrumConfig'
              },
              {
                value: 'adrum-use-strict-domain-cookies',
                snippet: 'window["adrum-use-strict-domain-cookies"] = ${1:true};',
                meta: 'adrumConfig'
              },
              {
                value: 'col.eum-appdynamics.com',
                meta: 'beaconUrl'
              },
              {
                value: 'fra-col.eum-appdynamics.com',
                meta: 'beaconUrl'
              },
              {
                value: 'syd-col.eum-appdynamics.com',
                meta: 'beaconUrl'
              }
            ]
          )
        callback(null, list);
      }
    })


    editor.resize()

    setTextBoxDefaults();
    addUserDataRow();
    $(".button").button();

    chrome.storage.local.get("injectionSwitch", function(a) {
    	0 == a.injectionSwitch || null == a.injectionSwitch ? (document.getElementById("status").innerHTML = "Injection is Off") : (document.getElementById("status").innerHTML = "Injection is On")
	});

	chrome.storage.local.get("cspSwitch", function(a) {
    	0 == a.cspSwitch || null == a.cspSwitch ? (document.getElementById("cspStatus").innerHTML = "Content Security Policy Override Off") : (document.getElementById("cspStatus").innerHTML = "Content Security Policy Override On")
	});

	chrome.storage.local.get("taoSwitch", function(a) {
    	0 == a.taoSwitch || null == a.taoSwitch ? (document.getElementById("taoStatus").innerHTML = "Timing Allow Origin Override Off") : (document.getElementById("taoStatus").innerHTML = "Timing Allow Origin Override On")
	});

  chrome.storage.local.get("autoRefreshValue", function(a) {
      if(0 == a.autoRefreshValue || null == a.autoRefreshValue) {
        document.getElementById("autoRefreshOnBeaconStatus").innerHTML = "Auto Refresh On Beacon Off"
        document.getElementById("autoRefreshValue").value = ''
        document.getElementById("autoRefreshValue").setAttribute('disabled', true)
        document.getElementById("saveAutoRefreshValue").setAttribute('disabled', true)
      } else {
        document.getElementById("autoRefreshOnBeaconStatus").innerHTML = "Auto Refresh On Beacon On"
        document.getElementById("autoRefreshValue").value = a.autoRefreshValue
        document.getElementById("autoRefreshValue").removeAttribute('disabled')
        document.getElementById("saveAutoRefreshValue").removeAttribute('disabled')
      }
    });

    $(function() {
        // Auto-suggest adrum versions from cdn.appdynamics.com when user
        // tries to type in the Agent Location
        var cache = [];
        $( "#agentLocation" ).autocomplete({
            source: function( request, response ) {
                var s_term = request.term;

                // Build Cache for the first time if it doesnt exist
                if (!Array.isArray(cache) || !cache.length) {
                    $.ajax( {
                        url: "http://cdn.appdynamics.com/adrum/",
                        dataType: "html",
                        success: function( data ) {
                            $('tr td a', data).each( function() {
                                cache.push($(this).attr('href'));
                            })
                        }
                    });
                }
                if(s_term.includes("cdn.appdynamics.com")) {
                    if(s_term.includes("adrum-")) {
                        response (cache.filter((tag) => tag.includes(s_term.substring(s_term.lastIndexOf('adrum-')))));
                    } else {
                        response(cache);
                    }
                }
              },
            select: function( event, ui ) {
                console.log( "Selected: " + ui.item.value + " aka " + ui.item.id );
            }
        });
     });

    $(function() {
        $.getJSON("data/ua.json", function(data) {
            $("#ua").catcomplete({
                delay: 0,
                source: data
            });
        });
    });

    $(function() {
        $.getJSON("data/location.json", function(data) {
            $("#geoLocation").catcomplete({
                delay: 0,
                source: data
            });
        });
    });

    $.widget("custom.catcomplete", $.ui.autocomplete, {
        _create: function() {
            this._super();
            this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
        },
        _renderMenu: function(ul, items) {
            var that = this,
            currentCategory = "";
            $.each(items, function(index, item) {
                var li;
                if (item.category != currentCategory) {
                    ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
                    currentCategory = item.category;
                }
                li = that._renderItemData(ul, item);
                if (item.category) {
                    li.attr("aria-label", item.category + " : " + item.label);
                }
            });
        }
    });

    editor.resize()


});
