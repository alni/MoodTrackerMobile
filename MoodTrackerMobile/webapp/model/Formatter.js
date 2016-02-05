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
 model/Formatter.js
 */

sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/format/DateFormat"
], function($, DateFormat) {
    "use strict";


    var localizedValue = null,
        formattedValue = null,
        Formatter;

    localizedValue = function (value, bundleText, _this) {
        var oModel = _this.getModel("i18n"),
            oBundle = oModel && oModel.getResourceBundle(),
            localizedValue = oBundle && oBundle.getText(bundleText + "_" + value);
        if (!localizedValue || localizedValue === bundleText + "_" + value) {
            localizedValue = value + "";
        }
        return localizedValue;
    };
    formattedValue = function (bundleText, aArgs, _this) {
        var oModel = _this.getModel("i18n"),
            oBundle = oModel && oModel.getResourceBundle(),
            localizedValue = oBundle && oBundle.getText(bundleText, aArgs);
        return localizedValue;
    };

    Formatter = {
        formattedValue : function() {
            var args = [].concat($.makeArray(arguments));
            console.log(args);
            return formattedValue(args[0], args.slice(1, args.length), this);
        },
        formattedMessage: function () {
            var args = [].concat($.makeArray(arguments));
            console.log(args);
            return $.sap.formatMessage(args[0], args.slice(1, args.length));
        },
        localizedValue: function (value, bundleText) {
            console.log(value + " | " + bundleText);
            return localizedValue(value, bundleText, this);
        },
        localizedFormattedValue: function () {
            var args = [].concat($.makeArray(arguments)),
                _val = formattedValue(
                localizedValue(args[0], args[1], this),
                args.slice(2, args.length), this);
            return _val;
        },
        localizedFormattedMessage: function () {
            var args = [].concat($.makeArray(arguments)),
                _val = Formatter.formattedMessage(
                localizedValue(args[0], args[1], this),
                args.slice(2, args.length));
            return _val;
        },
        categoryPageTitle : function(customTitle, categoryPageTitle, customTitleFallback) {
            var title = "";
            if (customTitle) {
                title = customTitle + "";
            } else if (customTitleFallback) {
                title = customTitleFallback + "";
            }
            if (title && title.trim().length > 0) {
                return $.proxy(formattedValue, this)("categoryPageTitle", [title, categoryPageTitle]);
            } else {
                return categoryPageTitle;
            }
        },
        markdownToHtml: function (sStr) {
            var $html = $("<div/>"),
                // Style the links with the current theme colour for links
                sLinkColor = sap.ui.core.theming.Parameters.get("sapUiLink");
            $html.html(marked(sStr));
            $html.find("a").filter(function() {
               return this.hostname && this.hostname !== location.hostname;
            }).attr("target", "_blank");
            
            $html.find("a").css("color", sLinkColor);
            return $html.html();
        },
    	uppercaseFirstChar : function(sStr) {
    		return sStr.charAt(0).toUpperCase() + sStr.slice(1);
    	},

    	stringNotEmpty : function(sStr) {
    		return sStr && sStr.length > 0 ? true : false;
    	},

        fullPath : function(val, url) {
            return url ? url : $.sap.getModulePath("mood_tracker") + "/" + val;
        },

    	dateTimeValue : function(sDate) {
    		var dateTimeFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
    			style: "medium"
    		}), oDate = new Date(sDate);
    		//$.sap.log.debug("sDate = " + sDate);
    		return oDate == "Invalid Date" ? "" : dateTimeFormat.format(oDate, false);
    		//oDate.toLocaleTimeString();
    	},
        dateValue : function(sDate) {
            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                style: "medium"
            }), oDate = new Date(sDate);
            //$.sap.log.debug("sDate = " + sDate);
            return oDate == "Invalid Date" ? "" : dateFormat.format(oDate, false);
            //oDate.toLocaleTimeString();
        },
    	timeValue : function(sDate) {
    		var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
                style: "short",
    			//pattern: 'HH:mm'
    		}),
                oDate = new Date(sDate);
    		//$.sap.log.debug("sDate = " + sDate);
    		return oDate == "Invalid Date" ? "" : timeFormat.format(oDate, false);
    		//oDate.toLocaleTimeString();
    	},
    	dayValue : function(sDate) {
    	    var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
    	        pattern: "ddd"
    	    }), oDate = new Date(sDate);

    	    return oDate == "Invalid Date" ? "" : dateFormat.format(oDate, false);
    	},

        clockValue : function(timeStamp) {
            var sDate = Formatter.dateValue(timeStamp),
                sTime = Formatter.timeValue(timeStamp);
            return $.proxy(formattedValue, this)("dateFormat_clock", [sDate, sTime]);
        },

    	invertBoolValue : function(bValue) {
    		return bValue ? false : true;
    	},
    	median: function (values) {
    	    var half,
                _values = [].concat(values.map(function (item, i) {
    	        return $.isNumeric(item) ? item : item.value;
    	    }));
    	    _values.sort(function (a, b) {
    	        return a - b;
    	    });

    	    half = Math.floor(values.length / 2);

    	    if (_values.length % 2) {
    	        return _values[half];
    	    } else {
    	        return (_values[half - 1] + _values[half]) / 2.0;
    	    }
    	},
    	average: function (values) {
    	    var value = 0,
                _values = [].concat(values.map(function (item, i) {
    	        return $.isNumeric(item) ? item : item.value;
    	    }));
    	    $.each(_values, function (index, val) {
    	        value += val;
    	    });
    	    return Math.round( value / values.length );
    	},
    	makeStringsSameLength: function () {
    	    var args = $.makeArray(arguments),
                longest = args.sort(function (a, b) { return b.length - a.length; })[0],
    	        l = longest.length;
    	    $.each(args, function (index, str) {
    	        var _l = str.length,
    	            i;
    	        if (_l < l) {
    	            for (i = 0; i < l - _l; i++) {
    	                args[index] += " ";
    	            }
    	        }
    	    });
    	    return args;
    	}
    };

    return Formatter;

}, /* bExport= */ true);
