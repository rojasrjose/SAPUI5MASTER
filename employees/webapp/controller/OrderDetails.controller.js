sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
      * @param {typeof sap.ui.core.mvc.Controller} Controller
      * @param {Typeof sap.ui.core.routing.History} History
      * @param {Typeof sap.m.MessageBox} MessageBox
      * @param {typeof sap.ui.model.Filter} Filter
      * @param {typeof sap.ui.model.FilterOperator} FilterOperator  
      */
    function (Controller, History, MessageBox, Filter, FilterOperator) {
        'use strict';

        function _onObjectMatched(oEvent) {

            this.onclearSignature();

            this.getView().bindElement({
                path: "/Orders(" + oEvent.getParameter("arguments").OrderId + ")",
                model: "odataNorthwind",
                events: {
                    dataReceived: function (oData) {
                        _readSignature.bind(this)(oData.getParameter("data").OrderID, oData.getParameter("data").EmployeeID);
                    }.bind(this)
                }
            });

            const objContext = this.getView().getModel("odataNorthwind").getContext("/Orders("
                + oEvent.getParameter("arguments").OrderId + ")").getObject();

            if (objContext) {
                _readSignature.bind(this)(objContext.OrderID, objContext.EmployeeID);
            }
        };

        function _readSignature(orderId, employeeId) {

            //Read Signature Image    
            this.getView().getModel("incidenceModel").read("/SignatureSet(OrderId='" + orderId
                + "',SapId='" + this.getOwnerComponent().SapId
                + "',EmployeeId='" + employeeId + "')", {
                success: function (data) {
                    const signature = this.getView().byId("signature");
                    if (data.MediaContent !== "") {
                        signature.setSignature("data:image/png;base64," + data.MediaContent);
                    }

                }.bind(this),
                error: function (data) {
                }
            });
            //Bind Files
            this.byId("uploadCollection").bindAggregation("items", {
                path: "incidenceModel>/FilesSet",
                filters: [
                    new Filter("OrderId", FilterOperator.EQ, orderId),
                    new Filter("SapId", FilterOperator.EQ, this.getOwnerComponent().SapId),
                    new Filter("EmployeeId", FilterOperator.EQ, employeeId),
                ],
                template: new sap.m.UploadCollectionItem({
                    documentId: "{incidenceModel>AttId}",
                    visibleEdit: false,
                    fileName: "{incidenceModel>FileName}"
                }).attachPress(this.downloadFile)
            });
        };

        function on_Init() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteOrderDetails").attachPatternMatched(_onObjectMatched, this);
        };

        function on_Back() {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMain", true);
            }

        };

        function on_clearSignature(oEvent) {
            var signature = this.byId("signature");
            signature.clear();
        };

        function factory_OrderDetails(listId, oContext) {
            var contextObject = oContext.getObject();
            contextObject.Currency = "EUR";

            var unitsInStock = oContext.getModel().getProperty("/Products(" + contextObject.ProductID + ")/UnitsInStock");

            if (contextObject.Quantity <= unitsInStock) {
                var objectListItems = new sap.m.ObjectListItem({
                    title: "{odataNorthwind>/Products(" + contextObject.ProductID + ")/ProductName} ({odataNorthwind>Quantity})",
                    number: "{parts: [ {path: 'odataNorthwind>UnitPrice'},{path: 'odataNorthwind>Currency'}], type:'sap.ui.model.type.Currency', formatOptions: {showMeasure: false}}",
                    numberUnit: "{odataNorthwind>Currency}"
                });
                return objectListItems;
            } else {
                var customListItem = new sap.m.CustomListItem({
                    content: [
                        new sap.m.Bar({
                            contentLeft: new sap.m.Label({ text: "{odataNorthwind>/Products(" + contextObject.ProductID + ")/ProductName} ({odataNorthwind>Quantity})" }),
                            contentMiddle: new sap.m.ObjectStatus({ text: "{i18n>availableStock} {odataNorthwind>/Products(" + contextObject.ProductID + ")/UnitsInStock}", state: "Error" }),
                            contentRight: new sap.m.Label({ text: "{parts: [{path: 'odataNorthwind>UnitPrice'},{path: 'odataNorthwind>Currency'}], type: 'sap.ui.model.type.Currency'}" })
                        })
                    ]
                });
                return customListItem;
            }
        };

        function on_SaveSignature(oEvent) {
            const signature = this.byId("signature");
            const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            let signaturePng;

            if (!signature.isFill()) {
                MessageBox.error(oResourceBundle.getText("fillSignature"));
            } else {
                signaturePng = signature.getSignature().replace("data:image/png;base64,", "");
                let objectOrder = oEvent.getSource().getBindingContext("odataNorthwind").getObject();
                let body = {
                    OrderId: objectOrder.OrderID.toString(),
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: objectOrder.EmployeeID.toString(),
                    MimeType: "image/png",
                    MediaContent: signaturePng
                };
                this.getView().getModel("incidenceModel").create("/SignatureSet", body, {
                    success: function () {
                        MessageBox.information(oResourceBundle.getText("signatureSaved"));
                    },
                    error: function () {
                        MessageBox.error(oResourceBundle.getText("signatureNotSaved"));
                    },
                })
            };
        };

        function on_FileBeforeUploadStarts(oEvent) {
            let fileName = oEvent.getParameter("fileName");
            let objContext = oEvent.getSource().getBindingContext("odataNorthwind").getObject();
            let oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                name: "slug",
                value: objContext.OrderID + ";" + this.getOwnerComponent().SapId + ";" + objContext.EmployeeID + ";" + fileName
            });
            oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
        };

        function on_FileChange(oEvent) {
            let oUploadCollection = oEvent.getSource();

            //Header Token CSRF - Cross-site request forgery
            let oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
                name: "x-csrf-token",
                value: this.getView().getModel("incidenceModel").getSecurityToken()
            });

            oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
        };

        function on_FileUploadComplete(oEvent){
            oEvent.getSource().getBinding("items").refresh();
        };

        function on_FileDeleted(oEvent){
            var oUploadCollection = oEvent.getSource();
            var sPath = oEvent.getParameter("item").getBindingContext("incidenceModel").getPath();
            this.getView().getModel("incidenceModel").remove(sPath,{
                success: function() {
                    oUploadCollection.getBinding("items").refresh();
                },
                error: function(){}
            }).bind(this);
        };

        function downloadFile(oEvent){
            const sPath = oEvent.getSource().getBindingContext("incidenceModel").getPath();
            window.open("/sap/opu/odata/sap/YSAPUI5_SRV_01" + sPath + "/$value");
        };

        return Controller.extend("logaligroup.employees.controller.OrderDetails", {
            onInit: on_Init,
            onBack: on_Back,
            onclearSignature: on_clearSignature,
            factoryOrderDetails: factory_OrderDetails,
            onSaveSignature: on_SaveSignature,
            onFileBeforeUploadStarts: on_FileBeforeUploadStarts,
            onFileChange: on_FileChange,
            onFileUploadComplete: on_FileUploadComplete,
            onFileDeleted: on_FileDeleted,
            downloadFile: downloadFile

        });
    });