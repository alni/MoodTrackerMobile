sap.ui.define([
    "jquery.sap.global",
    "mood_tracker/controller/BaseController",
    "mood_tracker/model/Mood"
], function ($, BaseController, MoodModel) {
    "use strict";

    var SettingsForm = BaseController.extend("mood_tracker.controller.detail.SettingsForm", {
        onInit : function() {
            var oView = this.getView(),
                controller = this;
            //Helpers.applyUiSizeClass(oView);
            //oView.attachAfterRendering(this.updateLogMood, this);
            oView.addEventDelegate({
                onBeforeHide: function (evt) {
                    controller.saveSettings();
                }
            });
        },

        updateLogMood: function () {
            var oView = this.getView();
            //sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this.onRouteMatched, this);

            var model = oView.getModel("mood");
        },

        updateMood: function (oEvent) {
            var oView = this.getView(),
                oSource = oEvent.getSource(),
                sType = oSource.data("type"),
                oSlider = oView.byId(oSource.data("inputId")),
                oModel = oView.getModel("mood"),
                currentDay = new Date().getDay();
            switch (sType) {
                case "decrement":
                    oSlider.stepDown(1);
                    break;
                case "increment":
                    oSlider.stepUp(1);
                    break;
            }
            //oModel.setProperty("/past/" + currentDay, oSource.getValue());
            //oModel.refresh(true);
        },

        saveSettings : function(oEvent) {
            var oView = this.getView(),
                oModel = oView.getModel("mood");
            MoodModel.storeValue("moodMin", oModel.getProperty("/min"));
            MoodModel.storeValue("moodMax", oModel.getProperty("/max"));
        },

        onNavBack: function () {
            this.destroyFragments();
            sap.ui.core.UIComponent.getRouterFor(this).backWithoutHash(this.getView());
        },
    });


    return SettingsForm;

}, /* bExport= */ true);
