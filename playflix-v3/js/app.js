var myApp = angular.module('myApp', ['infinite-scroll'])
.config( [
    '$compileProvider',
    function( $compileProvider )
    {   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|magnet):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }
]);
myApp.controller('DemoController', function($scope, Playflix) {
  $scope.playflix = new Playflix();
});
// Playflix constructor function to encapsulate HTTP and pagination logic
myApp.factory('Playflix', function($http) {
  var page = 1;
  var Playflix = function() {
    this.items = [];
    this.busy = false;
  };
  Playflix.prototype.nextPage = function() {
    if (this.busy) return;
    this.busy = true;    
    $http.get("https://yts.ag/api/v2/list_movies.jsonp?sort_by=year&quality=720p&limit=24&page="+page).success(function(data) {
      var items = data.data.movies;
      var i = 0;
      for (var i = 0; i < items.length; i++) {
        this.items.push(items[i]);
      }
      this.busy = false;
    }.bind(this));
    page = page + 1;
  };
  return Playflix;
});