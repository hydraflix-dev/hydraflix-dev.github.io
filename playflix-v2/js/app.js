var myApp = angular.module('myApp', ['infinite-scroll']);
var page = 1;
myApp.controller('DemoController', function($scope, Reddit) {
  $scope.reddit = new Reddit();
});
// Reddit constructor function to encapsulate HTTP and pagination logic
myApp.factory('Reddit', function($http) {
  var Reddit = function() {
    this.items = [];
  };
  Reddit.prototype.nextPage = function() {
    $http.get("https://yts.ag/api/v2/list_movies.jsonp?sort_by=year&quality=720p&limit=24&page="+page).success(function(data) {
      var items = data.data.movies;
      for (var i = 0; i < items.length; i++) {
        this.items.push(items[i]);
      }
      page++;
    }.bind(this));
  };
  return Reddit;
});