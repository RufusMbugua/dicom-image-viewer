angular.module('div').factory('senFilter', ['$rootScope', '$filter', function(rootScope, filter) {
  var senFilter = {};
  // Group By Filter
  senFilter.groupBy = filter('groupBy');
  // Order by Filter
  senFilter.orderBy = filter('orderBy');

  senFilter.cleanDates = function cleanDates(data) {
    angular.forEach(data, function(value, key) {
      if (typeof value.created_at !== 'undefined') {
        value.created_at = moment(value.created_at).format(
          'DD-MM-YYYY');
      }
    })
    return data;
  }
  return senFilter;
}]);
