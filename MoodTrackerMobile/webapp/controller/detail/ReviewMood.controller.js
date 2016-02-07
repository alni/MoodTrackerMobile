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
 controller/detail/ReviewMood.controller.js
 */


sap.ui.define([
    "jquery.sap.global",
    "mood_tracker/controller/BaseController",
    "mood_tracker/model/Formatter",
], function ($, BaseController, Formatter) {
    "use strict";

    Chart.types.Line.extend({
        name: "MyLineChart",
        initialize: function (data) {
            Chart.types.Line.prototype.initialize.apply(this, arguments);

            //Set up tooltip events on the chart
            if (this.options.showTooltips) {
                Chart.helpers.bindEvents(this, this.options.tooltipEvents, function (evt) {
                    var activePoints = (evt.type !== 'mouseout') ? this.getPointsAtEvent(evt) : [];
                    this.eachPoints(function (point) {
                        point.restore(['fillColor', 'strokeColor']);
                    });
                    var _activePoints = [];
                    console.log(activePoints);
                    Chart.helpers.each(activePoints, function (activePoint) {
                        activePoint.fillColor = activePoint.highlightFill;
                        activePoint.strokeColor = activePoint.highlightStroke;
                        console.log(activePoint);
                        if (activePoint.datasetLabel && activePoint.label) {
                            /*CUSTOM CODE*/
                            // Only add active points that has a dataset label
                            // AND a label set to a value
                            _activePoints.push(activePoint);
                        } else {
                        }
                    });
                    console.log(_activePoints);
                    this.showTooltip(_activePoints);
                });
            }
        },
        showTooltip: function (ChartElements, forceRedraw) {
            // Only redraw the chart if we've actually changed what we're hovering on.
            if (typeof this.activeElements === 'undefined') this.activeElements = [];

            var isChanged = (function (Elements) {
                var changed = false;

                if (Elements.length !== this.activeElements.length) {
                    changed = true;
                    return changed;
                }

                Chart.helpers.each(Elements, function (element, index) {
                    if (element !== this.activeElements[index]) {
                        changed = true;
                    }
                }, this);
                return changed;
            }).call(this, ChartElements);

            if (!isChanged && !forceRedraw) {
                return;
            }
            else {
                this.activeElements = ChartElements;
            }
            this.draw();
            if (this.options.customTooltips) {
                this.options.customTooltips(false);
            }
            if (ChartElements.length > 0) {
                // If we have multiple datasets, show a MultiTooltip for all of the data points at that index
                if (this.datasets && this.datasets.length > 1) {
                    var dataArray,
                        dataIndex;

                    for (var i = this.datasets.length - 1; i >= 0; i--) {
                        dataArray = this.datasets[i].points || this.datasets[i].bars || this.datasets[i].segments;
                        dataIndex = Chart.helpers.indexOf(dataArray, ChartElements[0]);
                        if (dataIndex !== -1) {
                            break;
                        }
                    }
                    var tooltipLabels = [],
                        tooltipColors = [],
                        medianPosition = (function (index) {

                            // Get all the points at that particular index
                            var Elements = [],
                                dataCollection,
                                xPositions = [],
                                yPositions = [],
                                xMax,
                                yMax,
                                xMin,
                                yMin;
                            Chart.helpers.each(this.datasets, function (dataset) {
                                dataCollection = dataset.points || dataset.bars || dataset.segments;
                                if (dataCollection[dataIndex] && dataCollection[dataIndex].hasValue()) {
                                    Elements.push(dataCollection[dataIndex]);
                                }
                            });

                            Chart.helpers.each(Elements, function (element) {
                                xPositions.push(element.x);
                                yPositions.push(element.y);

                                /*CUSTOM CONDITION*/
                                // Only show tooltips for elements with a
                                // datasetLabel and a label
                                if (element.datasetLabel && element.label) {
                                    //Include any colour information about the element
                                    tooltipLabels.push(Chart.helpers.template(this.options.multiTooltipTemplate, element));
                                    tooltipColors.push({
                                        fill: element._saved.fillColor || element.fillColor,
                                        stroke: element._saved.strokeColor || element.strokeColor
                                    });
                                }

                            }, this);

                            yMin = Chart.helpers.min(yPositions);
                            yMax = Chart.helpers.max(yPositions);

                            xMin = Chart.helpers.min(xPositions);
                            xMax = Chart.helpers.max(xPositions);

                            return {
                                x: (xMin > this.chart.width / 2) ? xMin : xMax,
                                y: (yMin + yMax) / 2
                            };
                        }).call(this, dataIndex);

                    new Chart.MultiTooltip({
                        x: medianPosition.x,
                        y: medianPosition.y,
                        xPadding: this.options.tooltipXPadding,
                        yPadding: this.options.tooltipYPadding,
                        xOffset: this.options.tooltipXOffset,
                        fillColor: this.options.tooltipFillColor,
                        textColor: this.options.tooltipFontColor,
                        fontFamily: this.options.tooltipFontFamily,
                        fontStyle: this.options.tooltipFontStyle,
                        fontSize: this.options.tooltipFontSize,
                        titleTextColor: this.options.tooltipTitleFontColor,
                        titleFontFamily: this.options.tooltipTitleFontFamily,
                        titleFontStyle: this.options.tooltipTitleFontStyle,
                        titleFontSize: this.options.tooltipTitleFontSize,
                        cornerRadius: this.options.tooltipCornerRadius,
                        labels: tooltipLabels,
                        legendColors: tooltipColors,
                        legendColorBackground: this.options.multiTooltipKeyBackground,
                        title: ChartElements[0].label,
                        chart: this.chart,
                        ctx: this.chart.ctx,
                        custom: this.options.customTooltips
                    }).draw();

                } else {
                    Chart.helpers.each(ChartElements, function (Element) {
                        var tooltipPosition = Element.tooltipPosition();
                        new Chart.Tooltip({
                            x: Math.round(tooltipPosition.x),
                            y: Math.round(tooltipPosition.y),
                            xPadding: this.options.tooltipXPadding,
                            yPadding: this.options.tooltipYPadding,
                            fillColor: this.options.tooltipFillColor,
                            textColor: this.options.tooltipFontColor,
                            fontFamily: this.options.tooltipFontFamily,
                            fontStyle: this.options.tooltipFontStyle,
                            fontSize: this.options.tooltipFontSize,
                            caretHeight: this.options.tooltipCaretSize,
                            cornerRadius: this.options.tooltipCornerRadius,
                            text: template(this.options.tooltipTemplate, Element),
                            chart: this.chart,
                            custom: this.options.customTooltips
                        }).draw();
                    }, this);
                }
            }
            return this;
        },
    })

    var ReviewMood = BaseController.extend("mood_tracker.controller.detail.ReviewMood", {
        
        oLineChart : null,

        onInit : function() {
            var oView = this.getView(),
                controller = this;

            //Helpers.applyUiSizeClass(oView);
            //oView.attachAfterRendering(this._updateReviewMood, this);

            oView.addEventDelegate({
                onAfterShow : function(oEvent) {
                    controller.updateReviewMood(!!controller.oLineChart);
                }
            });

            //this._router = sap.ui.core.UIComponent.getRouterFor(this);
            //this._router.getRoute("reviewMood").attachPatternMatched(this._routePatternMatched, this);
        },

        _routePatternMatched: function (oEvent) {
            this.updateReviewMood(true);
        },

        _updateReviewMood : function(oEvent) {
            this.updateReviewMood(false);
        },

        updateReviewMood: function (updateOnly) {
            console.log(updateOnly);
            //alert("Test");
            var oView = this.getView(),
                model = oView.getModel("mood"),
                data = model.getData(),
                lineChartHtml, $lineChartHtml, _canvas, ctx;
            //sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this.onRouteMatched, this);
            //console.log(oView.getModel("mood"));
            if (updateOnly) {
                if (this.oLineChart) {
                    this.updateChart(data.past, this.oLineChart,
                        data.min, data.max, data.average, data.median);
                }
            } else {
                lineChartHtml = oView.byId("lineChartHtml");
                if (this.oLineChart) {
                    // Destroy the Line Chart
                    this.oLineChart.clear().destroy();
                    //lineChartHtml.setContent("");
                    // Re-set the content of the Line Chart HTML control to 
                    // clear the current canvas
                    lineChartHtml.setContent(["<div class='lineChartHtmlContent'>",
                        "<canvas width='100%' height='100%'></canvas>",
                        "</div>"].join(""));
                    
                }
                $lineChartHtml = lineChartHtml.$();//$(lineChartHtml.getDomRef());
                console.log($lineChartHtml);
                
                try {
                    ctx = $lineChartHtml.find("canvas").get(0).getContext("2d");
                } catch (ex) {
                    $.sap.log.error(ex);
                } finally {
                    if (ctx) {
                        this.oLineChart = this.createChart(data.past, ctx,
                            data.min, data.max, data.average, data.median);
                        this.updateChart(data.past, this.oLineChart,
                            data.min, data.max, data.average, data.median);
                        this.oLineChart.update();
                    }
                    window.oLineChart = this.oLineChart;
                }
            }
        },

        createDataSet : function(inputData, dayShift) {
            var outputData = [0, 0, 0, 0, 0, 0, 0];
            $.each(inputData, function (index, item) {
                console.log(item);
                var day = index + dayShift;
                if (day < 0) {
                    day += 7;
                } else if (day > 6) {
                    day -= 7;
                }
                outputData[day] = item;
            });
            console.log(outputData);
            return outputData;
        },

        createFlatDataSet : function(value) {
            return [value, value, value, value, value, value, value];
        },

        createMoodAreaDatasets: function (min, max) {
            var ok_r = 0.65,
                bad_r = 0.35,
                goodMax, okMax, badMax;

            goodMax = max + 0;
            okMax = ok_r * max + (1 - ok_r) * min;
            badMax = bad_r * max + (1 - bad_r) * min;

            return {
                good: [goodMax].concat(this.createFlatDataSet(null)).concat([goodMax]),
                ok: [okMax].concat(this.createFlatDataSet(null)).concat([okMax]),
                bad: [badMax].concat(this.createFlatDataSet(null)).concat([badMax]),
            };
        },

        createDayLabels: function () {
            var locale = sap.ui.getCore().getConfiguration().getLocale(),
                localeData = new sap.ui.core.LocaleData(locale);
            return localeData.getDays("abbreviated");
        },

        createChart: function (inputData, ctx, min, max, avg, med) {
            var sFillColor = this.getThemingParameter("sapUiMediumBG"),
                sStrokeColor = this.getThemingParameter("sapUiChart4"),
                sGoodColor = this.getThemingParameter("sapUiChartGood"),
                sOKColor = this.getThemingParameter("sapUiChartNeutral"),
                sBadColor = this.getThemingParameter("sapUiChartBad"),
                currentDay = new Date().getDay() + 1,
                dayShift, outputData,
                average = $.isNumeric(avg) ? avg : Formatter.average(inputData),
                median = $.isNumeric(med) ? med : Formatter.median(inputData),
                moodAreasData = this.createMoodAreaDatasets(min, max),
                tooltipLabels = Formatter.makeStringsSameLength(
                    this.getLocalizedText("reviewMoodChartLabelAverage"),
                    this.getLocalizedText("reviewMoodChartLabelMedian"),
                    this.getLocalizedText("reviewMoodChartLabelMood")),
                sReviewMoodChartLabelAverage = tooltipLabels[0],
                sReviewMoodChartLabelMedian = tooltipLabels[1],
                sReviewMoodChartLabelMood = tooltipLabels[2].trim(),
                labels = this.createDayLabels(),
                data;

            if (currentDay > 6) {
                currentDay = 0;
            }
            dayShift = -currentDay;

            outputData = this.createDataSet(inputData.map(function (item, index) {
                console.log(item);
                return item.value;   
            }), dayShift);
            console.log(outputData);
            var realMax = Math.max.apply(null, outputData);
            if (realMax < moodAreasData.good[0]) {
                //moodAreasData.good = this.createFlatDataSet(realMax);
            }
            console.log(moodAreasData);
            data = {
                labels: this.createDataSet(labels, dayShift),
                datasets: [
                    {
                        fillColor: sGoodColor, //"rgba(220,220,220,0.2)",
                        strokeColor: sGoodColor, //"rgba(220,220,220,1)",
                        pointColor: "transparent",
                        pointStrokeColor: "transparent",
                        pointHighlightFill: "transparent",
                        pointHighlightStroke: "transparent",
                        data: moodAreasData.good
                    }, {
                        fillColor: sOKColor, //"rgba(220,220,220,0.2)",
                        strokeColor: sOKColor, //"rgba(220,220,220,1)",
                        pointColor: "transparent",
                        pointStrokeColor: "transparent",
                        pointHighlightFill: "transparent",
                        pointHighlightStroke: "transparent",
                        data: moodAreasData.ok
                    }, {
                        fillColor: sBadColor, //"rgba(220,220,220,0.2)",
                        strokeColor: sBadColor, //"rgba(220,220,220,1)",
                        pointColor: "transparent",
                        pointStrokeColor: "transparent",
                        pointHighlightFill: "transparent",
                        pointHighlightStroke: "transparent",
                        data: moodAreasData.bad
                    }, {
                        fillColor: sBadColor, //"rgba(220,220,220,0.2)",
                        strokeColor: sBadColor, //"rgba(220,220,220,1)",
                        pointColor: "transparent",
                        pointStrokeColor: "transparent",
                        pointHighlightFill: "transparent",
                        pointHighlightStroke: "transparent",
                        data: this.createFlatDataSet(null).concat([0])
                    },
                    {
                        label: sReviewMoodChartLabelAverage, //"Average",
                        fillColor: "transparent", //"rgba(220,220,220,0.2)",
                        strokeColor: this.getThemingParameter("sapUiChart5"), //"rgba(220,220,220,1)",
                        pointColor: this.getThemingParameter("sapUiChart5"),
                        pointStrokeColor: "transparent",
                        pointHighlightFill: "transparent",
                        pointHighlightStroke: "transparent",
                        data: this.createFlatDataSet(average).concat(average)
                    },
                    {
                        label: sReviewMoodChartLabelMedian, //"Median",
                        fillColor: "transparent", //"rgba(220,220,220,0.2)",
                        strokeColor: this.getThemingParameter("sapUiChart3"), //"rgba(220,220,220,1)",
                        pointColor: this.getThemingParameter("sapUiChart3"),
                        pointStrokeColor: "transparent",
                        pointHighlightFill: "transparent",
                        pointHighlightStroke: "transparent",
                        data: this.createFlatDataSet(median).concat(median)
                    },
                    {
                        label: sReviewMoodChartLabelMood, //"Mood",
                        fillColor: "transparent", //"rgba(220,220,220,0.2)",
                        strokeColor: sStrokeColor, //"rgba(220,220,220,1)",
                        pointColor: sStrokeColor,
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: outputData
                    }
                ]
            };
            return new Chart(ctx).MyLineChart(data, {
                bezierCurve: true,
                
                //Boolean - Whether to show a dot for each point
                pointDot: true,

                //Number - Radius of each point dot in pixels
                pointDotRadius: 2,

                //Number - Pixel width of point dot stroke
                pointDotStrokeWidth: 4,

                // Boolean - whether or not the chart should be responsive and 
                // resize when the browser does.
                responsive: true,

                // Boolean - whether to maintain the starting aspect ratio or 
                // not when responsive, if set to false, will take up entire 
                // container
                maintainAspectRatio: false,

                //Boolean - Whether to show a stroke for datasets
                datasetStroke: true,

                //Number - Pixel width of dataset stroke
                datasetStrokeWidth: 4,

                scaleShowLabels: true,

                scaleStartValue: 1,

                // Boolean - Determines whether to draw tooltips on the canvas or not
                showTooltips: true,

                // String - Tooltip label font declaration for the scale label
                tooltipFontFamily: "monospace",

                multiTooltipTemplate: [
                    "<%if (datasetLabel) { %>",
                        "<%= datasetLabel %>: ",
                    "<% } %>",
                    "<%= value %>", " ",
                    "<%if (averageCompare) { %>",
                        "(<%= averageCompare %>%)",
                    "<% } %>",
                ].join(""),
                    //"<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %> <%if (average){%>(<%= ((value / average) * 100).toFixed(0)  %>%)<%}%>",
                //String - A legend template
                legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
            });
        },

        updateChart: function (inputData, oLineChart, min, max, avg, med) {
            console.log(oLineChart.datasets);
            var lastDataset = oLineChart.datasets.length - 1,
                currentDay = new Date().getDay() + 1,
                dayShift,
                moodAreasData = this.createMoodAreaDatasets(min, max),
                outputData,
                average = $.isNumeric(avg) ? avg : Formatter.average(inputData),
                median = $.isNumeric(med) ? med : Formatter.median(inputData),
                averageDataSet = this.createFlatDataSet(average).concat(average),
                medianDataSet = this.createFlatDataSet(median).concat(median);

            if (currentDay > 6) {
                currentDay = 0;
            }
            dayShift = -currentDay;

            var realMax = Math.max.apply(null, inputData);
            if (realMax < moodAreasData.good[0]) {
                //moodAreasData.good = this.createFlatDataSet(realMax);
            }
            console.log(moodAreasData.good);
            $.each(moodAreasData.good, function (index, item) {
                oLineChart.datasets[0].points[index].value = item;
            });
            $.each(moodAreasData.ok, function (index, item) {
                oLineChart.datasets[1].points[index].value = item;
            });
            $.each(moodAreasData.bad, function (index, item) {
                oLineChart.datasets[2].points[index].value = item;
            });

            outputData = this.createDataSet(inputData.map(function(item, index) {
                return item.value;   
            }), dayShift);

            $.each(averageDataSet, function (index, item) {
                oLineChart.datasets[lastDataset - 2].points[index].value = item;
                oLineChart.datasets[lastDataset - 2].points[index].averageCompare = null;
                //oLineChart.datasets[lastDataset - 2].points[index].average = null;
                //oLineChart.datasets[lastDataset - 2].points[index].median = null;
            });
            $.each(medianDataSet, function (index, item) {
                oLineChart.datasets[lastDataset - 1].points[index].value = item;
                oLineChart.datasets[lastDataset - 1].points[index].averageCompare = null;
                //oLineChart.datasets[lastDataset - 1].points[index].average = null;
                //oLineChart.datasets[lastDataset - 1].points[index].median = null;
            });
            $.each(outputData, function (index, item) {
                oLineChart.datasets[lastDataset].points[index].value = item;
                oLineChart.datasets[lastDataset].points[index].averageCompare =
                    Math.round((item / average) * 100);
                //oLineChart.datasets[lastDataset].points[index].average = average;
                //oLineChart.datasets[lastDataset].points[index].median = median;
            });
            oLineChart.update();
            console.log(oLineChart.datasets);


        },

        getThemingParameter: function (sKey) {
            return sap.ui.core.theming.Parameters.get(sKey);
        },

        handleFullScreenClick: function (oEvent) {
            BaseController.prototype.handleFullScreenClick.apply(this, arguments);
            if (this.oLineChart) {
                this.updateReviewMood(false);
            }
        }
    });


    return ReviewMood;

}, /* bExport= */ true);
