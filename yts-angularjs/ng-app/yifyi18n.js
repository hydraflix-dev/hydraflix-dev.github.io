(function (define, angular) {
    'use strict';
    define(
            [
                './vendors/angular-translate/angular-translate.min.js',
                './vendors/angular-cookies/angular-cookies.min.js',
                './vendors/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js',
                './vendors/angular-translate-storage-local/angular-translate-storage-local.min.js',
                './vendors/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js'
            ],
            angular.module('yifyi18n', [
                'ngCookies',
                'pascalprecht.translate'
            ])
            .config(function ($translateProvider) {
                $translateProvider.useStaticFilesLoader({
                    prefix: './ng-app/i18n/',
                    suffix: '.json'
                });
                $translateProvider.preferredLanguage('pt-br');
//                $translateProvider.useLocalStorage();
            })
            );
})(define, angular);