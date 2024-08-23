
// Here we can set the regex pattern to use for URL matching
const urlRegexPattern = "(clalcredit\.co\.il|clalbit\.co\.il|appdynamics\.com|bbc\.co\.uk)";



// Function to inject script into page
function injectScript (src) {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = chrome.runtime.getURL(src);
    (document.head||document.documentElement).appendChild(script)
}

// Setup our regex pattern
let urlRegex = new RegExp(".*" + urlRegexPattern + ".*", "ig");

// Do we have amatch between page url and regex pattern?
if (document.location.href.match(urlRegex)) {
    console.log(`[adrum-injector] Injection Enabled, Document URL:, '${document.location.href}' Matches regex: '${urlRegex}'`)
    console.log("[adrum-injector] Injecting ...");
    injectScript('adrum_config.js');
    injectScript('adrum.js');
    console.log("[adrum-injector] Window URL: " + window.location.href.split("?")[0]);
} else {
    console.log(`[adrum-injector] Injection Disabled, Document URL: '${document.location.href}' Doesnt match regex: '${urlRegex}'`)
}
