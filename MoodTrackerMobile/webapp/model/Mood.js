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
 model/Mood.js
 */

sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/format/DateFormat"
], function($, DateFormat) {
    "use strict";


    var isWindowsApp = window.WinJS && WinJS.Utilities && WinJS.Utilities.hasWinRT,
        applicationData = null;

    if (isWindowsApp) {
        applicationData = Windows.Storage.ApplicationData.current;
    }

    var MoodModel = {
        storeValue: function (key, value) {
            if (isWindowsApp && applicationData) {
                var localSettings = applicationData.localSettings;
                localSettings.values[key] = JSON.stringify(value);
            } else {
                window.localStorage[key] = JSON.stringify(value);
            }
        },
        readValue: function (key, value) {
            var returnValue = value;
            if (isWindowsApp && applicationData) {
                var localSettings = applicationData.localSettings;
                if (localSettings.values[key]) {
                    returnValue = JSON.parse(localSettings.values[key]);
                }
            } else {
                if (window.localStorage[key]) {
                    returnValue = JSON.parse(window.localStorage[key]);
                }
            }
            return returnValue;
        }
    };

    return MoodModel;

}, /* bExport= */ true);
