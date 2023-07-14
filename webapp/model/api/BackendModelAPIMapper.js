sap.ui.define(["../../utils/types/SiemensDateTimeType"], function (SiemensDateTimeType) {
	"use strict";

	return {
		convertPOItems: function (oBackendModelAPI, aPOItems) {
			aPOItems.forEach(
				function (oPOItem) {
					// Extend Alert information
					this._processAlertsOfPOItem(oBackendModelAPI, oPOItem);

					this._joinPOItemProperties(
						oPOItem,
						"PURCHASE_ORDER_NO",
						"PURCHASE_ORDER_ITEM_NO",
						"PO_ITEM_JOINED",
						"-"
					);

					this._joinPOItemProperties(oPOItem, "PLANT_NO", "PLANT_NAME", "PLANT_JOINED", " - ");

					// Prepare Alert chain for filtering
					this.prepareAlertChain(oPOItem);
				}.bind(this)
			);
		},

		convertConfirmations: function (aConfirmations) {
			return aConfirmations.map(function (oConfirmation) {
				oConfirmation.EDITABLE = false;
				return oConfirmation;
			});
		},

		convertDeliveries: function (aDeliveries) {
			return aDeliveries.map(function (oDelivery) {
				oDelivery.EDITABLE = false;
				return oDelivery;
			});
		},

		mapPOItemsToUniquePONumbers: function (aPOItems) {
			var aAllPONumbers = aPOItems.map(function (oPOItem) {
				return oPOItem.PURCHASE_ORDER_NO;
			});

			var aUniquePONumbers = Array.from(new Set(aAllPONumbers));

			return aUniquePONumbers.map(function (sUniquePONumber) {
				return { PURCHASE_ORDER_NO: sUniquePONumber };
			});
		},

		prepareAlertChain: function (oPOItem) {
			var sActiveAlertsChain;

			if (Object.prototype.hasOwnProperty.call(oPOItem, "ALERTS")) {
				sActiveAlertsChain = oPOItem.ALERTS.reduce(function (oResult, oActiveAlert) {
					return oResult + oActiveAlert.ALERT_TYPE_ID + ", ";
				}, "");

				if (sActiveAlertsChain.length > 1) {
					sActiveAlertsChain = sActiveAlertsChain.slice(0, -2);
				}

				oPOItem.ACTIVE_ALERTS_CHAIN = sActiveAlertsChain;
			}

			return sActiveAlertsChain;
		},

		_processAlertsOfPOItem: function (oBackendModelAPI, oPOItem) {
			var oAlertsConfig = oBackendModelAPI._oConstantsModel.getProperty("/ALERTS_CONFIG");
			var oSiemensDateTimeType = new SiemensDateTimeType();
			var oActiveAlertConfig;

			if (Object.prototype.hasOwnProperty.call(oPOItem, "ALERTS")) {
				oPOItem.ALERTS.forEach(
					function (oActiveAlert) {
						oActiveAlertConfig = oAlertsConfig[oActiveAlert.ALERT_TYPE_ID];
						oActiveAlert.ALERT_ICON = oActiveAlertConfig.ALERT_ICON;
						oActiveAlert.ALERT_TEXT = oBackendModelAPI._oBundle.getText(
							oActiveAlertConfig.ALERT_TYPE_TEXT_ID
						);
						oActiveAlert.ALERT_ACTIVATION = oSiemensDateTimeType.formatValue(
							oActiveAlert.ACTIVATION_TIMESTAMP
						);
					}.bind(this)
				);
			}
		},

		_joinPOItemProperties: function (oPOItem, s1stPropName, s2ndPropName, sJoinedPropName, sSeparator) {
			return (oPOItem[sJoinedPropName] = oPOItem[s1stPropName] + oPOItem[sSeparator] + s2ndPropName);
		}
	};
});
