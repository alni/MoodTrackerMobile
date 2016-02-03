sap.ui.define([
    "jquery.sap.global",
    "mood_tracker/controller/BaseController",
    "mood_tracker/model/Mood"
], function ($, BaseController, MoodModel) {
    "use strict";

    var LogMood = BaseController.extend("mood_tracker.controller.detail.LogMood", {
        onInit : function() {
            var oView = this.getView();
            var controller = this;
            //Helpers.applyUiSizeClass(oView);
            oView.attachAfterRendering(this.updateLogMood, this);
            oView.addEventDelegate({
                onBeforeHide: function (evt) {
                    controller.saveMood();
                }
            });
        },

        updateLogMood: function () {
            var oView = this.getView();
            //sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this.onRouteMatched, this);

            var model = oView.getModel("mood");
        },

        onCurrentMoodChange: function (oEvent) {
            var oView = this.getView(),
                oSource = oEvent.getSource(),
                oModel = oView.getModel("mood"),
                currentDay = new Date().getDay();
            oModel.setProperty("/past/" + currentDay, oSource.getValue());
            oModel.refresh(true);
        },

        saveMood: function () {
            var oView = this.getView(),
                oModel = oView.getModel("mood");
            MoodModel.storeValue("moods", oModel.getProperty("/past"));
        }
    });


    return LogMood;

}, /* bExport= */ true);
