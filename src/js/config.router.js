'use strict';

/**
 * Config for the router
 */
angular.module('app')
    .run(
        ['$rootScope', '$state', '$stateParams', '$templateCache', function ($rootScope, $state, $stateParams, $templateCache) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                window.scrollTo(0, 0);

                if (toState.resolve != null) {
                    if (toState.resolve.pageTitle != null) {
                        $rootScope.pageTitle = $translate.instant(toState.resolve.pageTitle());
                    }
                    $rootScope.pageHeader = null;
                    if (toState.resolve.pageHeader != null) {
                        $rootScope.pageHeader = $translate.instant(toState.resolve.pageHeader());
                    }
                    $rootScope.pageSubHeader = null;
                    if (toState.resolve.pageSubHeader != null) {
                        $rootScope.pageSubHeader = $translate.instant(toState.resolve.pageSubHeader());
                    }
                }
            });

            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {

                if (error.unAuthorized) {
                    $state.go('app.home', {
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
                $urlRouterProvider.otherwise('/');

                $stateProvider.state('app', {
                        abstract: true,
                        url: '',
                        templateUrl: layout
                    })

                    .state('app.home', {
                        url: '/',
                        params: {
                            unAuthorized: false
                        },
                        templateUrl: 'site/src/views/app/home.html',
                        controller: 'HomeCtr'
                    })

                    .state('app.confirmation', {
                        url: '/confirmation/:token',
                        templateUrl: 'site/src/views/app/profile/confirmation.html',
                        controller: 'ProfileConfirmationCtr'
                    })


                    .state('app.faqs', {
                        url: '/faqs',
                        templateUrl: 'site/src/views/app/pages/faqs.html',
                        controller: 'FaqsCtr',
                        resolve: {}

                    })

                    .state('app.about_us', {
                        url: '/about_us',
                        templateUrl: 'site/src/views/app/pages/about_us.html',
                        controller: 'AboutUsCtr',
                        resolve: {}
                    })

                    .state('app.legal_terms', {
                        url: '/legal',
                        templateUrl: 'site/src/views/app/pages/legal_terms.html',
                        controller: 'LegalTermsCtr',
                        resolve: {}
                    })

                    .state('app.different', {
                        url: '/different',
                        templateUrl: 'site/src/views/app/pages/different.html',
                        controller: 'DifferentCtr',
                        resolve: {}
                    })

                    .state('app.privacity', {
                        url: '/privacity',
                        templateUrl: 'site/src/views/app/pages/privacity.html',
                        controller: 'PrivacityCtr',
                        resolve: {}
                    })
                    .state('app.how_works', {
                        url: '/how-works',
                        templateUrl: 'site/src/views/app/pages/how_works.html',
                        controller: 'HowWorkCtr',
                        resolve: {}
                    })

                    .state('app.signup_hotel', {
                        url: '/signup_hotel',
                        templateUrl: 'site/src/views/app/pages/signup_hotel.html',
                        controller: 'SignupHotelCtr',
                        resolve: {}
                    })

                    .state('app.cookies', {
                        url: '/cookies',
                        templateUrl: 'site/src/views/app/pages/cookies.html',
                        controller: 'CookiesCtr',
                        resolve: {}
                    })

                    .state('app.dashboard', {
                        url: '/social/:post_type',
                        templateUrl: 'site/src/views/app/dashboard.html',
                        controller: 'DashboardCtr',
                        resolve: {
                            deps: load([
                                'ui.select',
                                'site/src/js/controllers/dashboard.js',
                                'site/src/js/controllers/posts/posts.js'
                            ]).deps
                        }

                    })

                    .state('app.legal', {
                        url: '/legal',
                        templateUrl: 'site/src/views/app/legal/index.html'
                    })

                    .state('app.profile', {
                        url: '/profile/:id',
                        controller: 'ProfileCtr',
                        templateUrl: 'site/src/views/app/profile/index.html',
                        resolve: {
                            security: ['Auth', '$q', function (Auth, $q) {
                                return Auth.isLogged() || $q.reject({
                                        unAuthorized: true
                                    });
                            }]
                        }
                    })

                    .state('app.profile.info', {
                        url: '/info',
                        controller: 'ProfileInfoCtr',
                        templateUrl: 'site/src/views/app/profile/info.html',
                        resolve: {
                            security: ['Auth', '$q', function (Auth, $q) {
                                return Auth.isLogged() || $q.reject({
                                        unAuthorized: true
                                    });
                            }]
                        }
                    })
                    .state('app.profile.hotel', {
                        url: '/hotel',
                        controller: 'ProfileHotelCtr',
                        templateUrl: 'site/src/views/app/profile/hotel.html',
                        resolve: {
                            security: ['Auth', '$q', function (Auth, $q) {
                                return Auth.isLogged() || $q.reject({
                                    unAuthorized: true
                                });
                            }]
                        }
                    })

                    .state('app.profile.location', {
                        url: '/location',
                        controller: 'ProfileLocationCtr',
                        templateUrl: 'site/src/views/app/profile/location.html',
                        resolve: {
                            security: ['Auth', '$q', function (Auth, $q) {
                                return Auth.isLogged() || $q.reject({
                                        unAuthorized: true
                                    });
                            }]
                        }
                    })

                    .state('app.profile.verification', {
                        url: '/verification',
                        controller: 'ProfileVerificationCtr',
                        templateUrl: 'site/src/views/app/profile/verification.html',
                        resolve: {
                            security: ['Auth', '$q', function (Auth, $q) {
                                return Auth.isLogged() || $q.reject({
                                        unAuthorized: true
                                    });
                            }]
                        }
                    })


                    .state('app.profile.listings_list', {
                        url: '/listings',
                        templateUrl: 'site/src/views/app/listings/index.html',
                        controller: 'ListingsListCtr',
                        resolve: {
                            security: ['Auth', '$q', function (Auth, $q) {
                                return Auth.isLogged() || $q.reject({
                                        unAuthorized: true
                                    });
                            }]
                        }
                    })
                    .state('app.profile.listing_type', {
                        url: '/listing-types',
                        templateUrl: 'site/src/views/app/listing_type/index.html',
                        controller: 'ListingTypesListCtr',
                        resolve: {
                            security: ['Auth', '$q', function (Auth, $q) {
                                return Auth.isLogged() || $q.reject({
                                    unAuthorized: true
                                });
                            }]
                        }
                    })
                    .state('app.profile.listing_segment', {
                        url: '/segments',
                        templateUrl: 'site/src/views/app/listing_segments/index.html',
                        controller: 'ListingSegmentListCtr',
                        resolve: {
                            security: ['Auth', '$q', function (Auth, $q) {
                                return Auth.isLogged() || $q.reject({
                                    unAuthorized: true
                                });
                            }]
                        }
                    })
                    .state('app.profile.segment_insert', {
                        url: '/segments/new',
                        templateUrl: 'site/src/views/app/listing_segments/insert.html',
                        controller: 'SegmentInsertCtr',
                        resolve: {
                            security: ['Auth', '$q', function (Auth, $q) {
                                return Auth.isLogged() || $q.reject({
                                    unAuthorized: true
                                });
                            }]
                        }
                    })


                    .state('app.profile.stop_sales', {
                        url: '/stop_sales',
                        templateUrl: 'site/src/views/app/listings/stop_sales.html',
                        controller: 'ListingsStopSalesCtr',
                        resolve: {
                            security: ['Auth', '$q', function (Auth, $q) {
                                return Auth.isLogged() || $q.reject({
                                        unAuthorized: true
                                    });
                            }]
                        }
                    })

                     .state('app.profile.period', {
                        url: '/period/index',
                        templateUrl: 'site/src/views/app/period/index.html',
                        controller: 'PeriodsListCtr',
                        resolve: {
                            security: ['Auth', '$q', function (Auth, $q) {
                                return Auth.isLogged() || $q.reject({
                                        unAuthorized: true
                                    });
                            }]
                        }
                    })

                    .state('app.profile.listings_insert', {
                        url: '/listings/insert',
                        templateUrl: 'site/src/views/app/listings/insert.html',
                        controller: 'ListingsInsertCtr',
                        resolve: {
                            security: ['Auth', '$q', function (Auth, $q) {
                                return Auth.isLogged() || $q.reject({
                                        unAuthorized: true
                                    });
                            }]
                        }
                    })

                    .state('app.profile.listings_update', {
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
                    })

                    .state('app.profile.listings_reserves', {
                        url: '/listings/reserves',
                        templateUrl: 'site/src/views/app/listings/reserve/index.html',
                        controller: 'ListingsReservesCtr',
                        resolve: {
                            security: ['Auth', '$q', function (Auth, $q) {
                                return Auth.isLogged() || $q.reject({
                                        unAuthorized: true
                                    });
                            }]
                        }
                    })

                    .state('app.listings_details', {
                        url: '/listings/details/:id?:review',
                        templateUrl: 'site/src/views/app/listings/details.html',
                        controller: 'ListingsDetailsCtr',
                        resolve: {}
                    })

                    .state('app.contact_us', {
                        url: '/contact_us',
                        templateUrl: 'site/src/views/app/pages/contact_us.html',
                        controller: 'ContactUsCtr',
                        resolve: {}
                    })

                    .state('app.listings_confirmed', {
                        url: '/listings/confirmed',
                        templateUrl: 'site/src/views/app/listings/reserve/confirmed.html',
                    })
                    //yeiniel
                    .state('app.listings_confirmedpre', {
                        url: '/listings/confirmedpre',
                        templateUrl: 'site/src/views/app/listings/reserve/confirmedpre.html',
                    })
                    .state('app.listings_cancelled', {
                        url: '/listings/cancelled',
                        templateUrl: 'site/src/views/app/listings/reserve/cancelled.html',
                    })
                    .state('app.listings_search', {
                        url: '/listings/search',
                        params: {
                            country_code: '',
                            city: '',
                            listing_type_id: '',
                            start_date: '',
                            end_date: '',
                            capacity: ''
                        },
                        templateUrl: 'site/src/views/app/listings/search.html',
                        controller: 'ListingsSearchCtr',
                        resolve: {}
                    })

                    .state('app.legal_notice', {
                        url: '/legal-notice',
                        templateUrl: 'site/src/views/app/pages/legal_notice.html',
                        controller: 'LegalNoticeCtr',
                        resolve: {}
                    })
                    //Yeiniel
                    .state('app.dashboard.listings_insert', {
                        url: '/listings/insert',
                        templateUrl: 'site/src/views/app/listings/insert.html',
                        controller: 'ListingsInsertCtr',
                        resolve: {}
                    });


                $locationProvider.html5Mode(true);


                function load(srcs, callback) {

                    return {
                        deps: ['$ocLazyLoad', '$q',
                            function ($ocLazyLoad, $q) {
                                var deferred = $q.defer();
                                var promise = false;
                                srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                                if (!promise) {
                                    promise = deferred.promise;
                                }
                                angular.forEach(srcs, function (src) {
                                    promise = promise.then(function () {
                                        if (JQ_CONFIG[src]) {
                                            return $ocLazyLoad.load(JQ_CONFIG[src]);
                                        }
                                        angular.forEach(MODULE_CONFIG, function (module) {
                                            if (module.name == src) {
                                                name = module.name;
                                            } else {
                                                name = src;
                                            }
                                        });
                                        return $ocLazyLoad.load(name);
                                    });
                                });
                                deferred.resolve();
                                return callback ? promise.then(function () {
                                    return callback();
                                }) : promise;
                            }
                        ]
                    }
                }


            }
        ]
    );
