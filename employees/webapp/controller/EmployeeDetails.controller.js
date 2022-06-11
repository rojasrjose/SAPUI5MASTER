sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "logaligroup/employees/model/formatter"
], 
   /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller     
     */
function(Controller, formatter) {
    'use strict';
    function on_Init() {
        
    };
    function on_CreateIncidence(){

        var tableIncidence = this.getView().byId("tableIncidence");
        var newIncidence   = sap.ui.xmlfragment("logaligroup.employees.fragment.NewIncidence", this);
        var incidenceModel = this.getView().getModel("incidenceModel");
        var oData = incidenceModel.getData();
        var index = oData.length;
        oData.push({ index : index + 1 });
        incidenceModel.refresh();
        newIncidence.bindElement("incidenceModel>/" + index);
        tableIncidence.addContent(newIncidence);

    };    
    
    function on_DeleteIncidence(oEvent){
        var tableIncidence = this.getView().byId("tableIncidence");
        var rowIncidence = oEvent.getSource().getParent().getParent();
        var incideceModel = this.getView().getModel("incidenceModel");
        var oData = incideceModel.getData();
        var contextObjet = rowIncidence.getBindingContext("incidenceModel").getObject();

        oData.splice(contextObjet.index-1,1);
        
        for( var i in oData ){
            oData[i].index = parseInt(i) + 1;
        };

        incideceModel.refresh();
        tableIncidence.removeContent(rowIncidence);
        
        for( var j in tableIncidence.getContent()){
            tableIncidence.getContent()[j].bindElement("incidenceModel>/" + j);   
        }

    };

    return Controller.extend("logaligroup.employees.controller.EmployeeDetails", {
        onInit: on_Init,
        onCreateIncidence: on_CreateIncidence,
        Formatter: formatter,
        onDeleteIncidence: on_DeleteIncidence
    });
});