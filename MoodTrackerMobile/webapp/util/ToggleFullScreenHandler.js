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
 util/ToggleFullScreenHandler.js
 */

// Provides a simple search feature
sap.ui.define(["jquery.sap.global"],
    function($) {
    "use strict";


    var ToggleFullScreenHandler = {

        updateMode : function(oEvt, oView) {
            console.log(oView.byId("Shell"));
            if (!this._oShell) {
                this._oShell = sap.ui.getCore().byId("Shell");
            }
            var bSwitchToFullScreen = (this._getSplitApp(oView).getMode() === "ShowHideMode");
            if (bSwitchToFullScreen) {
                //Helpers.enterFullScreen(true);
                this._getSplitApp().setMode("HideMode");
                this._oShell.setAppWidthLimited(false);
            } else {
                //Helpers.enterFullScreen(false);
                this._getSplitApp().setMode("ShowHideMode");
                this._oShell.setAppWidthLimited(true);
            }
            this.updateControl(oEvt.getSource(), oView, bSwitchToFullScreen);
        },


        _getSplitApp : function (oView) {
            if (!this._oSplitApp) {
                this._oSplitApp = this._findControl("idAppControl", oView); //sap.ui.getCore().byId('splitApp');
            }
            return this._oSplitApp;
        },

        /**
          * @instance
          */
         _findControl : function(sAncestorControlName, oControl) {
             //sAncestorControlName  = "idAppControl";

             if (oControl instanceof sap.ui.core.mvc.View && oControl.byId(sAncestorControlName)) {
                 return oControl.byId(sAncestorControlName);
             }

             return oControl.getParent() ? this._findControl(sAncestorControlName, oControl.getParent()) : null;
         },

        updateControl : function (oButton, oView, bFullScreen) {
            if (arguments.length === 2) {
                bFullScreen = (this._getSplitApp().getMode() !== "ShowHideMode");
            }
            var i18nModel = oView.getModel("i18n");
            if (!bFullScreen) {
                oView.getModel("app").getData().FullScreenButtonIcon = "sap-icon://full-screen";
                oButton.setTooltip(i18nModel.getProperty("sampleFullScreenTooltip"));
                oButton.setIcon("sap-icon://full-screen");
            } else {
                oView.getModel("app").getData().FullScreenButtonIcon = "sap-icon://exit-full-screen";
                oButton.setTooltip(i18nModel.getProperty("sampleExitFullScreenTooltip"));
                oButton.setIcon("sap-icon://exit-full-screen");
            }
        },

        cleanUp : function() {
            this._oSplitApp = null;
            this._oShell = null;
        }
    };

    return ToggleFullScreenHandler;

}, /* bExport= */ true);
