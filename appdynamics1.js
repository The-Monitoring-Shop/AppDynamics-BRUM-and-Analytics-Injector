chrome.storage.local.get({
  "injectionSwitch": 0,
  "autoRefreshValue": -1,
  "agentLocation": "https://cdn.appdynamics.com/adrum/adrum-latest.js",
  "beaconLocationHttp": "https://col.eum-appdynamics.com",
  "beaconLocationHttps": "https://col.eum-appdynamics.com",
  "adrumAppKey": "",
  "urlFilter": "",
  "pageName": "",
  "agentConfigJS": ""
}, function(a) {

  console.log('[adrum-injector] configuration', a)

  let filterPass = 0;

  console.log("[adrum-injector] URL filter is: " + a.urlFilter);
  console.log("[adrum-injector] Current URL is: " + document.location.href);
  if (document.location.href.indexOf(a.urlFilter) > -1) {
    filterPass = 1;
  } else {
    console.log(`[adrum-injector] Injection switch OFF, filter did NOT match '${document.location.href}' does not contain '${a.urlFilter}'`)
  }

  if (1 == a.injectionSwitch && filterPass == 1) {
    console.log(`[adrum-injector] Injection switch ON, filter did match '${document.location.href}' contains '${a.urlFilter}'`)
    if (a.agentConfigJS != "") {
      let e = document.createElement("script");
      e.setAttribute("type", "text/javascript");
      e.innerHTML = a.agentConfigJS;
      document.head.appendChild(e);
    }

    if (a.adrumAppKey != "") {
      console.log("[adrum-injector] ADRUM App Key is set: " + a.adrumAppKey);
      let d = document.createElement("script");
      d.setAttribute("type", "text/javascript");
      //d.innerHTML = 'window["adrum-app-key"] = "' + a.adrumAppKey + '";';
      let blh = 'http://col.eum-appdynamics.com'
      let blhs = 'https://col.eum-appdynamics.com'
      if(a.adrumAppKey.startsWith('EC')) {
        blh = 'http://fra-col.eum-appdynamics.com'
        blhs = 'https://fra-col.eum-appdynamics.com'
      } else if (a.adrumAppKey.startsWith('SM')) {
        blh = 'http://syd-col.eum-appdynamics.com'
        blhs = 'https://syd-col.eum-appdynamics.com'
      }
      d.innerHTML =
`
window["adrum-start-time"] = new Date().getTime();
window["adrum-app-key"] = "${a.adrumAppKey}";
(function(config){
  if(typeof config.beaconUrlHttps === 'undefined') {
    config.beaconUrlHttps = '${blhs}';
    console.log('[adrum-injector] Auto Configured Beacon Location HTTPS', config.beaconUrlHttps)
  }
  if(typeof config.beaconUrlHttp === 'undefined') {
    config.beaconUrlHttp = '${blh}';
    console.log('[adrum-injector] Auto Configured Beacon Location HTTP', config.beaconUrlHttps)
  }
})(window["adrum-config"] || (window["adrum-config"] = {}))
`
      document.head.appendChild(d);
    }

    console.debug("[adrum-injector] Window URL is: " + window.location.href.split("?")[0]);

    let c = document.createElement("script");
    c.setAttribute("type", "text/javascript");
    chrome.storage.local.get("agentLocation", function(a) {
      c.setAttribute("src", a.agentLocation);
      console.log("[adrum-injector] Agent location is: " + a.agentLocation);
    });

    document.head.appendChild(c);

    let chanceScript = document.createElement("script");
    chanceScript.src = chrome.extension.getURL("chance.min.js");
    document.head.appendChild(chanceScript);

    if (typeof a.autoRefreshValue === 'number' & a.autoRefreshValue > 0) {
      console.log("[adrum-injector] Refresh Beacon Count is: " + a.autoRefreshValue);
      let d = document.createElement("script");
      d.setAttribute("type", "text/javascript");
      d.innerHTML = `setInterval(() => { if(ADRUM && ADRUM.beacons && ADRUM.beacons.numBeaconsSent >= ${a.autoRefreshValue}) { window.location.reload(); }  }, 2000)`
      document.head.appendChild(d);
    }

    filterPass = 0;
  }
});

chrome.runtime.onMessage.addListener(
  function(request) {
    if (request.message == "resetSession") {
      console.log("[adrum-injector] Resetting session...");
      localStorage.removeItem("ADRUM_AGENT_INFO");
    }
  }
);
