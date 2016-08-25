angular.module('div').factory('rmFilter', ['$rootScope', '$filter', function(rootScope, filter) {
  var rmFilter = {};
  // Group By Filter
  rmFilter.groupBy = filter('groupBy');
  // Order by Filter
  rmFilter.orderBy = filter('orderBy');
  rmFilter.where = filter('where');

  rmFilter.cleanDates = function cleanDates(data) {
    angular.forEach(data, function(value, key) {
      if (typeof value.created_at !== 'undefined') {
        value.created_at = moment(value.created_at).format(
          'DD-MM-YYYY');
      }
    })
    return data;
  }
  return rmFilter;
}]);
