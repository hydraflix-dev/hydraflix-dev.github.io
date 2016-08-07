(function (define, angular) {
    'use strict';
    //define dependencies to requireJs
    define(
            [
                // Angular
                'angular-resource',
                'angular-route',
                // App 
                'yify-controllers',
                'yify-directives',
                'yify-services',
                'yify-i18n'
            ],
            angular.module('yifyApp',
                    [
                        // Angular
                        'ngResource',
                        'ngRoute',
                        // App
                        'yifyControllers',
                        'yifyDirectives',
                        'yifyServices',
                        'yifyi18n'
                    ])
            .constant('mdPreloader', 'md-preloader')
            .factory('httpInterceptor', httpInterceptor)
            .config(AppConfig));

    httpInterceptor.$inject = ['$q', '$rootScope', '$window', 'mdPreloader'];
    function httpInterceptor($q, $rootScope, $window, mdPreloader) {

        var numLoadings = 0;

        return {
            'request': function (config) {
                numLoadings++;
                // Show loader
                angular.element(document.getElementById(mdPreloader)).css('display', 'block');
                return config || $q.when(config)
            },
            'response': function (response) {

                // intercepts the response. you can examine things like status codes
                if ((--numLoadings) === 0) {
                    // Hide loader
                    angular.element(document.getElementById(mdPreloader)).css('display', 'none');
                }

                return response || $q.when(response);
            },
            'responseError': function (response) {
                // intercepts the response when the response was an error
                if (!(--numLoadings)) {
                    // Hide loader
                    // Hide loader
                    angular.element(document.getElementById(mdPreloader)).css('display', 'none');
                }

                return $q.reject(response);
            }
        }
    }

    AppConfig.$inject = ['$routeProvider', '$httpProvider'];
    function AppConfig($routeProvider, $httpProvider) {

        // Route options
        $httpProvider.interceptors.push('httpInterceptor');

        $routeProvider
                .when('/home', {
                    templateUrl: './ng-app/partials/home.html',
                    controller: 'HomeController',
                    controllerAs: 'homeCtrl'
                })
                .when('/list', {
                    templateUrl: './ng-app/partials/list.html',
                    controller: 'ListController',
                    controllerAs: 'listCtrl'
                })
                .when('/details/:id', {
                    templateUrl: './ng-app/partials/detail.html',
                    controller: 'DetailController',
                    controllerAs: 'detailCtrl'
                })
                .otherwise({
                    redirectTo: '/home'
                });
    }
})(define, angular);
