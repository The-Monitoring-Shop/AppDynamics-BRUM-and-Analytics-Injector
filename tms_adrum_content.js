
// Here we can set the regex pattern to use for URL matching
// const urlRegexPattern = "(clalcredit\.co\.il|clalbit\.co\.il|appdynamics\.com|bbc\.co\.uk)";

const domainArray = [
    // name - filename to inject
    // url - regex pattern
    // regexExact - whether exact regex match or contains

    {
        name: "Appdynamics",
        url: "www\\.appdynamics\\.com",
        regexExact: true
    },

    {
        name: "BBC",
        url: "bbc\\.co\\.uk",
        regexExact: false
    },

]



// Function to inject script into page
function injectScript (src) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = chrome.runtime.getURL(src);
    (document.head||document.documentElement).appendChild(script);
}

//  Function to check whether domain matches pattern
function checkDomain (currentDomain) {
    // Setup our return variable
    currentDomainMatch = {};

    // Check through our array
    domainArray.some((domainArrayElement) => {
        // console.log(`[adrum-injector] domainArrayElement - name: ${domainArrayElement.name} | url: ${domainArrayElement.url} | regexExact: ${domainArrayElement.regexExact}`);

        // Are we matching exact domain pattern
        if (domainArrayElement.regexExact == true) {
            // console.log("Match should be exact!");
            urlRegex = RegExp(`^http[s]?:\/\/${domainArrayElement.url}`, "ig");            
        } else {
            // console.log("Match should not be exact!");
            urlRegex = RegExp(`${domainArrayElement.url}`, "ig");
        }
        // console.log(`[adrum-injector] urlRegEx: ${urlRegex}`);

        // Does regex match
        if (currentDomain.match(urlRegex)) {
            // console.log("RegEx Match!")
            currentDomainMatch = domainArrayElement;
            return domainArrayElement;
        } else {
            // console.log("RegEx Doesnt Match!")
        }
    });
    return currentDomainMatch;
}



// Lets see if we have a match
console.log(`[adrum-injector] Current domain: ${document.location.href}`);
domainMatch = checkDomain(document.location.href);

// Do we have a match between page url and regex pattern?
if (domainMatch.name !== undefined) {
    console.log(`[adrum-injector] Injection Enabled, Matching: '${domainMatch.name}' URL: '${document.location.href}' Regex: '${urlRegex}'`);
    console.log("[adrum-injector] Injecting ...");
    injectScript(`./adrum_configs/${domainMatch.name}.js`);
    injectScript('adrum.js');
    console.log("[adrum-injector] Window URL: " + window.location.href.split("?")[0]);
} else {
    console.log(`[adrum-injector] Injection Disabled, Matching: '${domainMatch.name}' URL: '${document.location.href}' Regex: '${urlRegex}'`);
}
