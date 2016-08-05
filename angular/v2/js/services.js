function InstantSearchController($scope, $http){
 $scope.search = function() {   
  $http.jsonp("http://yify.is/index.php/api/v2/list_movies.json").success(
           function(data, status) {
               console.log(data);
           }
   );
 };
