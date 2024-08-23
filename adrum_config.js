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
