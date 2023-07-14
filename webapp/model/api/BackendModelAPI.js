// @ts-nocheck
/* eslint-disable @sap/ui5-jsdocs/no-jsdoc */
sap.ui.define(
	["sap/ui/base/Object",
	 "./provider/MockProvider",
	  "./provider/DefaultProvider",
	],
	function (UI5Object, MockProvider, DefaultProvider) {
		"use strict";

		return UI5Object.extend("com.example.podemo.model.api.BackendModelAPI", {
			_oAppModel: {},
			_oConstantsModel: {},
			_oBundle: {},
			_aRequests: [],

			constructor: function (oComponent, bMock) {
				var bMock = false;
				this._oComponent = oComponent;
				this._oAppModel = oComponent.getModel("app");
				this._oConfigModel = oComponent.getModel("config");
				this._oBundle = oComponent.getModel("i18n").getResourceBundle();
				bMock = true;
				this._oProvider = bMock ? new MockProvider() : new DefaultProvider(oComponent);
			},
			getRequestPO:function(){
				var oPromise;
				var bAborted = false;

				return new Promise(
					function (resolve, reject) {
						oPromise = this._oProvider.getRequestPO();
						this._aRequests.push(oPromise);
						oPromise
							.then(
								function (aRequestPO) { 
									this._oAppModel.setProperty(
										"/REQUEST_PO",aRequestPO
									);
									resolve(aRequestPO);
								}.bind(this)
							)							
							.catch(function (oResponse) {
								bAborted = oResponse.readyState === XMLHttpRequest.UNSENT;

                                if (!bAborted) {
                                    reject({
                                        response: oResponse
                                    });
                                }
							});
					}.bind(this)					
				);
			},
			getRequestPOSN:function(oSelectedPoItem){
				debugger;
				var oPromise;
				var bAborted = false;

				return new Promise(
					function (resolve, reject) {
						oPromise = this._oProvider.getRequestPOSN(oSelectedPoItem);
						this._aRequests.push(oPromise);
						oPromise
							.then(
								function (aRequestPOSN) { 
									debugger;
									this._oAppModel.setProperty(
										"/REQUEST_POSN",aRequestPOSN
									);
									resolve(aRequestList);
								}.bind(this)
							)							
							.catch(function (oResponse) {
								bAborted = oResponse.readyState === XMLHttpRequest.UNSENT;

                                if (!bAborted) {
                                    reject({
                                        response: oResponse
                                    });
                                }
							});
					}.bind(this)					
				);
			},
			getRequestLogsInfo:function(oSelectedPoItem,oSelectedSid, oSelecteditemNo){
				debugger;
				var oPromise;
				var bAborted = false;

				return new Promise(
					function (resolve, reject) {
						debugger;
						oPromise = this._oProvider.getRequestLogsInfo(oSelectedPoItem, oSelectedSid, oSelecteditemNo);
						this._aRequests.push(oPromise);
						oPromise
							.then(
								function (aRequestLogsInfo) { 
									debugger;
									this._oAppModel.setProperty(
										"/REQUEST_LogsInfo",aRequestLogsInfo
									);
									resolve(aRequestLogsInfo);
									console.log(aRequestLogsInfo);
								}.bind(this)
							)							
							.catch(function (oResponse) {
								bAborted = oResponse.readyState === XMLHttpRequest.UNSENT;

                                if (!bAborted) {
                                    reject({
                                        response: oResponse
                                    });
                                }
							});
					}.bind(this)					
				);
			}
        });
	}
);