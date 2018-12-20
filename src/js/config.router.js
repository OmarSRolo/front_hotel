'use strict';

/**
 * Config for the router
 */
angular.module('app')
    .run(
        ['$rootScope', '$state', '$stateParams', '$templateCache', '$translate', function ($rootScope, $state, $stateParams, $templateCache, $translate) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.pageTitle = "Dashboard Atuhotel";

            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {


                if (toState.resolve != null) {
                    if (toState.resolve.pageTitle !== null) {
                        $rootScope.pageTitle = $translate.instant(toState.resolve.pageTitle);
                    }
                    $rootScope.pageHeader = null;
                    if (toState.resolve.pageHeader !== null) {
                        $rootScope.pageHeader = $translate.instant(toState.resolve.pageHeader);
                    }
                    $rootScope.pageSubHeader = null;
                    if (toState.resolve.pageSubHeader !== null) {
                        $rootScope.pageSubHeader = $translate.instant(toState.resolve.pageSubHeader);
                    }
                }
            });

            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {

                if (error.unAuthorized) {
                    $state.go('app.login', {
                        unAuthorized: true
                    });
                    event.preventDefault();
                }
            });
        }]
    )
    .config(
        ['$stateProvider', '$urlRouterProvider', '$locationProvider',
            function ($stateProvider, $urlRouterProvider, $locationProvider) {
                var layout = "site/src/views/index.html";
                $urlRouterProvider.otherwise('content/about_us');

                $stateProvider.state('app', {
                    abstract: true,
                    url: '',
                    templateUrl: layout
                })

                    .state('app.login', {
                        url: '/login',
                        templateUrl: 'site/src/views/app/access/login.html',
                        controller: 'LoginCtr',
                        resolve: {}
                    })

                    .state('app.dashboard', {
                        url: '',
                        params: {
                            unAuthorized: true
                        },
                        templateUrl: 'site/src/views/dashboard.html',
                        resolve: {
                            security: ['Auth', '$q', function (Auth, $q) {
                                return (Auth.isLogged() && Auth.get().role == 'admin') || $q.reject({
                                        unAuthorized: true
                                    });
                            }]
                        }
                    })

                    .state('app.dashboard.content', {
                        url: '/content/:key',
                        params: {
                            // unAuthorized: false
                        },
                        templateUrl: 'site/src/views/app/contents.html',
                        controller: 'ContenCtr'
                    })

                    .state('app.dashboard.faqs', {
                        url: '/faqs',
                        templateUrl: 'site/src/views/app/faqs/index.html',
                        controller: 'FaqsCtr',
                        resolve: {}
                    })

                    .state('app.dashboard.coins', {
                        url: '/coins',
                        templateUrl: 'site/src/views/app/coins/index.html',
                        controller: 'CoinsCtr',
                        resolve: {}
                    })
                    .state('app.dashboard.services', {
                        url: '/services',
                        templateUrl: 'site/src/views/app/services/index.html',
                        controller: 'ServicesCtr',
                        resolve: {}
                    })


                    .state('app.dashboard.users', {
                        url: '/users',
                        templateUrl: 'site/src/views/app/users/index.html',
                        controller: 'UsersCtr',
                        resolve: {}
                    })

                    .state('app.dashboard.listing_type', {
                        url: '/listing-types',
                        templateUrl: 'site/src/views/app/listing_type/index.html',
                        controller: 'ListingTypeCtr',
                        resolve: {}
                    })

                    .state('app.dashboard.listing_category', {
                        url: '/listing-categories',
                        templateUrl: 'site/src/views/app/listing_category/index.html',
                        controller: 'ListingCategoryCtr',
                        resolve: {}
                    })

                    .state('app.dashboard.bank', {
                        url: '/banks',
                        templateUrl: 'site/src/views/app/bank/index.html',
                        controller: 'BankCtr',
                        resolve: {}
                    })

                    .state('app.dashboard.listing', {
                        url: '/listings',
                        templateUrl: 'site/src/views/app/listings/index.html',
                        controller: 'ListingCtr',
                        resolve: {}
                    })

                    //Yeiniel
                    .state('app.dashboard.listings_insert', {
                        url: '/listings/insert',
                        templateUrl: 'site/src/views/app/listings/insert.html',
                        controller: 'ListingsInsertCtr',
                        resolve:{}
                    })

                    .state('app.dashboard.listings_update', {
                        url: '/listings/edit/:listing_id',
                        templateUrl: 'site/src/views/app/listings/edit.html',
                        controller: 'ListingsEditCtr',
                        resolve: {
                            security: ['Auth', '$q', function (Auth, $q) {
                                return Auth.isLogged() || $q.reject({
                                        unAuthorized: true
                                    });
                            }]
                        }
                    });

                $locationProvider.html5Mode(true);

            }
        ]
    );
