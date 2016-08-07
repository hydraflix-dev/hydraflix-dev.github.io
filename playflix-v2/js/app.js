/*
var app = angular.module("app", []);
app.controller("HelloController", function($scope) {
  $scope.message = "Hello, AngularJS";	
});
*/

var app = angular.module("MyApp", []);

app.controller("PostsCtrl", function($scope, $http) {
  $http.get('https://yts.ag/api/v2/list_movies.json?&page=1&sort_by=year&quality=720p&limit=24').
    success(function(data, status, headers, config) {
    	console.log(data);
      $scope.posts = data.data.movies;
    }).
    error(function(data, status, headers, config) {
      // log error
    });
});