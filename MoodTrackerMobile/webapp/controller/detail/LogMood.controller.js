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
 controller/detail/LogMood.controller.js
 */

sap.ui.define([
    "jquery.sap.global",
    "sap/ui/model/Sorter",
    "mood_tracker/controller/BaseController",
    "mood_tracker/model/Formatter",
    "mood_tracker/model/Mood",
    "mood_tracker/util/Helpers"
], function ($, Sorter, BaseController, Formatter, MoodModel, Helpers) {
    "use strict";

    var LogMood = BaseController.extend("mood_tracker.controller.detail.LogMood", {
        onInit : function() {
            var oView = this.getView(),
                controller = this;
            //Helpers.applyUiSizeClass(oView);
            oView.attachAfterRendering(this.updateLogMood, this);
            oView.addEventDelegate({
                onBeforeHide: function (evt) {
                    controller.saveMood();
                }
            });
        },

        updateLogMood: function () {
            var oView = this.getView(),
                oPastPanel = oView.byId("pastPanel"),
                oSorter,
                model = oView.getModel("mood"),
                mode = model.getProperty("/mode"),
                days, // = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
                today = new Date(),
                currentDay, maxDay, // = new Date().getDay() + 1,
                dayShift;
            //sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this.onRouteMatched, this);

            if (mode == "weekly") {
                oSorter = new Sorter("mood>day"),
                days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
                currentDay = today.getDay() + 1;
                maxDay = 7;
                /*if (currentDay > 6) {
                    currentDay = 0;
                }*/
            } else if (mode == "monthly") {
                oSorter = new Sorter("mood>date"),
                days = Helpers.range(1, 31, 1).map(String);
                maxDay = 31;
                currentDay = new Date().getDate();
            }
            if (currentDay > maxDay - 1) {
                currentDay = 0;
            }
            dayShift = -currentDay;

            oSorter.fnCompare = function (value1, value2) {
                var day1 = days.indexOf(("" + value1).toUpperCase()) + dayShift,
                    day2 = days.indexOf(("" + value2).toUpperCase()) + dayShift;
                if (day1 < 0) {
                    day1 += maxDay; //7;
                } else if (day1 > maxDay - 1) { //6) {
                    day1 -= maxDay; //7;
                }
                if (day2 < 0) {
                    day2 += maxDay; //7;
                } else if (day2 > maxDay - 1) { //6) {
                    day2 -= maxDay; //7;
                }
                if (day2 < day1) return -1;
                if (day2 == day1) return 0;
                if (day2 > day1) return 1;
            };

            oPastPanel.getBinding("content").sort(oSorter);
        },

        onCurrentMoodChange: function (oEvent) {
            var oView = this.getView(),
                oSource = oEvent.getSource(),
                oModel = oView.getModel("mood"),
                mode = oModel.getProperty("/mode"),
                currentDay;
            if (mode == "weekly") {
                currentDay = new Date().getDay();
            } else if (mode == "monthly") {
                currentDay = new Date().getDate() - 1;
            }
            oModel.setProperty("/past/" + currentDay + "/value", oSource.getValue());
            oModel.refresh(true);
        },

        saveMood: function () {
            var oView = this.getView(),
                oModel = oView.getModel("mood"),
                past = oModel.getProperty("/past");
            oModel.setProperty("/average", Formatter.average(past));
            oModel.setProperty("/median", Formatter.median(past));
            if (!this.isTESTING()) {
                //MoodModel.storeValue("moods", past);
                MoodModel.storeModelData(oModel, true);
            }
        }
    });


    return LogMood;

}, /* bExport= */ true);
