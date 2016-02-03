﻿/*!
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
 Component.js
 */
sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "mood_tracker/MyRouter",
    "mood_tracker/model/Formatter",
    "mood_tracker/model/Mood"
], function ($, UIComponent, JSONModel, MyRouter, Formatter, MoodModel) {
    "use strict";
    /**
     * @class mood_tracker.Component
     */
    var Component = UIComponent.extend("mood_tracker.Component", {
        metadata: {
            manifest: "json"
            //name: 'Sample todo app',
            //version: '1.0.0',
            //includes: ['css/index.css'],
            //dependencies: {
            //    libs: ['sap.m']
            //},
            //rootView: 'mood_tracker.view.App'
        },
        /**
         * Intitalizes the Component and populates the base Models needed for
         * the application to function correctly.
         */
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            var that = this;
            

            //var mConfig = this.getMetadata().getConfig();
            var version = this.getMetadata().getVersion();
            if (version === "@@version" && !!$.sap.getUriParameters().get("test_production")) {
                version = "test_production";
            }
            var appModel = new JSONModel({
                appLogo: $.sap.getModulePath("mood_tracker", "/icons/branding/AppLogo_Transparent.png"),
                version: version,
                lastNotify: -1,
                notifyDenied: false, // Used with Cordova platforms
                FullScreenButtonIcon: "sap-icon://full-screen"
            });
            this.setModel(appModel, "app");

            sap.ui.getCore().setModel(appModel, "app");;

            // set device model
            var deviceModel = new JSONModel({
                isTouch: sap.ui.Device.support.touch,
                isNoTouch: !sap.ui.Device.support.touch,
                isPhone: sap.ui.Device.system.phone,
                isNoPhone: !sap.ui.Device.system.phone,
                listMode: sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
                listBackgroundDesign: sap.ui.Device.system.phone ? "Translucent" : "Translucent",
                listItemType: sap.ui.Device.system.phone ? "Active" : "Inactive",
                uiSizeClass: sap.ui.Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact",
                isCordova: !!window.cordova
            });
            deviceModel.setDefaultBindingMode("OneWay");
            this.setModel(deviceModel, "device");

            var moods = MoodModel.readValue("moods", [0, 0, 0, 0, 0, 0, 0]);
                //[7, 8, 7, 7, 5, 6, 5]; 

            var moodModel = new JSONModel({
                current: moods[new Date().getDay()],
                past: moods, //[-3, 2, 5, 0, 10, 1, -10]
                min: MoodModel.readValue("moodMin", -10),
                max: MoodModel.readValue("moodMax", 10)
            });
            this.setModel(moodModel, "mood");

            //this.initializeSettingsData(function () {
                // Fixes an issue where the Language setting would not always be
                // applied for all controls and views.
            that.getRouter().initialize();
                //$("#splash-screen").remove();
            //});

        }
    });
    return Component;
}, /* bExport= */ true);
