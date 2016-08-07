// Module bootstrap Config
require.config({
    baseUrl: './',
    waitSeconds: 0,
    paths: {
        // Angular
        'angular': 'vendors/angular/angular.min',
        'angular-route': 'vendors/angular-route/angular-route.min',
        'angular-resource': 'vendors/angular-resource/angular-resource.min',
        // Third party
        'jquery': 'vendors/jquery/jquery.min',
        'bootstrap': 'vendors/bootstrap/dist/js/bootstrap.min',
        'cbox': 'vendors/jquery-colorbox/jquery.colorbox-min',
        // App
        'yify-app': 'ng-app/yifyApp',
        'yify-directives': 'ng-app/yifyDirectives',
        'yify-controllers': 'ng-app/yifyControllers',
        'yify-services': 'ng-app/yifyServices',
        'yify-i18n': 'ng-app/yifyi18n'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'jquery': {
            deps: ['angular']
        },
        'cbox': {
            deps: ['jquery']
        },
        'bootstrap': {
            deps: ['cbox']
        },
        'angular-route': {
            deps: ['angular']
        },
        'angular-resource': {
            deps: ['angular']
        },
        'yify-app': {
            deps: ['bootstrap']
        }
    }
});
//Module Bootstrap
require(['yify-app'], function () {
    angular.element(document).ready(function () {
        angular.bootstrap(angular.element(document.getElementsByClassName("yifyApp")), ['yifyApp']);
    });
});