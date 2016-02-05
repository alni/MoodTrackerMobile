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
 controller/Master.controller.js
 */


sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/mvc/Controller",
], function($, Controller) {
    "use strict";

    var MasterController = Controller.extend("mood_tracker.controller.Master", {
        onInit : function() {
            var oView = this.getView();
            //Helpers.applyUiSizeClass(oView);
            this.oUpdateFinishedDeferred = $.Deferred();

            // The Main Menu List does not load its items dynamically from a Model.
            // Because of this the "updateFinsished" event is never fired.
            //this.getView().byId("list").attachEventOnce("updateFinished", function() {
                this.oUpdateFinishedDeferred.resolve();
            //}, this);

            sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this.onRouteMatched, this);
        },

        onRouteMatched : function(oEvent) {
            var oList = this.getView().byId("list"),
                sName = oEvent.getParameter("name");
            console.log(sName);

            // Wait for the list to be loaded once
            $.when(this.oUpdateFinishedDeferred).then($.proxy(function() {
                console.log(sName);
                var aItems, i, id;

                // On the empty hash select the first item
                if (sName === "main") {
                    this.selectDetail();
                }

                // Try to select the item in the list
                aItems = oList.getItems();
                for (i = 0; i < aItems.length; i++) {
                    id = aItems[i].getId();
                    if (id.substr(id.indexOf("--")+2) === sName &&
                        (!oList.getSelectedItem() || oList.getSelectedItem().getId() !== id)) {
                    //if (aItems[i].getBindingContext().getPath() === "/" + oArguments.product) {

                        if (!sap.ui.Device.system.phone) { /* Fixes an issue where the page would
                            not navigate back to the master when on phones */
                            oList.setSelectedItem(aItems[i], true);
                            this.showDetail(aItems[i]); // Fixes an issue where the page was selected,
                                                        // but the location had the wrong hash path
                        }
                        break;
                    }
                }

            }, this));
        },

        selectDetail : function() {
            if (!sap.ui.Device.system.phone) {
                var oList = this.getView().byId("list"),
                    aItems = oList.getItems();
                console.log(aItems);
                if (aItems.length && !oList.getSelectedItem()) {
                    oList.setSelectedItem(aItems[0], true);
                    this.showDetail(aItems[0]);
                }
            }
        },

        onSearch : function() {
            // add filter for search
            var filters = [],
                searchString = this.getView().byId("searchField").getValue();
            if (searchString && searchString.length > 0) {
                filters = [ new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, searchString) ];
            }

            // update list binding
            this.getView().byId("list").getBinding("items").filter(filters);
        },

        onSelect : function(oEvent) {
            console.error(oEvent);
            // Get the list item, either from the listItem parameter or from the event's
            // source itself (will depend on the device-dependent mode).
            this.showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
        },

        showDetail : function(oItem) {
            // If we're on a phone, include nav in history; if not, don't.
            var bReplace = $.device.is.phone ? false : true,
                id = oItem.getId().substr(oItem.getId().indexOf("--")+2), //.toLowerCase();
                data;
            data = {
                from: "master",
                product: "page." + id
            };
            sap.ui.core.UIComponent.getRouterFor(this).navTo(id, data, bReplace);
        },

        onSettingsButtonPress : function() {
            sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
                currentView : this.getView(),
                targetViewName : "mood_tracker.view.detail.SettingsForm",
                targetViewType : "XML",
                transition : "slide"
            });
        }
    });


    return MasterController;

}, /* bExport= */ true);
