sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
      * @param {typeof sap.ui.core.mvc.Controller} Controller
      * @param {typeof sap.ui.model.json.JSONModel} JSONModel
      */
    function (Controller, JSONModel) {
        'use strict';
        function on_Init() {
            var oView = this.getView();

            var oJSONModelEmployees = new JSONModel();
            oJSONModelEmployees.loadData("./localService/mockdata/Employees.json", false);
            oView.setModel(oJSONModelEmployees, "jsonEmployees");

            var oJSONModelCountries = new JSONModel();
            oJSONModelCountries.loadData("./localService/mockdata/Countries.json", false);
            oView.setModel(oJSONModelCountries, "jsonCountries");

            var oJSONModelLayouts = new JSONModel();
            oJSONModelLayouts.loadData("./localService/mockdata/Layouts.json", false);
            oView.setModel(oJSONModelLayouts, "jsonLayouts");

            var oJSONModelConfig = new JSONModel({
                visibleID: true,
                visibleName: true,
                visibleCountry: true,
                visibleCity: false,
                visibleBtnShowCity: true,
                visibleBtnHideCity: false,
            });
            oView.setModel(oJSONModelConfig, "jsonModelConfig");

            this._bus = sap.ui.getCore().getEventBus();

            this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);

        };        

        function showEmployeeDetails(category, nameEvent, path) {

            var detailsView = this.getView().byId("employeeDetailsView");
            detailsView.bindElement("jsonEmployees>" + path);
            this.getView().getModel("jsonLayouts").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

            var incidenceModel = new JSONModel([]);
            detailsView.setModel(incidenceModel,"incidenceModel");

            detailsView.byId("tableIncidence").removeAllContent();
        };

        return Controller.extend("logaligroup.employees.controller.Main", {
            onInit: on_Init,
            showEmployeeDetails: showEmployeeDetails
            
        });
    });