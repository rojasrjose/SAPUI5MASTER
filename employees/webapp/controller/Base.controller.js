sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
      * @param {typeof sap.ui.core.mvc.Controller} Controller
      */
    function (Controller) {
        'use strict';

         function on_Init() {          
        };

        function to_OrderDetails(oEvent) {
            
            var orderID = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            
            oRouter.navTo("RouteOrderDetails", {
                OrderId : orderID
            });
        };

        return Controller.extend("logaligroup.employees.controller.Base", {
            onInit: on_Init,
            toOrderDetails: to_OrderDetails
            
        });
    });