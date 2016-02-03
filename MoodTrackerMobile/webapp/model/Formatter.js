sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/format/DateFormat"
], function($, DateFormat) {
    "use strict";


    var localizedValue = null,
        formattedValue = null;

    localizedValue = function (value, bundleText) {
        var oModel = this.getModel("i18n"),
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

    var Formatter = {
        formattedValue : function() {
            var args = [].concat($.makeArray(arguments));
            console.log(args);
            return formattedValue(args[0], args.slice(1, args.length), this);
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
            var $html = $("<div/>");
            $html.html(marked(sStr));
            $html.find("a").filter(function() {
               return this.hostname && this.hostname !== location.hostname;
            }).attr("target", "_blank");
            // Style the links with the current theme colour for links
            var sLinkColor = sap.ui.core.theming.Parameters.get("sapUiLink");
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
    	    var _values = [].concat(values);
    	    _values.sort(function (a, b) { return a - b; });

    	    var half = Math.floor(values.length / 2);

    	    if (_values.length % 2) {
    	        return _values[half];
    	    } else {
    	        return (_values[half - 1] + _values[half]) / 2.0;
    	    }
    	},
    	average: function (values) {
    	    var value = 0;
    	    $.each(values, function (index, val) {
    	        value += val;
    	    });
    	    return Math.round( value / values.length );
    	},
    	makeStringsSameLength: function () {
    	    var args = $.makeArray(arguments);
    	    var longest = args.sort(function (a, b) { return b.length - a.length; })[0];
    	    var l = longest.length;
    	    $.each(args, function (index, str) {
    	        var _l = str.length;
    	        if (_l < l) {
    	            for (var i = 0; i < l - _l; i++) {
    	                args[index] += " ";
    	            }
    	        }
    	    });
    	    return args;
    	}
    };

    return Formatter;

}, /* bExport= */ true);
