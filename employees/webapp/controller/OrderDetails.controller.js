sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
],
    /**
      * @param {typeof sap.ui.core.mvc.Controller} Controller
      * @param {Typeof sap.ui.core.routing.History} History
      */
    function (Controller, History) {
        'use strict';
        
        function _onObjectMatched(oEvent){
            this.getView().bindElement({
                path: "/Orders(" + oEvent.getParameter("arguments").OrderId + ")", 
                model: "odataNorthwind"
            });
        };

         function on_Init() {          
             var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
             oRouter.getRoute("RouteOrderDetails").attachPatternMatched(_onObjectMatched, this);
        };

        function on_Back() {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if ( sPreviousHash !== undefined){
                window.history.go(-1);
            }else{
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMain", true);
            }

        };
         
        function on_clearSignature(oEvent) {
            var signature = this.byId("signature");
            signature.clear();
        };

        return Controller.extend("logaligroup.employees.controller.OrderDetails", {            
            onInit: on_Init,
            onBack: on_Back,
            onclearSignature: on_clearSignature
            
        });
    });