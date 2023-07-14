// @ts-nocheck
/* eslint-disable @sap/ui5-jsdocs/no-jsdoc */
sap.ui.define(["sap/ui/base/Object", "sap/ui/core/util/MockServer"], function (UI5Object, ServerUtil) {
	"use strict";

	return UI5Object.extend("com.example.podemo.model.api.provider.DefaultProvider", {
		constructor: function (oComponent) {
            this._oComponent = oComponent;
        },

        _getSAPDate: function (dDate) {
            return dDate.getFullYear() + (dDate.getMonth() + 1).toString().padStart(2, "0") + dDate.getDate().toString().padStart(2, "0");
        },

        _prepareQueryUrl: function (sEndpoint, oQueryParams) {
            var sParsedParams;
            var aURLComponents;

            sParsedParams = jQuery.param(oQueryParams);

            aURLComponents = [this._getDestination(), "/", sEndpoint, "?", sParsedParams];

            return decodeURIComponent(this._resolveUri(aURLComponents.join("")));
        },

        _resolveUri: function (sUri) {
            return this._oComponent.getManifestObject().resolveUri(sUri);
        },

        _getDestination: function () {
            return this._oConstantsModel.getProperty("/TARGET_DESTINATION");
        },

    });
});
