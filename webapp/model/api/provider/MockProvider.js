// @ts-nocheck
/* eslint-disable @sap/ui5-jsdocs/no-jsdoc */
sap.ui.define(["sap/ui/base/Object"], function (UI5Object) {
	"use strict";

	var sMockdataPath = jQuery.sap.getModulePath("com.example.podemo") + "/model/api/mockdata/";

	var aDataSets = [
		"POsWithLineItems",
		"POLineItemsSerialNumbers",
		"PostShipmentResponse"
	];

	var oSimulateError = {
		getRequestPO: false
	};

	return UI5Object.extend("com.example.podemo.model.api.provider.MockProvider", {
		_iDelay: 1000,
		_oData: {},
		_oInitialDataLoadPromise: {},

		constructor: function () {
            this._sUserName = "DUMMY_USER";
			this._oInitialDataLoadPromise = Promise.all(this._getDataLoadPromises());
		},

		_getDataLoadPromises: function () {
			return aDataSets.map(
				function (sDataSet) {
					return new Promise(
						function (resolve) {
							$.getJSON(
								sMockdataPath + sDataSet + ".json",
								function (oJson) {
									this._oData[sDataSet] = oJson;
									resolve();
								}.bind(this)
							);
						}.bind(this)
					);
				}.bind(this)
			);
		},

		_onDataReady: function () {
			return new Promise(
				function (resolve) {
					this._oInitialDataLoadPromise.then(
						function () {
							setTimeout(
								function () {
									resolve();
								}.bind(this),
								this._iDelay
							);
						}.bind(this)
					);
				}.bind(this)
			);
		},
		getRequestPO:function(){
			debugger;
			var aRequestPO;
			var oPromise = new Promise(
				function (resolve, reject) {
					this._onDataReady().then(
						function () { 	
							debugger;
								resolve(this._oData.POsWithLineItems);							
						}.bind(this)
					);
				}.bind(this)
			);
			oPromise.abort = function () {};
			return oPromise;
		},
		
		getRequestPOSN:function(oSelectedPoItem){
			debugger;
			var oPromise = new Promise(
				function (resolve, reject) {
					this._onDataReady().then(
						function () { 
							debugger;
																
							var aPOItems = this._oData.POLineItemsSerialNumbers.RESPONSE.filter(function (entry) {
								debugger;
								return entry.PURCHASE_ORDER_NO === oSelectedPoItem;
							});
								resolve(aPOItems);							
						}.bind(this)
					);
				}.bind(this)
			);
			oPromise.abort = function () {};
			return oPromise;
		},
		getRequestLogsInfo: function(oSelectedPoItem, oSelectedSid, oSelecteditemNo) {
			debugger;
			var oPromise = new Promise(function(resolve, reject) {
				this._onDataReady().then(function() {
					debugger;
					var aLogsInfo = this._oData.PostShipmentResponse.filter(function(item) {
						return (
							item.PURCHASE_ORDER.PURCHASE_ORDER_NO === oSelectedPoItem &&
							item.PURCHASE_ORDER.SAP_SYSTEM_ID === oSelectedSid
						);
					});
		
					// Filter line items based on oSelecteditemNo
					aLogsInfo.forEach(function(item) {
						var filteredLineItems = item.PURCHASE_ORDER.LINE_ITEMS.filter(function(lineItem) {
							return lineItem.PURCHASE_ORDER_ITEM_NO === oSelecteditemNo;
						});
						item.PURCHASE_ORDER.LINE_ITEMS = filteredLineItems;
					});
		
					resolve(aLogsInfo);
				}.bind(this));
			}.bind(this));
		
			oPromise.abort = function() {};
			return oPromise;
		}
		
       
    },
	
	);
});
