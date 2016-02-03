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
 controller/detail/Home.controller.js
 */

sap.ui.define([
    "jquery.sap.global",
    "sap/ui/model/json/JSONModel",
    "mood_tracker/controller/BaseController",
    "mood_tracker/model/Formatter"
], function($, JSONModel, BaseController, Formatter) {
    "use strict";


/**
 * ## The Home Controller ##
 *
 * Contains the necessary code to update the Welcome Message.
 *
 * Used by the Home View.
 *
 * @class mood_tracker.controller.detail.Home
 */
    var HomeController = BaseController.extend("mood_tracker.controller.detail.Home", {
        /**
         * Called when the View is initialized. Used to initialize the data and
         * attach a event listener for "Before Rendering"
         * @memberof mood_tracker.detail.Home
         * @instance
         * @see {@link mood_tracker.detail.Home#updateHome}
         */
        onInit : function() {
            var oView = this.getView();
            //Helpers.applyUiSizeClass(oView);
            oView.attachBeforeRendering(this.updateHome, this);
            oView.setModel(new JSONModel(), "home");
        },
        /**
         * Used to update the Home controls with new data
         *
         * Called before the View is rendered.
         * @memberof mood_tracker.detail.Home
         * @instance
         */
        updateHome : function() {
            var oView = this.getView(),
                controller = this,
                homeWelcomeMessageFile = this.getLocalizedText("homeWelcomeMessageFile");
            $.get(homeWelcomeMessageFile).done(function (result) {
                var html = Formatter.markdownToHtml(result);
                oView.byId("homeWelcomeHtml").setContent(
                "<div class='homeHtmlContent'>" +
                    html +
                "</div>");
            });
            var homeAcknowledgmentsFile = this.getLocalizedText("homeAcknowledgmentsFile");
            $.get(homeAcknowledgmentsFile).done(function (result) {
                var html = Formatter.markdownToHtml(result);
                oView.getModel("home").getData().AcknowledgmentsMessage = html;
                oView.getModel("home").refresh(false);
            });
        },
        handleAcknowledgmentsClick : function(oEvent) {
            var _oPopoverName = "oAcknowledgmentsPopover";
            var fragmentPath = "dialog.home.AcknowledgmentsPopover";
            if (!this[_oPopoverName]) {
                this[_oPopoverName] = this.getFragment(_oPopoverName, fragmentPath, this);
                //sap.ui.xmlfragment(fragmentPath, this);
                this.getView().addDependent(this[_oPopoverName]);
            }

            if (this[_oPopoverName].isOpen()) {
                this[_oPopoverName].close();
            } else {
                this[_oPopoverName].openBy(oEvent.getSource());
            }
        }
    });

    return HomeController;

}, /* bExport= */ true);
