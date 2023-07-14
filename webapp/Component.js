/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/example/podemo/model/models",
    'sap/ui/model/json/JSONModel'
],
function (UIComponent, Device, models,JSONModel) {
    "use strict";

    return UIComponent.extend("com.example.podemo.Component", {
        metadata: {
            manifest: "json"
        },

        /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * @public
         * @override
         */
        init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // enable routing
            this.getRouter().initialize();

             // *set size limit
                this.getModel("app");
                this.getModel("config");

                // initialize backend model API
                this._oBackendModelAPI = this._getBackendModelAPI();

          this.getMyChatbot();
        },
        _getBackendModelAPI: function () {
            var bMock = true;
            return models.createBackendModelAPI(this, bMock);
          },
          getMyChatbot: function(){
            if(! document.getElementById("kameshwar")){
                var oNewElement = document.createElement("script");
                oNewElement.setAttribute("id", "kameshwar");
                oNewElement.setAttribute("src", "https://cdn.cai.tools.sap/webchat/webchat.js");
                document.body.appendChild(oNewElement);
                oNewElement.setAttribute("channelId", "d36aa7a8-9d8b-40b3-8bd1-c6dd3904ab35");
                oNewElement.setAttribute("token", "ead556ea8e231ce97aa6cfbb18b7543a");
            }
        }

    });
}
);