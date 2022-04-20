sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, JSONModel, Filter, FilterOperator) {
        "use strict";

        function onInit() {
            var oJSONModel = new JSONModel();
            var oView = this.getView();
            var i18nBundle = oView.getModel("i18n").getResourceBundle();

            // var oJSON = {
            //     employeeId: "12345",
            //     countryKey: "UK",
            //     listCountry: [
            //         {
            //             key: "US",
            //             text: i18nBundle.getText("countryUS")
            //         },
            //         {
            //             key: "UK",
            //             text: i18nBundle.getText("countryUK")
            //         },
            //         {
            //             key: "ES",
            //             text: i18nBundle.getText("countryES")
            //         }
            //     ]
            // };
            // oJSONModel.setData(oJSON);
            
            oJSONModel.loadData("./localService/mockdata/Employees.json", false);
            // oJSONModel.attachRequestCompleted( function (oEventModel) {
            //     console.log(JSON.stringify(oJSONModel.getData()));
            // });
            oView.setModel(oJSONModel);
        };

        function on_Filter() {
           var oJSON = this.getView().getModel().getData();
           var filters = [];
           
           if  (oJSON.EmployeeId !== ""){
            filters.push( new Filter("EmployeeID", FilterOperator.EQ, oJSON.EmployeeId))
           } 
           if  (oJSON.CountryKey !== ""){
            filters.push( new Filter("Country", FilterOperator.EQ, oJSON.CountryKey))
           }

           var oList = this.getView().byId("tableEmployee");
           var oBinding = oList.getBinding("items");
           oBinding.filter(filters);
        };

        function on_ClearFilter() {
            var oModel = this.getView().getModel();

            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");
        };
        
        function myCheck() {
            var inputEmployee = this.byId("inputEmployee");
            var valueEmployee = inputEmployee.getValue();

            if (valueEmployee.length === 6) {
                // inputEmployee.setDescription(oResourceBundle.getText("textOk"));
                this.getView().byId("labelCountry").setVisible(true);
                this.getView().byId("slCountry").setVisible(true);
            } else {
                // inputEmployee.setDescription(oResourceBundle.getText("textNotok"));    
                this.getView().byId("labelCountry").setVisible(false);
                this.getView().byId("slCountry").setVisible(false);
            };
        };

        function show_PostalCode(oEvent) {
            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext();
            var objectContext = oContext.getObject();

            sap.m.MessageToast.show(objectContext.PostalCode);
        };

        return Controller.extend("logaligroup.employees.controller.MainView", {

            onInit: onInit,
            onValidate: myCheck,
            onFilter: on_Filter,
            onClearFilter: on_ClearFilter,
            showPostalCode: show_PostalCode
        });
    });
