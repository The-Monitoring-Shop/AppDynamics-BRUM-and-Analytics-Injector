chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.status !== 'loading') {
        return;
    }

    console.log(tabId, changeInfo)

    chrome.tabs.get(tabId, (tab) => {
        if(tab.url) {
            chrome.scripting.executeScript({
                target: { tabId: tabId, allFrames : true},
                func: checkInjectionWindow
                // runAt: 'document_start',
            }, (result) => {
                if(result === true) {
                    console.log('Already injected.')
                } else {
                    chrome.scripting.executeScript({
                        target: { tabId: tabId, allFrames : true},
                        files: ['tms.js']
                        // runAt: 'document_start',
                    }, () => {
                        chrome.scripting.executeScript({
                            target: { tabId: tabId, allFrames : true},
                            func: createInjectionWindow
                            // runAt: 'document_start',
                        }, () => {
                            console.log('Injection completed.')
                        })
                    })
                }
            })
        }
    })

})

const checkInjectionWindow = () => {
    return 'typeof window["adrum-injector-28F912D2-8904-4339-BB88-25DB5CACCFBC"] === "boolean"'
}

const createInjectionWindow = () => {
    return 'window["adrum-injector-28F912D2-8904-4339-BB88-25DB5CACCFBC"] = true;'
}
