sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "logaligroup/employees/model/formatter"
],
    /**
      * @param {typeof sap.ui.core.mvc.Controller} Controller     
      */
    function (Controller, formatter) {
        'use strict';
        function on_Init() {
            this._bus = sap.ui.getCore().getEventBus();
        };
        function on_CreateIncidence() {

            var tableIncidence = this.getView().byId("tableIncidence");
            var newIncidence = sap.ui.xmlfragment("logaligroup.employees.fragment.NewIncidence", this);
            var incidenceModel = this.getView().getModel("incidenceModel");
            var oData = incidenceModel.getData();
            var index = oData.length;
            oData.push({ index: index + 1 });
            incidenceModel.refresh();
            newIncidence.bindElement("incidenceModel>/" + index);
            tableIncidence.addContent(newIncidence);

        };

        function on_DeleteIncidence(oEvent) {
            var context = oEvent.getSource().getBindingContext("incidenceModel");
            var contextObj = context.getObject();
            this._bus.publish("incidence", "onDeleteIncidence", { 
                IncidenceId: contextObj.IncidenceId,
                SapId: contextObj.SapId,
                EmployeeId: contextObj.EmployeeId
             });
            
        };

        function on_SaveIncidence(oEvent) {
            var incidence = oEvent.getSource().getParent().getParent();
            var incidenceRow = incidence.getBindingContext("incidenceModel");

            this._bus.publish("incidence", "onSaveIncidence", { incidenceRow: incidenceRow.sPath.replace('/', '') });

        };

        function update_IncidenceCreationDate(oEvent) {
            var context = oEvent.getSource().getBindingContext("incidenceModel");
            var contextObj = context.getObject();
            contextObj.CreationDateX = true;
        };

        function update_IncidenceReason(oEvent) {
            var context = oEvent.getSource().getBindingContext("incidenceModel");
            var contextObj = context.getObject();
            contextObj.ReasonX = true;
        };

        function update_IncidenceType(oEvent) {
            var context = oEvent.getSource().getBindingContext("incidenceModel");
            var contextObj = context.getObject();
            contextObj.TypeX = true;
        };

        return Controller.extend("logaligroup.employees.controller.EmployeeDetails", {
            onInit: on_Init,
            onCreateIncidence: on_CreateIncidence,
            Formatter: formatter,
            onDeleteIncidence: on_DeleteIncidence,
            onSaveIncidence: on_SaveIncidence,
            updateIncidenceCreationDate: update_IncidenceCreationDate,
            updateIncidenceReason: update_IncidenceReason,
            updateIncidenceType: update_IncidenceType
        });
    });