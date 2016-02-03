/*!
 Mood Tracker Mobile
 https://github.com/alni/MoodTrackerMobile/
 ----------------------
 The MIT License (MIT)
  
 Copyright (c) 2016 Alexander Nilsen
  
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
  
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
  
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 ----------------------
 controller/detail/SettingsForm.controller.js
 */


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
