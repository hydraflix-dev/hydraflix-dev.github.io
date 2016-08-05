angular.module('myAppServices', ['ngResource']).

    factory('BreakinBadChar', function($resource){

  return $resource(':resourceName.json', {}, {

    query: {method:'GET', params:{resourceName:'breaking_bad_char'}, isArray: true}

  });

});