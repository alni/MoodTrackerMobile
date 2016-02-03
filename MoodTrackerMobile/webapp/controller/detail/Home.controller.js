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
