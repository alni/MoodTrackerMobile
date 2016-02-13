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
 util/Cordova.js
 */
sap.ui.define([
    "jquery.sap.global",
], function($) {
    "use strict";

    if (window.cordova && cordova.plugins && cordova.plugins.notification) {

        cordova.plugins.notification.local.on("click", function (notification) {
            var returnTo = notification.data.returnTo;
            if (notification.data.returnTo) {
                window.location.hash = returnTo;
            }
        }, $);
    }

    var showNotify = function (body, icon, title, returnTo, at, every) {
        icon = icon || "icons/branding/AppLogo.png";
        at = at || new Date();
        var options = {
            id: "mood_tracker-" + title,
            title: title,
            message: body,
            at: +at,
            //sound: sound,
            icon: icon,
            data: {
                returnTo: returnTo
            }
        };
        if (every) {
            options.every = every;
        }

        // Let's check whether notification permissions have already been granted
        cordova.plugins.notification.local.hasPermission(function (granted) {
            if (granted) {
                cordova.plugins.notification.local.schedule(options);
            } else {
                // Otherwise, we need to ask the user for permissions
                var oAppModel = sap.ui.getCore().getModel("app");
                if (oAppModel.getProperty("/notifyDenied") == false) {
                    cordova.plugins.notification.local.registerPermission(function (isGranted) {
                        if (isGranted) {
                            cordova.plugins.notification.local.schedule(options);
                        } else {
                            // At last, if the user has denied notifications, and you want to be
                            // respectful, there is no need to bother them any more.
                            oAppModel.setProperty("/notifyDenied", true)
                        }
                    });
                }
            }
        });
    };

    var CordovaUtil = {
        showNotify : function (body, icon, title, returnTo, at) {
            showNotify(body, icon, title, returnTo);
        },
        scheduleNotify: function (body, icon, title, returnTo, at) {
            showNotify(body, icon, title, returnTo, at);
        },
        clearScheduledNotify: function () {
            cordova.plugins.notification.local.cancelAll(function () {
                // Notifications were cancelled
            });
        },
        enterFullScreen : function(bSwitchToFullScreen) {
            if (bSwitchToFullScreen) {
                StatusBar.hide();
            } else {
                StatusBar.show();
            }
            return !StatusBar.isVisible;
        },
        isCordovaApp: function() {
            return !!window.cordova;
        }
    };

    return CordovaUtil;

}, /* bExport= */ true);

