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
 controller/BaseController.js
 */


sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/mvc/Controller",
    "mood_tracker/util/ToggleFullScreenHandler"
], function($, Controller, ToggleFullScreenHandler) {
    "use strict";


    /**
     * Instantiates a BaseController
     *
     * @class A generic controller which is as a basis with shared methods and
     * properties
     * @extends sap.ui.core.mvc.Controller
     *
     * @author Alexander Nilsen
     * @version ${version}
     *
     * @public
     * @alias mood_tracker.controller.BaseController
     */
    var BaseController = Controller.extend("mood_tracker.controller.BaseController", {
        sViewPath: "mood_tracker.view",

        oBundle : null,

        oLocalizedTextCache : {},

        aFragmentList : [],

        /**
         * Gets a XML Fragment with name from the view/ folder
         * @memberof mood_tracker.controller.BaseController
         * @instance
         * @param {string} sFragmentName - the name of the variable to bind the
         *     fragment to
         * @param {string} sName - the full name path of the fragment (without
         *     the "*.view." part)
         * @param {object} context - context to be used for event handlers in
         *     the Fragment
         * @returns {sap.ui.core.Control|sap.ui.core.Control[]} the root
         *     Control(s) of the created Fragment instance
         */
        getFragment : function(sFragmentName, sName, context) {
            this.addFragmentToList(sFragmentName);
            return sap.ui.xmlfragment(this.sViewPath + "." + sName, context);
        },

        addFragmentToList : function(sFragmentName) {
            if (this.aFragmentList.indexOf(sFragmentName) < 0) {
                this.aFragmentList.push(sFragmentName);
            }
        },

        /**
         * Gets formatted localized text
         * @memberof mood_tracker.controller.BaseController
         * @instance
         * @param  {string} sKey - the key of the localized text
         * @param  {object[]} aArgs - the arguments to use to replace placeholders
         * @return {string} - the localized text
         */
        getLocalizedText : function(sKey, aArgs, bCacheResult, sFallback) {
            var text = this.oLocalizedTextCache[sKey],
                oModel;
            if (!this.oBundle) {
                oModel = this.getView().getModel("i18n");
                this.oBundle = oModel && oModel.getResourceBundle();
            }
            if (!bCacheResult || !text) {
                // If NOT cache result OR no text found in cache, get the current
                // localized text from the i18n bundle
                text = this.oBundle && this.oBundle.getText(sKey, aArgs);
                if ((!text || text == sKey) && sFallback) {
                    text = sFallback + "";
                }

                if (bCacheResult) {
                    // if cache result, store the current localized text the
                    // cache
                    this.oLocalizedTextCache[sKey] = text + "";
                }
            }
            return text;
        },
        /**
         * Toggles the full screen state of the current view
         * @memberof mood_tracker.controller.BaseController
         * @instance
         * @param {sap.ui.base.Event} oEvent - the event object
         * @see {@link mood_tracker.util.ToggleFullScreenHandler.updateMode}
         */
        handleFullScreenClick: function (oEvent) {
            ToggleFullScreenHandler.updateMode(oEvent, this.getView());
            $.sap.log.debug(oEvent.getSource());
        },
        /**
         * @memberof mood_tracker.controller.BaseController
         * @instance
         */
        showMessageDialog : function(title, state, text, buttonText) {
            var dialog = new sap.m.Dialog({
                title : title,
                type : "Message",
                state : state,
                content : new sap.m.Text({
                    text: text
                }),
                beginButton : new sap.m.Button({
                    text: buttonText || "OK",
                    press: function() {
                        dialog.close();
                    }
                }),
                afterClose: function() {
                    dialog.destroy();
                }
            });

            dialog.open();
        },

        getRouteHash : function(sRouteName) {
            var _router = sap.ui.core.UIComponent.getRouterFor(this),
                url = _router.getURL(sRouteName);
            if (url) {
                return "#/" + url;
            }
            return false;
        },

        onNavBack : function() {
            this.destroyFragments();
            // This is only relevant when running on phone devices
            sap.ui.core.UIComponent.getRouterFor(this).myNavBack("master");
        },

        /**
         * Opens an external link.
         *
         * When on Cordova platforms opens an InAppBrowser for the external link.
         * Otherwise, opens the external link in the web browser.
         * @param  {sap.ui.base.Event} oEvent - the event object
         */
        onExternalLinkPress : function(oEvent) {
            var source = oEvent.getSource(),
                href = source.getHref(),
                target = source.getTarget() || "_blank";

            if (window.cordova && cordova.InAppBrowser) {
                oEvent.preventDefault();
                cordova.InAppBrowser.open(href, target, "location=yes");
            }
        },

        openExternalLink : function(href, target, oEvent) {
            if (window.cordova && cordova.InAppBrowser) {
                oEvent.preventDefault();
                cordova.InAppBrowser.open(href, target, "location=yes");
            }
        },

        destroyFragments : function() {
            $.sap.log.error("destroyFragments()");
            var controller = this;
            $.each(controller.aFragmentList, function(index, sFragmentName) {
                if (controller[sFragmentName]) {
                    controller[sFragmentName].destroy();
                    delete controller[sFragmentName];
                }
            });
            controller.aFragmentList = [];
        },

        isTESTING: function () {
            return this.getView().getModel("app").getProperty("/TESTING");
        }
    });

    return BaseController;

}, /* bExport= */ true);
