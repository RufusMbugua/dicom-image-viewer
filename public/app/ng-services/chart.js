angular.module('div').factory('senChart', ['$rootScope', function(rootScope) {
  var senChart = {};

  senChart.plot = function plot(series, type) {
    var chartConfig = {

      options: {
        //This is the Main Highcharts chart config. Any Highchart options are valid here.
        //will be overriden by values specified below.
        chart: {
          type: type
        },
        tooltip: {
          style: {
            padding: 10,
            fontWeight: 'bold'
          }
        }
      },
      //The below properties are watched separately for changes.

      //Series object (optional) - a list of series using normal Highcharts series options.
      series: series,
      //Title configuration (optional)
      title: {
        text: ''
      },
      //Boolean to control showing loading status on chart (optional)
      //Could be a string if you want to show specific loading text.
      loading: false,
      //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
      //properties currentMin and currentMax provided 2-way binding to the chart's maximum and minimum
      xAxis: {
        title: {
          text: ''
        },
        labels: {
          enabled: false
        }
      },
      yAxis: {
        title: {
          text: ''
        }
      },
      //Whether to use Highstocks instead of Highcharts (optional). Defaults to false.
      useHighStocks: false,
      credits: {
        enabled: false
      },
      //function (optional)
      func: function(chart) {
        //setup some logic for the chart
      },
      size: {
        height: 200
      }
    };
    return chartConfig;
  }

  return senChart;
}])
