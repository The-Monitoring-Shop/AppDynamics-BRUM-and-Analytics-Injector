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


    const adrumCollect = (type, context = {}) => {
        const getCookieValueByName = (cookieNameToFind) => {
            const cookies = document.cookie.split(';');
            const cookiesTrimed = cookies.map((cookie) => cookie.trim());
            const cookiesSplited = cookiesTrimed.map((cookie) => cookie.split('='));
            const cookieName = cookiesSplited.filter((cookie) => cookie[0] === cookieNameToFind);
            const cookieValue = cookieName.map((cookie) => cookie[1]);
            const cookieValueResult = cookieValue.toString();
            return cookieValueResult || null;
        };

        const data = {
            userData: {
            },
            userDataLong: {
            },
            userDataDouble: {
            },
            userDataBoolean: {
            },
            userDataDate: {
            },
        };

        if (type === 'ajax') {
            //
        } else if (type === 'page' || type === 'vpage') {
            try {
                data.userData.gid = getCookieValueByName('_gid');
            } catch (error) {
                console.error(error);
            }
        }
        return data;
    };

    config.userEventInfo = {
        Ajax(context) {
            return adrumCollect('ajax', context);
        },
        PageView() {
            return adrumCollect('page');
        },
        VPageView() {
            return adrumCollect('vpage');
        },
    };

})(window["adrum-config"] || (window["adrum-config"] = {}));
