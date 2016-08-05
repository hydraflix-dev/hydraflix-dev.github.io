var yify = "https://yts.ag/api/v2/list_movies.json"
angular.module('myAppServices', ['ngResource']).

    factory('BreakinBadChar', function($resource){

  return $resource(resourceName, {}, {

    query: {method:'GET', params:{resourceName:yify}, isArray: true}

  });

});
