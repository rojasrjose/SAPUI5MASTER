sap.ui.define([
    "logaligroup/employees/controller/Base.controller",
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
    function (Base, JSONModel, Filter, FilterOperator) {
        "use strict";

        function onInit() {
            this._bus = sap.ui.getCore().getEventBus();
        };

        function on_Filter() {
            var oJSONCountries = this.getView().getModel("jsonCountries").getData();
            var filters = [];

            if (oJSONCountries.EmployeeId !== "") {
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSONCountries.EmployeeId))
            }
            if (oJSONCountries.CountryKey !== "") {
                filters.push(new Filter("Country", FilterOperator.EQ, oJSONCountries.CountryKey))
            }

            var oList = this.getView().byId("tableEmployee");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);
        };

        function on_ClearFilter() {
            var oModel = this.getView().getModel("jsonCountries");

            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");
        };

        //function myCheck() {
        //    var inputEmployee = this.byId("inputEmployee");
        //    var valueEmployee = inputEmployee.getValue();
        //
        //    if (valueEmployee.length === 6) {
        //        // inputEmployee.setDescription(oResourceBundle.getText("textOk"));
        //        this.getView().byId("labelCountry").setVisible(true);
        //        this.getView().byId("slCountry").setVisible(true);
        //    } else {
        //        // inputEmployee.setDescription(oResourceBundle.getText("textNotok"));    
        //        this.getView().byId("labelCountry").setVisible(false);
        //        this.getView().byId("slCountry").setVisible(false);
        //    };
        //};

        function show_PostalCode(oEvent) {
            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext("odataNorthwind");
            var objectContext = oContext.getObject();

            sap.m.MessageToast.show(objectContext.PostalCode);
        };

        function on_ShowCity() {
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
            oJSONModelConfig.setProperty("/visibleCity", true);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", false);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", true);
        };

        function on_HideCity() {
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
            oJSONModelConfig.setProperty("/visibleCity", false);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", true);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", false);
        };

        function show_Orders(oEvent) {
            //Get Selected Controller
            var iconPressed = oEvent.getSource();
            //Context from the model
            var oContext = iconPressed.getBindingContext("odataNorthwind");

            if (!this._oDialogOrders) {
                this._oDialogOrders = sap.ui.xmlfragment("logaligroup.employees.fragment.DialogOrders", this);
                this.getView().addDependent(this._oDialogOrders);
            };
            //Dialog Binding to the Context to have access to data of selected items
            this._oDialogOrders.bindElement("odataNorthwind>" + oContext.getPath());
            //Open the Dialog
            this._oDialogOrders.open();
        };

        function on_CloseOrders() {
            this._oDialogOrders.close();
        };

        function show_Employee(oEvent) {

            //Get Selected Controller
            var iconPressed = oEvent.getSource();
            //Context from the model
            var oContext = iconPressed.getBindingContext("odataNorthwind");
            var path = oContext.getPath();

            this._bus.publish("flexible", "showEmployee", path);
        };

        return Base.extend("logaligroup.employees.controller.MasterEmployee", {

            onInit: onInit,
            //onValidate: myCheck,
            onFilter: on_Filter,
            onClearFilter: on_ClearFilter,
            showPostalCode: show_PostalCode,
            onShowCity: on_ShowCity,
            onHideCity: on_HideCity,
            showOrders: show_Orders,
            onCloseOrders: on_CloseOrders,
            showEmployee: show_Employee
        });
    });
