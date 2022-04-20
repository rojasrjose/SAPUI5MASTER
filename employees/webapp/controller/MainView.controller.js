sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        function myCheck() {
            var inputEmployee = this.byId("inputEmployee");
            var valueEmployee = inputEmployee.getValue();
            const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            if (valueEmployee.length === 6) {
               // inputEmployee.setDescription(oResourceBundle.getText("textOk"));
               this.getView().byId("labelCountry").setVisible(true);
               this.getView().byId("slCountry").setVisible(true);
            } else {
               // inputEmployee.setDescription(oResourceBundle.getText("textNotok"));    
               this.getView().byId("labelCountry").setVisible(false);
               this.getView().byId("slCountry").setVisible(false);          
            };
        }
        return Controller.extend("logaligroup.employees.controller.MainView", {

            onInit: function () {
            },

            onValidate: myCheck
        });
    });
