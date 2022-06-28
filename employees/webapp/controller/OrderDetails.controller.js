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

        function factory_OrderDetails(listId, oContext){
            var contextObject = oContext.getObject();
            contextObject.Currency = "EUR";

            var unitsInStock = oContext.getModel().getProperty("/Products(" + contextObject.ProductID + ")/UnitsInStock");

            if (contextObject.Quantity <= unitsInStock){
                var objectListItems = new sap.m.ObjectListItem({
                    title : "{odataNorthwind>/Products(" + contextObject.ProductID + ")/ProductName} ({odataNorthwind>Quantity})",
                    number : "{parts: [ {path: 'odataNorthwind>UnitPrice'},{path: 'odataNorthwind>Currency'}], type:'sap.ui.model.type.Currency', formatOptions: {showMeasure: false}}",
                    numberUnit : "{odataNorthwind>Currency}"
                });
                return objectListItems;
            }else{
                var customListItem = new sap.m.CustomListItem({
                    content: [
                       new sap.m.Bar({
                           contentLeft: new sap.m.Label({text: "{odataNorthwind>/Products(" + contextObject.ProductID + ")/ProductName} ({odataNorthwind>Quantity})"}),
                           contentMiddle: new sap.m.ObjectStatus({text:"{i18n>availableStock} {odataNorthwind>/Products(" + contextObject.ProductID + ")/UnitsInStock}", state: "Error"}),
                           contentRight:  new sap.m.Label({text: "{parts: [{path: 'odataNorthwind>UnitPrice'},{path: 'odataNorthwind>Currency'}], type: 'sap.ui.model.type.Currency'}"})
                       })     
                    ]
                });
                return  customListItem;
            }
        };
        return Controller.extend("logaligroup.employees.controller.OrderDetails", {            
            onInit: on_Init,
            onBack: on_Back,
            onclearSignature: on_clearSignature,
            factoryOrderDetails: factory_OrderDetails            
        });
    });