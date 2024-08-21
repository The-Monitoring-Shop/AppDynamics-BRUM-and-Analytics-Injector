# adrum-injector

The AppDynamics BRUM & BRUM Analytics Injector is an extension for Chrome that can be easily installed and configured to inject the AppDynamics ADRUM agent into any web page.
It was built to allow quick custom demos and/or testing/troubleshooting existing/upcoming deployments against any site.

## Install

To use a stable build of this extension, go to the [Product Page of the Injector on the chrome web store](http://bit.ly/adruminjector) and click on "Add to chrome".

If you like to use the code from this repository, clone it and load the extension as "unpacked extension":

* Clone: `git clone https://github.com/Appdynamics/adruminjector/`
* Open [chrome://extensions/](chrome://extensions/) in the browser
* Turn on the "Developer mode" on the top right corner
* Click on "Load unpacked" and add your cloned directory from there

## Contribute

If you'd like to contribute to the **adrum-injector** you can do so in the following ways:

* Report Bugs via opening a [new issue](https://github.com/Appdynamics/adruminjector/issues/new).
* Requesting new features or presenting ideas how to improve the injector by opening a [new issue](https://github.com/Appdynamics/adruminjector/issues/new).
* Fixing bugs or adding new features by changing the code and [opening pull requests](https://github.com/Appdynamics/adruminjector/compare). Follow the instructions below how to develop code for this extension. If you are not sure where to start checkout the list of [good first issues](https://github.com/Appdynamics/adruminjector/labels/good%20first%20issue).

## Develop

Follow the instructions above to install the extension from source. An easy point to start is editing the popup or options page:

* [popup.js](popup.js), [popup.html](popup.html), [popup.css](popup.css): Edit these files if you'd like to change the popup you see when you click on the adrum-injector browser icon.
* [options.js](options.js), [options.html](options.html), [options.css](options.css): Edit these files if you'd like to add advanced settings you control when you click on "General Options" from the popup page.

Changes applied on popup & options page are applied immediately. This means when you add code and save your file you can just reload the browser window or re-open the popup to see changes being applied.

Besides popup & options page you can also edit the content scripts that are injected into the webpages and the background script. Before you go there, make yourself comfortable with chrome extensions using the [Getting Started Tutorial](https://developer.chrome.com/extensions/getstarted).
