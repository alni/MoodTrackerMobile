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
 MyRouter.js
 */

sap.ui.define([
    "jquery.sap.global",
    "sap/m/routing/Router"
], function ($, Router) {
    "use strict";
    var sAncestorControlName;
    var MyRouter = Router.extend("mood_tracker.MyRouter", {
        constructor : function() {
            Router.apply(this, arguments);
            this.attachRouteMatched(this.onRouteMatched, this);
            //this._oRouteMatchedHandler = new sap.m.routing.RouteMatchedHandler(this);
        },
    
        onRouteMatched: function (oEvent) {
            var parameters = oEvent.getParameters();
            var config = parameters.config;
        },
        myNavBack : function(sRoute, mData) {
            var oHistory = sap.ui.core.routing.History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            // The history contains a previous entry
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var bReplace = true; // otherwise we go backwards with a forward history
                this.navTo(sRoute, mData, bReplace);
            }
        },

        /**
         * @public Changes the view without changing the hash
         *
         * @param oOptions {object} must have the following properties
         * <ul>
         *     <li> currentView : the view you start the navigation from.</li>
         *     <li> targetViewName : the fully qualified name of the view you want to navigate to.</li>
         *     <li> targetViewType : the viewtype eg: XML</li>
         *     <li> isMaster : default is false, true if the view should be put in the master</li>
         *     <li> transition : default is "show", the navigation transition</li>
         *     <li> data : the data passed to the navContainers livecycle events</li>
         * </ul>
         */
         myNavToWithoutHash : function (oOptions) {
             var oSplitApp = this._findSplitApp(oOptions.currentView);

             // Load view, add it to the page aggregation, and navigate to it
             var oView = this.getView(oOptions.targetViewName, oOptions.targetViewType);
             oSplitApp.addPage(oView, oOptions.isMaster);
             oSplitApp.to(oView.getId(), oOptions.transition || "show", oOptions.data);
         },
         /**
          * @memberof mood_tracker.MyRouter
          * @instance
          */
         backWithoutHash : function (oCurrentView, bIsMaster) {
             var sBackMethod = bIsMaster ? "backMaster" : "backDetail";
             this._findSplitApp(oCurrentView)[sBackMethod]();
         },
         /**
          * @memberof mood_tracker.MyRouter
          * @instance
          */
         destroy : function () {
             Router.prototype.destroy.apply(this, arguments);
             this.detachRouteMatched(this.onRouteMatched, this);
             //this._oRouteMatchedHandler.destroy();
         },
         /**
          * @memberof mood_tracker.MyRouter
          * @instance
          */
         _findSplitApp : function(oControl) {
             sAncestorControlName  = "idAppControl";

             if (oControl instanceof sap.ui.core.mvc.View && oControl.byId(sAncestorControlName)) {
                 return oControl.byId(sAncestorControlName);
             }

             return oControl.getParent() ? this._findSplitApp(oControl.getParent()) : null;
         }
    });
    return MyRouter;
}, /* bExport= */ true);