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
