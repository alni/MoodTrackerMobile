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