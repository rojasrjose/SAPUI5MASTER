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

         function on_Init() {          

        };

        return Controller.extend("logaligroup.employees.controller.App", {
            onInit: on_Init,
            
        });
    });