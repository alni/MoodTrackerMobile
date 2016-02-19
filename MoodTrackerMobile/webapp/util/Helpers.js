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
 util/Helpers.js
 */
sap.ui.define(["jquery.sap.global", "mood_tracker/util/Cordova", "mood_tracker/util/Windows"],
    function($, CordovaUtils, WindowsUtils) {
        "use strict";

        var createNotification = function (title, options, returnTo) {
            var n = new Notification(title, options);
            n.onerror = function (e) {
                console.error(e);
            };
            n.onclick = function (e) {
                if (returnTo) {
                    window.location.hash = returnTo;
                    n.close();
                }
                if (!document.hasFocus()) {
                    window.focus();
                }
            };
        };

        var showNotify = function (body, icon, title, returnTo) {
            icon = icon || "icons/branding/AppLogo.png";
        var options = {
            body: body,
            icon: icon,
            tag: "mood_tracker-" + title
        };
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            // Does not support desktop notification
        }

        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            createNotification(title, options, returnTo);
            /*var n = new Notification(title, options);
            n.onerror = function(e) {
                console.error(e);
            };
            n.onclick = function (e) {
                if (returnTo) {
                    window.location.hash = returnTo;
                }
            };*/
        }
        // Otherwise, we need to ask the user for permissions
        else if (Notification.permission !== "denied") {
            Notification.requestPermission(function(permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    createNotification(title, options, returnTo);
                    /*var n = new Notification(title, options);
                    n.onerror = function(e) {
                        console.error(e);
                    };
                    n.onclick = function (e) {
                        if (returnTo) {
                            window.location.hash = returnTo;
                        }
                    };*/
                }
            });
        }
        $.sap.log.error(Notification.permission);

        // At last, uf the user has denied notifications, and you want to be
        // respectful, there is no need to bother them any more.
    };


    var Helpers = {
        /**
         * Toggle Full Screen Mode
         * @param {boolean} bSwitchToFullScreen - whether we should switch
         *     to Full Screen
         * @returns {boolean} Whether we are in full screen or not
         */
        enterFullScreen : function(bSwitchToFullScreen) {
            var isFullScreen = false;
            if (WindowsUtils.isWindowsApp()) {
                isFullScreen = WindowsUtils.enterFullScreen(bSwitchToFullScreen);
            } else if (CordovaUtils.isCordovaApp()) {
                isFullScreen = CordovaUtils.enterFullScreen(bSwitchToFullScreen);
            } else {
                if (bSwitchToFullScreen) {
                    if (document.documentElement.requestFullscreen) {
                      document.documentElement.requestFullscreen();
                    } else if (document.documentElement.msRequestFullscreen) {
                      document.documentElement.msRequestFullscreen();
                    } else if (document.documentElement.mozRequestFullScreen) {
                      document.documentElement.mozRequestFullScreen();
                    } else if (document.documentElement.webkitRequestFullscreen) {
                      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                    }
                } else {
                    if(document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if(document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if(document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                }
            }
            return isFullScreen;
        },

        /**
         * Shows a notification or toast
         * @param {string} body - the body or description of the toast
         * @param {string} icon - the icon to use with the notification
         * @param {string} title - the title of the notification
         * @param {string} returnTo - the URI Hash to return to when clicking
         *     the toast or notification
         */
        showNotify: function (body, icon, title, returnTo) {
            if (WindowsUtils.isWindowsApp()) {
                WindowsUtils.showNotify(body, icon, title, returnTo);
            } else if (CordovaUtils.isCordovaApp()) {
                CordovaUtils.showNotify(body, icon, title, returnTo);
            } else {
                showNotify(body, icon, title, returnTo);
            }
        },

        /**
         * Schedules a notification or toast to be shown at a given time
         * (Not supported on web) 
         * @param {string} body - the body or description of the toast
         * @param {string} icon - the icon to use with the notification
         * @param {string} title - the title of the notification
         * @param {string} returnTo - the URI Hash to return to when clicking
         *     the toast or notification
         * @param {Date} at - the date/time to schedule the notification for
         */
        scheduleNotify: function (body, icon, title, returnTo, at) {
            if (WindowsUtils.isWindowsApp()) {
                WindowsUtils.scheduleNotify(body, icon, title, returnTo, at);
            } else if (CordovaUtils.isCordovaApp()) {
                CordovaUtils.scheduleNotify(body, icon, title, returnTo, at);
            } else {
                // Not supported on web
            }
        },

        clearScheduledNotify : function() {
            if (WindowsUtils.isWindowsApp()) {
                WindowsUtils.clearScheduledNotify();
            } else if (CordovaUtils.isCordovaApp()) {
                CordovaUtils.clearScheduledNotify();
            } else {
                // Not supported on web
            }
        },
        hasScheduleNotifySupport : (function() {
            if (WindowsUtils.isWindowsApp() ||
                CordovaUtils.isCordovaApp) {
                return true;
            }
            return false;
        })(),
        /**
         * Apply compact density if touch is not supported, the standard cozy 
         * design otherwise
         * @param {sap.ui.core.View) oView - the view to apply class for
         */
        applyUiSizeClass : function(oView) {
            // apply compact density if touch is not supported, the standard cozy design otherwise
            oView.addStyleClass(sap.ui.Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact");
        },
        /**
         * Apply zoom level for the application
         * @param {number} zoomLevel - the zoom level to apply
         */
        applyZoomLevel : function(zoomLevel) {
            $("body").css("font-size", zoomLevel.toFixed(2) + "rem");
            $("#content").css({
                "zoom": zoomLevel.toFixed(2),
                //"font-size": (1 / zoomLevel).toFixed(2) + "rem"
            });
        },
        /**
         * Checks if a string starts with another string
         * @param {string} str - the input string
         * @param {string} prefix - the string to look for
         * @returns {boolean} returns whether `str` starts with `prefix`
         */
        stringStartsWith: function (str, prefix) {
            return str.slice(0, prefix.length) == prefix;
        },

        setupReminders : function(oModel, body, title) {
            var days = parseInt(oModel.getProperty("/reminder/days"), 10),
                hours = oModel.getProperty("/reminder/hours").map(Number),
                day = 0;
            if (Helpers.hasScheduleNotifySupport) {
                // Only schedule reminders if scheduled notifications are 
                // supported

                Helpers.clearScheduledNotify(); // Clear existing notifications
                for (day = 0; day <= days; day++) {
                    $.each(hours, function (index, hour) {
                        Helpers.setupReminder(hour, day, body, title);
                    });
                }
            }
        },

        setupReminder: function (hour, day, body, title) {
            var oDate = new Date();
            oDate.setHours(hour);
            oDate.setMinutes(0);
            oDate.setSeconds(0);
            oDate.setDate(oDate.getDate() + day);
            if (+oDate > +new Date()) {
                // Only schedule reminders that are in the future
                Helpers.scheduleNotify((body || "Remember to log your mood"),
                    null, (title || "Mood Tracker"), null, oDate);
            }
        },

        /**
         * @link http://stackoverflow.com/a/3895521
         */
        range: function (start, end, step) {
            var range = [];
            var typeofStart = typeof start;
            var typeofEnd = typeof end;

            if (step === 0) {
                throw TypeError("Step cannot be zero.");
            }

            if (typeofStart == "undefined" || typeofEnd == "undefined") {
                throw TypeError("Must pass start and end arguments.");
            } else if (typeofStart != typeofEnd) {
                throw TypeError("Start and end arguments must be of same type.");
            }

            typeof step == "undefined" && (step = 1);

            if (end < start) {
                step = -step;
            }

            if (typeofStart == "number") {

                while (step > 0 ? end >= start : end <= start) {
                    range.push(start);
                    start += step;
                }

            } else if (typeofStart == "string") {

                if (start.length != 1 || end.length != 1) {
                    throw TypeError("Only strings with one character are supported.");
                }

                start = start.charCodeAt(0);
                end = end.charCodeAt(0);

                while (step > 0 ? end >= start : end <= start) {
                    range.push(String.fromCharCode(start));
                    start += step;
                }

            } else {
                throw TypeError("Only string and number types are supported");
            }

            return range;

        }
    };

    return Helpers;

}, /* bExport= */ true);
