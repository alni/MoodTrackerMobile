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
 util/Windows.js
 */
sap.ui.define([
    "jquery.sap.global",
], function($) {
    "use strict";

    var isWindowsApp = window.WinJS && WinJS.Utilities && WinJS.Utilities.hasWinRT;
    var applicationData = null;
    var pickFile = null;
    var readFile = null;
    var showNotify = null;
    var updateTile = null;
    var notifications = null;
    if (isWindowsApp) {
        notifications = Windows.UI.Notifications;
        applicationData = Windows.Storage.ApplicationData.current;

        WinJS.Application.addEventListener("activated", onActivatedHandler, true);

        function onActivatedHandler(args) {
            if (args.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.launch) {
                if (args.detail.arguments) {
                    var params = JSON.parse(args.detail.arguments);
                    if (params.type === "toast" && params.returnTo) {
                        window.location.hash = params.returnTo;
                    }
                }
            }
        }
    }

    pickFile = function(viewMode, suggestedStartLocation, fileTypes) {
        var promise = $.Deferred();

        // Create the picker object and set options
        var openPicker = new Windows.Storage.Pickers.FileOpenPicker();
        openPicker.viewMode = viewMode;
        openPicker.suggestedStartLocation = suggestedStartLocation;
        // Users expect to have a filtered view of their folders depending on
        // the scenario.
        // For example, when choosing a document folder, restrict the filetypes
        // to documents for your application.
        openPicker.fileTypeFilter.replaceAll(fileTypes);

        // Open the picker for the user to pick a file
        openPicker.pickSingleFileAsyn().then(function(file) {
            if (file) {
                // Application now has read/write access to the picked file
            } else {
                // The picker was dismissed with no selected file
            }
        });

        return promise;
    };

    readFile = function(file) {
        var promise = $.Deferred();
        if (file !== null) {
            Windows.Storage.FileIO.readBufferAsync(file).done(function (buffer) {
                var dataReader = Windows.Storage.Streams.DataReader.fromBuffer(buffer);
                var fileContent = dataReader.readString(buffer.length);
                dataReader.close();
            });
        }
        return promise;
    };

    showNotify = function (body, icon, title, returnTo, at) {
        // 2. Pick a template for your toast and retrieve its XML contents
        var template = notifications.ToastTemplateType.toastImageAndText02;
        var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);

        // 3. Supply text content for your notification
        var toastTextElements = toastXml.getElementsByTagName("text");
        toastTextElements[0].appendChild(toastXml.createTextNode(title));
        toastTextElements[1].appendChild(toastXml.createTextNode(body));

        // 4. Supply an iamge for your notification
        var toastImageElements = toastXml.getElementsByTagName("image");
        toastImageElements[0].setAttribute("src", icon);

        // 7. Specify app launch parameters
        toastXml.selectSingleNode("/toast").setAttribute("launch",
            JSON.stringify({
                "type": "toast",
                "returnTo": returnTo || window.location.hash
            })
        );

        // 8. Create the toast notification based on the XML content you've
        //    specified.
        var toast, shouldSchedule = false;
        if (!!at) {
            toast = new notifications.ScheduledToastNotification(
                toastXml, new Date(+at));
            shouldSchedule = true;
        } else {
            toast = new notifications.ToastNotification(toastXml);
        }
        

        // 9. Send your notification.
        var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
        if (shouldSchedule) {
            toastNotifier.addToSchedule(toast);
        } else {
            toastNotifier.show(toast);
        }
    };

    updateTile = function (body, icon, title, returnTo, at) {
        // 2. Pick a template for your tile and retrieve its XML contents
        var template = notifications.TileTemplateType.tileWide310x150ImageAndText01;
        var tileXml = notifications.TileUpdateManager.getTemplateContent(template);

        // 3. Supply text content for your notification
        var tileTextAttributes = tileXml.getElementsByTagName("text");
        tileTextAttributes[0].appendChild(tileXml.createTextNode(body));

        // 4. Supply an image for your notification
        var tileImageAttributes = tileXml.getElementsByTagName("image");

        if (icon) {
            tileImageAttributes[0].setAttribute("src", icon);
            //tileImageAttributes[0].setAttribute("alt", "red graphic");
        }

        // 5. Include notification bindings for multiple tile sizes in the payload
        var squareTemplate = notifications.TileTemplateType.tileSquare150x150Text04;
        var squareTileXml = notifications.TileUpdateManager.getTemplateContent(squareTemplate);

        var squareTileTextAttributes = squareTileXml.getElementsByTagName("text");
        squareTileTextAttributes[0].appendChild(squareTileXml.createTextNode(body));
        
        var node = tileXml.importNode(squareTileXml.getElementsByTagName("binding").item(0), true);
        tileXml.getElementsByTagName("visual").item(0).appendChild(node);


        // #. Specify app launch parameters
        /*tileXml.selectSingleNode("/tile").setAttribute("launch",
            JSON.stringify({
                "type": "tile",
                "returnTo": returnTo || window.location.hash
            })
        );*/

        // 6. Create the notification based on the XML content you've specified
        var tile, shouldSchedule = false;
        if (!!at) {
            tile = new notifications.ScheduledTileNotification(
                tileXml, new Date(+at));
            shouldSchedule = true;
        } else {
            tile = new notifications.TileNotification(tileXml);
        }


        // 8. Send the notification to the app tile.
        var tileUpdater = notifications.TileUpdateManager.createTileUpdaterForApplication();
        if (shouldSchedule) {
            tileUpdater.addToSchedule(tile);
        } else {
            tileUpdater.update(tile);
        }
    };

    var WindowsUtil = {
        enterFullScreen : function(bSwitchToFullScreen) {
            var applicationView = Windows.UI.ViewManagement.ApplicationView.getForCurrentView(),
                isFullScreen = applicationView.isFullScreenMode;
            if (bSwitchToFullScreen) {
                isFullScreen = applicationView.tryEnterFullScreenMode();
            } else if (applicationView.isFullScreenMode) {
                applicationView.exitFullScreenMode();
            }
            return applicationView.isFullScreenMode;
        },

        supportsTouch : function() {
            var touchCapabilities = new Windows.Devices.Input.TouchCapabilities();
            return touchCapabilities.touchPresent;
        },

        showNotify: function (body, icon, title, returnTo) {
            showNotify(body, icon, title, returnTo);
            updateTile(body, icon, title, returnTo);
        },
        scheduleNotify: function (body, icon, title, returnTo, at) {
            showNotify(body, icon, title, returnTo, at);
            updateTile(body, icon, title, returnTo, at);
        },

        clearScheduledNotify : function() {
            var notifier = notifications.ToastNotificationManager.createToastNotifier();
            var scheduled = notifier.getScheduledToastNotifications();                    

            $.each(scheduled, function(index, item) {
                notifier.removeFromSchedule(item);
            });
        },

        updateTile: function (body, icon, title, returnTo) {
            updateTile(body, icon, title, returnTo);
        },
        /**
         * Checks if is a Windows application
         * @returns {Boolean}
         */
        isWindowsApp: function () {
            return isWindowsApp;
        }
    };

    return WindowsUtil;

}, /* bExport= */ true);

