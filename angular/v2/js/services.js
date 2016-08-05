var yify = "http://yify.is/index.php/api/v2/list_movies.json"
angular.module('myAppServices', ['ngResource']).

    factory('BreakinBadChar', function($resource){

  return $resource(yify, {}, {

    query: {method:'GET', isArray: true}

  });

});
