var myApp = angular.module('myApp', ['infinite-scroll']);
var page = 1;

myApp.controller('DemoController', function($scope, Reddit) {
  $scope.reddit = new Reddit();
});

// Reddit constructor function to encapsulate HTTP and pagination logic
myApp.factory('Reddit', function($http) {
  var Reddit = function() {
    this.items = [];
    this.busy = false;
    this.after = '';
  };

  Reddit.prototype.nextPage = function() {
    if (this.busy) return;
    this.busy = true;

    var url = "https://yts.ag/api/v2/list_movies.json?sort_by=year&quality=720p&limit=24&page="+this.after;
    $http.jsonp(url).success(function(data) {
      var items = data.data.movies;
      for (var i = 0; i < items.length; i++) {
        this.items.push(items[i].data);
      }
      this.after = page++;
      console.log(this.after);
      this.busy = false;
    }.bind(this));
  };

  return Reddit;
});