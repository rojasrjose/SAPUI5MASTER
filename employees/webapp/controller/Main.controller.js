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

        function onBeforeRendering() {

            this._detailEmployeeView = this.getView().byId("employeeDetailsView");
        };

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
            this._bus.subscribe("incidence", "onSaveIncidence", this.saveODataIncidence, this);

            this._bus.subscribe("incidence", "onDeleteIncidence", function (chanelId, eventId, data) {

                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                this.getView().getModel("incidenceModel").remove("/IncidentsSet(IncidenceId='" + data.IncidenceId +
                    "',SapId='" + data.SapId + "',EmployeeId='" + data.EmployeeId + "')", {
                    success: function () {
                        this.onReadODataIncidence.bind(this)(data.EmployeeId);
                        sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteOk"));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteKO"));
                    }.bind(this)
                });

            }, this);

        };

        function showEmployeeDetails(category, nameEvent, path) {

            var detailsView = this.getView().byId("employeeDetailsView");
            detailsView.bindElement("odataNorthwind>" + path);
            this.getView().getModel("jsonLayouts").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

            var incidenceModel = new JSONModel([]);
            detailsView.setModel(incidenceModel, "incidenceModel");
            detailsView.byId("tableIncidence").removeAllContent();

            this.onReadODataIncidence(this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID);
        };

        function saveODataIncidence(chanelId, eventId, data) {

            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var employeeId = this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID;
            var incidenceModel = this._detailEmployeeView.getModel("incidenceModel").getData();

            if (typeof incidenceModel[data.incidenceRow].IncidenceId == 'undefined') {

                var body = {
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: employeeId.toString(),
                    CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                    Type: incidenceModel[data.incidenceRow].Type,
                    Reason: incidenceModel[data.incidenceRow].Reason
                };
                this.getView().getModel("incidenceModel").create("/IncidentsSet", body, {
                    success: function () {
                        this.onReadODataIncidence.bind(this)(employeeId);
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOk"));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveKO"));
                    }.bind(this)
                })
            } else if (incidenceModel[data.incidenceRow].CreationDateX ||
                incidenceModel[data.incidenceRow].ReasonX ||
                incidenceModel[data.incidenceRow].TypeX) {

                var body = {
                    CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                    CreationDateX: incidenceModel[data.incidenceRow].CreationDateX,
                    Type: incidenceModel[data.incidenceRow].Type,
                    TypeX: incidenceModel[data.incidenceRow].TypeX,
                    Reason: incidenceModel[data.incidenceRow].Reason,
                    ReasonX: incidenceModel[data.incidenceRow].ReasonX

                };
                this.getView().getModel("incidenceModel").update("/IncidentsSet(IncidenceId='" + incidenceModel[data.incidenceRow].IncidenceId +
                    "',SapId='" + incidenceModel[data.incidenceRow].SapId +
                    "',EmployeeId='" + incidenceModel[data.incidenceRow].EmployeeId + "')", body, {
                    success: function () {
                        this.onReadODataIncidence.bind(this)(employeeId);
                        sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateOk"));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateKO"));
                    }.bind(this)
                });
            } else {
                sap.m.MessageToast.show(oResourceBundle.getText("odataNoChange"));
            };
        };

        function onReadODataIncidence(employeeID) {
            this.getView().getModel("incidenceModel").read("/IncidentsSet", {
                filters: [
                    new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                    new sap.ui.model.Filter("EmployeeId", "EQ", employeeID.toString())
                ],
                success: function (data) {
                    var incidenceModel = this._detailEmployeeView.getModel("incidenceModel");
                    incidenceModel.setData(data.results);
                    var tableIncidence = this._detailEmployeeView.byId("tableIncidence");
                    tableIncidence.removeAllContent();

                    for (var incidence in data.results) {
                        var newIncidence = sap.ui.xmlfragment("logaligroup.employees.fragment.NewIncidence", this._detailEmployeeView.getController());
                        this._detailEmployeeView.addDependent(newIncidence);
                        newIncidence.bindElement("incidenceModel>/" + incidence);
                        tableIncidence.addContent(newIncidence);
                    }
                }.bind(this),
                error: function (e) { }
            });
        };

        return Controller.extend("logaligroup.employees.controller.Main", {
            onInit: on_Init,
            showEmployeeDetails: showEmployeeDetails,
            onBeforeRendering: onBeforeRendering,
            saveODataIncidence: saveODataIncidence,
            onReadODataIncidence: onReadODataIncidence

        });
    });