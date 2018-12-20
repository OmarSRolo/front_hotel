// config

var app =
    angular.module('app')

.config(
    ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', 'socialProvider',

        function($controllerProvider, $compileProvider, $filterProvider, $provide, socialProvider) {

            // lazy controller, directive and service
            app.controller = $controllerProvider.register;
            app.directive = $compileProvider.directive;
            app.filter = $filterProvider.register;
            app.factory = $provide.factory;
            app.service = $provide.service;
            app.constant = $provide.constant;
            app.value = $provide.value;

            socialProvider.setGoogleKey("574220769454-bmjibnitr2d7dm760tka70a9ojkerv27.apps.googleusercontent.com");
            socialProvider.setLinkedInKey("YOUR LINKEDIN CLIENT ID");
            socialProvider.setFbKey({
                appId: "1260171127430558",
                apiVersion: "v2.8"
            });
        }
    ])

.config(['$translateProvider', function($translateProvider) {
    // Register a loader for the static files
    // So, the module will search missing translation tables under the specified urls.
    // Those urls are [prefix][langKey][suffix].
    $translateProvider.useStaticFilesLoader({
        prefix: 'site/src/l10n/',
        suffix: '.json'
    });
    // Tell the module what language to use by default

    // Tell the module to store the language in the local storage


    var lang = window.navigator.language || window.navigator.userLanguage;

    // lang = lang ?  lang.substring(0,2) : 'es';
    lang = 'es';


    // lang && $translateProvider.preferredLanguage(lang);
    lang && $translateProvider.preferredLanguage('es');


    $translateProvider.useLocalStorage();

}])

.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.latencyThreshold = 0;
    cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-bar-spinner"><div class="fa-spin fa fa-spinner color-app" style="font-size:82px;">  </div></div>';
}]);
