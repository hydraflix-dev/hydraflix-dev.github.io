var yify = "http://crossorigin.me/http://yify.is/index.php/api/v2/list_movies.json";
angular.module('myAppServices', ['ngResource']);

    factory('BreakinBadChar', function($resource){

  return $resource(yify, {}, {

    query: {method:'GET', isArray: true}

  });

});
    /*

function InstantSearchController($scope, $http){
 $scope.search = function() {   
  $http.jsonp("http://something.com/lol?query="+ $scope.searchString + "?json_callback=JSON_CALLBACK").success(
                        function(data, status) {
                            console.log(data);
                        }
                );
 }

    */
