(function (define, angular) {
    'use strict';
    define(
            [],
            angular.module('yifyDirectives', [])
            .directive('ytsCircularProgress', ytsCircularProgress)
            .directive('navBar', navBar)
            .directive('breadcrumbs', breadcrumbs)
            .directive('searchBox', searchBox)
            .directive('pagination', pagination)
            );

    function pagination($rootScope, yifyService, $location) {
        var directive = {
            restrict: "E",
            transclude: true,
            replace: true,
            scope: {
                paginate: '='
            },
            templateUrl: './ng-app/partials/pagination.html',
            controller: PaginationController,
            controllerAs: 'paginationCtrl',
            link: function (scope, elem, attr, ctrl) {

                scope.setPage = function (page) {
                    scope.paginate.page_number = page;
                    $rootScope.$emit('update-page', page);
                };

                scope.prevPage = function () {
                    if (scope.paginate.page_number !== 1) {
                        scope.paginate.page_number = Math.max(1, scope.paginate.page_number - 1);
                        $rootScope.$emit('update-page', scope.paginate.page_number);
                    }
                };

                scope.nextPage = function () {
                    if (scope.paginate.page_number !== ctrl.getTotalPages()) {
                        scope.paginate.page_number = Math.min(scope.paginate.page_number + 1, ctrl.getTotalPages());
                        $rootScope.$emit('update-page', scope.paginate.page_number);
                    }
                };

            }
        };

        function PaginationController($rootScope, $scope, $filter) {

            var vm = this;

            vm.getTimes = function () {
                var length = Math.min(16, Math.max(1, vm.getTotalPages()));
                return new Array(length > 0 ? length : 1);
            };

            vm.pageFactor = function () {
                var pageFactor = Math.max(1, Math.min((vm.getTotalPages() - 15), $scope.paginate.page_number - 7));
                return pageFactor;
            };

            vm.getTotalPages = function () {
                var totalPages = Math.ceil(($scope.paginate.movie_count / $scope.paginate.limit));
                return totalPages > 0 ? totalPages : 21;
            };
        }

        return directive;
    }

    function searchBox($rootScope, yifyService, $location) {
        var directive = {
            restrict: "E",
            transclude: true,
            replace: true,
            scope: {
                collapsible: "=collapsible"
            },
            templateUrl: './ng-app/partials/search-box.html',
            controller: SearchController,
            controllerAs: 'searchCtrl'
        };

        function SearchController($scope, $filter) {

            var vm = this;

            vm.search = $location.search() ? $location.search() : {};

            vm.filters = {
                quality: ['720p', '1080p', '3D'],
                genre: ["all", "action", "adventure", "animation", "biography", "comedy", "crime", "documentary", "drama", "family", "fantasy", "filmnoir", "history", "horror", "music", "musical", "mystery", "news", "romance", "scifi", "short", "sport", "thriller", "war", "western", "all", "action", "adventure", "animation", "biography", "comedy", "crime", "documentary", "drama", "family", "fantasy", "filmnoir", "history", "horror", "music", "musical", "mystery", "news", "romance", "scifi", "short", "sport", "thriller", "war", "western"],
                rating: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
                sort: ["latest", "oldest", "seeds", "peers", "year", "rating", "likes", "downloads", "latest", "oldest", "seeds", "peers", "year", "rating", "likes", "title", "downloads"],
                order: ["asc", "desc"]
            };

            vm.doSearch = function () {
                $scope.$emit('update-search-filters', vm.search);
            };

        }

        return directive;
    }

    function breadcrumbs($rootScope) {

        var directive = {
            restrict: "E",
            transclude: true,
            replace: true,
            templateUrl: './ng-app/partials/breadcrumbs.html',
            controller: BreadCrumbController,
            controllerAs: 'breadcrumbCtrl'
        };

        function BreadCrumbController($scope, $location) {

            var vm = this;

            vm.crumbs = [];

            $scope.$on('set-crumb', function (event, crumbs) {
                vm.crumbs = crumbs;
            });

            $scope.$on('add-crumb', function (event, newCrumb) {
                for (var crumb in vm.crumbs) {
                    if (vm.crumbs[crumb].path === newCrumb.path) {
                        return;
                    }
                }
                vm.crumbs.push(newCrumb);
            });

            $scope.$on('remove-crumb', function () {
                vm.crumbs.pop();
            });

            vm.goTo = function (path) {
                $location.path(path).search();
            };

        }

        return directive;
    }

    navBar.$inject = ['$translate'];
    function navBar($translate) {
        var directive = {
            restrict: "E",
            transclude: true,
            replace: true,
            templateUrl: './ng-app/partials/nav-bar.html',
            controller: NavBarController,
            controllerAs: 'navbarCtrl'
        };

        function NavBarController($location) {
            var vm = this;

            vm.goHomeYoureDrunk = function () {
                $location.path('/home');
            };

            vm.searchTerm = "";

            vm.doSearch = function () {
                $location.path('/list').search({query_term: vm.searchTerm});
            };

            $translate.use('en-us');

            vm.currentLanguage = {};

            vm.possibleLanguages = [
                'pt-br'
            ];

            vm.setLanguage = function (language) {
                $translate.use(language);
            };

        }

        return directive;
    }

    function ytsCircularProgress() {

        var directive = {
            restrict: "E",
            transclude: true,
            replace: true,
            templateUrl: './ng-app/partials/md-progress.html'
        };

        return directive;
    }

})(define, angular);
