sap.ui.define([    
    "logaligroup/employees/controller/Base.controller",
    "logaligroup/employees/model/formatter",
    "sap/m/MessageBox"
],
    /**
      * @param {typeof sap.ui.core.mvc.Controller} Controller     
      */
    function (Base, formatter, MessageBox) {
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
            oData.push({ index: index + 1, _ValidateDate: false, EnabledSave: false });
            incidenceModel.refresh();
            newIncidence.bindElement("incidenceModel>/" + index);
            tableIncidence.addContent(newIncidence);

        };

        function on_DeleteIncidence(oEvent) {
            var context = oEvent.getSource().getBindingContext("incidenceModel");
            var contextObj = context.getObject();
            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            MessageBox.confirm(oResourceBundle.getText("confirmDeleteIncidence"), {

                onClose: function (oAction) {

                    if (oAction === "OK") {
                        this._bus.publish("incidence", "onDeleteIncidence", {
                            IncidenceId: contextObj.IncidenceId,
                            SapId: contextObj.SapId,
                            EmployeeId: contextObj.EmployeeId
                        });
                    }
                }.bind(this)
            });
        };

        function on_SaveIncidence(oEvent) {
            var incidence = oEvent.getSource().getParent().getParent();
            var incidenceRow = incidence.getBindingContext("incidenceModel");
            
            this._bus.publish("incidence", "onSaveIncidence", { incidenceRow: incidenceRow.sPath.replace('/', '') });

        };

        function update_IncidenceCreationDate(oEvent) {

            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            let context = oEvent.getSource().getBindingContext("incidenceModel");
            let contextObj = context.getObject();

            if (!oEvent.getSource().isValidValue()) {
                contextObj._ValidateDate = false;
                contextObj.CreationDateState = oResourceBundle.getText("errorState");
                MessageBox.error(oResourceBundle.getText("invalidDate"), {
                    title: oResourceBundle.getText("errorState"),
                    onClose: null,
                    styleClass: "",
                    actions: MessageBox.Action.Close,
                    emphasizedAction: null,
                    initialFocus: null,
                    textDirection: sap.ui.core.TextDirection.Inherit

                });
            } else {
                contextObj.CreationDateX = true;
                contextObj._ValidateDate = true;
                contextObj.CreationDateState = oResourceBundle.getText("noneState");;
            };

            if (oEvent.getSource().isValidValue() && contextObj.Reason) {
                contextObj.EnabledSave = true;
            } else {
                contextObj.EnabledSave = false;
            };

            context.getModel().refresh();
        };

        function update_IncidenceReason(oEvent) {

            let context = oEvent.getSource().getBindingContext("incidenceModel");
            let contextObj = context.getObject();

            if (oEvent.getSource().getValue()) {
                contextObj.ReasonX = true;
                contextObj.ReasonState = "None";
            } else {
                contextObj.ReasonState = "Error";
            };

            if (contextObj._ValidateDate && oEvent.getSource().getValue()) {
                contextObj.EnabledSave = true;
            } else {
                contextObj.EnabledSave = false;
            };
            context.getModel().refresh();
        };

        function update_IncidenceType(oEvent) {
            var context = oEvent.getSource().getBindingContext("incidenceModel");
            var contextObj = context.getObject();
            contextObj.TypeX = true;

            if (contextObj._ValidateDate && contextObj.Reason) {
                contextObj.EnabledSave = true;
            } else {
                contextObj.EnabledSave = false;
            };
            context.getModel().refresh();
        };

        return Base.extend("logaligroup.employees.controller.EmployeeDetails", {
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