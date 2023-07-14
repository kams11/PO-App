sap.ui.define([
    "./Base.controller",
    'sap/ui/model/json/JSONModel',
	"sap/m/MessageToast",
	"sap/m/MessageBox",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, JSONModel, MessageToast, MessageBox) {
        "use strict";

        return BaseController.extend("com.example.podemo.controller.Main", {
            onInit: function () {
                BaseController.prototype.onInit.call(this);
                    var oModel = new JSONModel(),
                    oInitialModelState = Object.assign({});
                
        
                oModel.setData(oInitialModelState);
                this.getView().setModel(oModel);

                var oFormDataModel = new sap.ui.model.json.JSONModel(oFormData);
                this.getView().setModel(oFormDataModel, "formData");
                var oFormData = {
                    selectedDate: null,
                    carrier: "",
                    trackingNumber: "",
                    countryOfOrigin: ""
                };

                this._oWizard = this.byId("CreatePOWizard");
                this._iSelectedStepIndex = 0;
                this._oSelectedStep = this._oWizard.getSteps()[this._iSelectedStepIndex];

			this.handleButtonsVisibility();

            this._oRouter.getRoute("main").attachPatternMatched(this.onViewPatternMatched, this);
			this._fetchRequestPO(); //method called to search the data for POItems Table

             var oTreeTable = this.getView().byId("TreeTablePOitems");
                oTreeTable.attachRowSelectionChange(this.onRowSelectionChange, this);

                var oTreeTableSN = this.getView().byId("TreeTablePOSerialNumbers");
                oTreeTableSN.attachRowSelectionChange(this.onSNSelectionChange, this);
            },

            onRowSelectionChange: function(oEvent) {
                debugger;
                var oSelectedItem = oEvent.getParameter("rowContext").getObject();
                var oSelectedPoItem = oSelectedItem.PURCHASE_ORDER_NO; 
                this._fetchRequestPOSN(oSelectedPoItem);  //method called to search the data for Serial Number Table
              },
              onSNSelectionChange: function(oEvent) {
                debugger;               
                var oSelectedItem = oEvent.getParameter("rowContext").getObject();
                var oSelectedPoItem = oSelectedItem.PURCHASE_ORDER_NO; 
                var oSelectedSid = oSelectedItem.SAP_SYSTEM_ID; 
                var oSelecteditemNo = oSelectedItem.PURCHASE_ORDER_ITEM_NO;
                
                console.log(oSelectedPoItem,oSelectedSid,oSelecteditemNo);
                this._fetchRequestLogsInfo(oSelectedPoItem,oSelectedSid,oSelecteditemNo); //method called to search the data for Logs Info table
              },

              onViewPatternMatched: function () {
                this._oAppModel.updateBindings(true);
            },
            _fetchRequestPO: function () {
                //debugger;
                if (this._oComponent._oBackendModelAPI) {
      
                  this._oComponent._oBackendModelAPI
                    .getRequestPO()
                    .then(this.onRequestLoadedPO.bind(this))
                    .catch(this.onRequestLoadFailedPO.bind(this));
                }
              },
              _fetchRequestPOSN: function (oSelectedPoItem) {
                //debugger;
                if (this._oComponent._oBackendModelAPI) {
      
                  this._oComponent._oBackendModelAPI
                    .getRequestPOSN(oSelectedPoItem)
                    .then(this.onRequestLoadedPOSN.bind(this))
                    .catch(this.onRequestLoadFailedPOSN.bind(this));
                }
              },
              _fetchRequestLogsInfo: function (oSelectedPoItem, oSelectedSid, oSelecteditemNo) {
                if (this._oComponent._oBackendModelAPI) {
                    this._oComponent._oBackendModelAPI
                        .getRequestLogsInfo(oSelectedPoItem, oSelectedSid, oSelecteditemNo)
                        .then(this.onRequestLoadedLogsInfo.bind(this))
                        .catch(this.onRequestLoadFailedLogsInfo.bind(this));
                }
            },
              onRequestLoadedPO: function () {
                this._postProcessInitialDataLoadPO(true);
              },
              onRequestLoadedPOSN: function () {
                this._postProcessInitialDataLoadPOSN(true);
              },
              onRequestLoadedLogsInfo: function (aLogs) {
                this._postProcessInitialDataLoadLogsInfo(aLogs);
            },
      
              onRequestLoadFailedPO: function (oResponse) {
                this._postProcessInitialDataLoadPO(false);
              },
              onRequestLoadFailedPOSN: function (oResponse) {
                this._postProcessInitialDataLoadPOSN(false);
              },
              onRequestLoadFailedLogsInfo: function (oResponse) {
                this._postProcessInitialDataLoadLogsInfo(false);
              },

              _postProcessInitialDataLoadPO: function () {
                var aRequest =
                  this._oAppModel.getProperty("/REQUEST_PO") || [];
              },
              _postProcessInitialDataLoadPOSN: function () {
                var aRequest =
                  this._oAppModel.getProperty("/REQUEST_POSN") || [];
              },
              _postProcessInitialDataLoadLogsInfo: function (aLogs) {
                var oModel = this.getView().getModel();
                oModel.setProperty("/REQUEST_LogsInfo", aLogs);
            },
    
         
             
            
       
    
            handleButtonsVisibility: function () {
                var oModel = this.getView().getModel();
                switch (this._iSelectedStepIndex){
                    case 0:
                        oModel.setProperty("/nextButtonVisible", true);
                        oModel.setProperty("/nextButtonEnabled", true);
                        oModel.setProperty("/backButtonVisible", false);
                        oModel.setProperty("/finishButtonVisible", false);
                        break;
                    case 1:
                        oModel.setProperty("/backButtonVisible", true);
                        oModel.setProperty("/nextButtonVisible", true);
                        oModel.setProperty("/finishButtonVisible", false);
                        break;
                    case 2:
                        oModel.setProperty("/nextButtonVisible", true);
                        oModel.setProperty("/backButtonVisible", true);
                        oModel.setProperty("/finishButtonVisible", false);
                        break;
                   
                    case 3:
                        oModel.setProperty("/nextButtonVisible", false);
                        oModel.setProperty("/finishButtonVisible", true);
                        oModel.setProperty("/backButtonVisible", true);
                        break;
                    default: break;
                }
    
            },
    
    
            handleNavigationChange: function (oEvent) { 
                this._oSelectedStep = oEvent.getParameter("step");
                this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);
                this.handleButtonsVisibility();
            },  
           
    
            snInfoValidation: function () {                            
                    debugger;
                    this.handleButtonsVisibility();
                    this._oWizard.invalidateStep(this.byId("SNInfoStep"));
                    this._oWizard.validateStep(this.byId("SNInfoStep"));
                
            },
           
            _handleNavigationToStep: function (iStepNumber) {
                this._pDialog.then(function(oDialog){
                    oDialog.open();
                    this._oWizard.goToStep(this._oWizard.getSteps()[iStepNumber], true);
                }.bind(this));
            },
    
            _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
                MessageBox[sMessageBoxType](sMessage, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this._oWizard.discardProgress(this._oWizard.getSteps()[0]);
                        }
                    }.bind(this)
                });
            },
    
            onDialogNextButton: function () {
                this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);
                var oNextStep = this._oWizard.getSteps()[this._iSelectedStepIndex + 1];
    
                if (this._oSelectedStep && !this._oSelectedStep.bLast) {
                    this._oWizard.goToStep(oNextStep, true);
                } else {
                    this._oWizard.nextStep();
                }
    
                this._iSelectedStepIndex++;
                this._oSelectedStep = oNextStep;
    
                this.handleButtonsVisibility();
            },
    
            onDialogBackButton: function () {
                this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);
                var oPreviousStep = this._oWizard.getSteps()[this._iSelectedStepIndex - 1];
    
                if (this._oSelectedStep) {
                    this._oWizard.goToStep(oPreviousStep, true);
                } else {
                    this._oWizard.previousStep();
                }
    
                this._iSelectedStepIndex--;
                this._oSelectedStep = oPreviousStep;
    
                this.handleButtonsVisibility();
            },
    
            handleWizardCancel: function () {
                this._handleMessageBoxOpen("Are you sure you want to cancel your shipment?", "warning");
            },
    
            handleWizardSubmit: function () {
                this._handleMessageBoxOpen("Are you sure you want to submit your shipment?", "confirm");
            },

            discardProgress: function () {
                var oModel = this.getView().getModel();
                this._oWizard.discardProgress(this.byId("ProductTypeStep"));
    
                var clearContent = function (aContent) {
                    for (var i = 0; i < aContent.length; i++) {
                        if (aContent[i].setValue) {
                            aContent[i].setValue("");
                        }
    
                        if (aContent[i].getContent) {
                            clearContent(aContent[i].getContent());
                        }
                    }
                };
                clearContent(this._oWizard.getSteps());
            },
            onRefreshPO: function() {
                var oTreeTable = this.getView().byId("TreeTablePOitems");
                var oModel = oTreeTable.getModel("app");
                var sPath = oTreeTable.getBindingPath("rows");
            
                oModel.refresh(true, sPath);
            },
            
            onCollapseAllitemsPress: function() {
                var oTreeTable = this.getView().byId("TreeTablePOitems");
                oTreeTable.collapseAll();
            },
            
            onExpandAllitemsPress: function() {
                var oTreeTable = this.getView().byId("TreeTablePOitems");
                oTreeTable.expandToLevel(9999);
            },
    
            // TreeTablePOSerialNumbers Table toolbar func.
            onSelectAllRowsPress: function() {
                var oTreeTable = this.getView().byId("TreeTablePOSerialNumbers");
                var oModel = oTreeTable.getModel("app");
                var oData = oModel.getData();
                var aRows = oData.REQUEST_POSN;

                for (var i = 0; i < aRows.length; i++) {
                    oTreeTable.addSelectionInterval(i, i);
                }
            },
            onDeselectAllRowsPress: function() {
                var oTreeTable = this.getView().byId("TreeTablePOSerialNumbers");
                oTreeTable.clearSelection();
            },
              onCollapseAllPress: function() {
                var oTreeTable = this.getView().byId("TreeTablePOSerialNumbers");
                oTreeTable.collapseAll();
            },  
            onExpandAllPress: function() {
                var oTreeTable = this.getView().byId("TreeTablePOSerialNumbers");
                oTreeTable.expandToLevel(9999);
            },
        });
    });
