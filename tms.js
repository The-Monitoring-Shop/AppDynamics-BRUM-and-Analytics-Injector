// chrome.storage.local.clear();

chrome.storage.local.set({
    "agentLocation": "https://cdn.appdynamics.com/adrum/adrum-24.4.0.4454.js",
    "adrumAppKey": "EUM-AAB-AUA",
    "urlFilter": "(clalbit\.co\.il|appdynamics\.com)",
    "agentConfigJS": 
`
window['adrum-start-time'] = new Date().getTime();
(function(config){
    config.appKey = 'EUM-AAB-AUA';
    config.adrumExtUrlHttp = "http://cdn.appdynamics.com";
    config.adrumExtUrlHttps = "https://cdn.appdynamics.com";
    config.beaconUrlHttp = "http://appd.themonitoringshop.com:7001";
    config.beaconUrlHttps = "https://appd.themonitoringshop.com:7002";
    config.resTiming = {"bufSize":200,"clearResTimingOnBeaconSend":true};
    config.maxUrlLength = 512;
    config.xd = { enable: false };
    config.spa = { "spa2": true };
    config.isZonePromise = true;
})(window["adrum-config"] || (window["adrum-config"] = {}));
`
})

chrome.storage.local.get({
  "agentLocation": "",
  "adrumAppKey": "",
  "urlFilter": "",
  "agentConfigJS": ""
}, function(a) {

  console.log('[adrum-injector] configuration', a)

  let filterPass = 0;

  let urlRegex = new RegExp(".*" + a.urlFilter + ".*", "ig");
  console.log("[adrum-injector] URL RegEx filter is: " + urlRegex);
  console.log("[adrum-injector] Current URL is: " + document.location.href);
  if (document.location.href.match(urlRegex)) {
    filterPass = 1;
  } else {
    console.log(`[adrum-injector] Injection switch OFF, filter did NOT match '${document.location.href}' does not match regex '${a.urlFilter}'`)
  }

  if (filterPass == 1) {
      console.log(`[adrum-injector] Injection switch ON, filter did match '${document.location.href}' matches regex '${a.urlFilter}'`)
    if (a.agentConfigJS != "") {
      let e = document.createElement("script");
      e.setAttribute("type", "text/javascript");
      e.innerHTML = a.agentConfigJS;
      document.head.appendChild(e);
    }

    if (a.adrumAppKey != "") {
      console.log("[adrum-injector] ADRUM App Key is set: " + a.adrumAppKey);
    }

    console.log("[adrum-injector] Window URL is: " + window.location.href.split("?")[0]);

    let c = document.createElement("script");
    c.setAttribute("type", "text/javascript");
    chrome.storage.local.get("agentLocation", function(a) {
      c.setAttribute("src", a.agentLocation);
      console.log("[adrum-injector] Agent location is: " + a.agentLocation);
    });

    document.head.appendChild(c);

    filterPass = 0;
  }
});
