'use strict';

/* Controllers */

angular.module('app')

    .controller('AppCtrl', ['$scope', '$rootScope', '$translate', '$localStorage', '$window', 'Auth', '$q', 'Country', 'ListingType', 'Bank', '$timeout',
        function ($scope, $rootScope, $translate, $localStorage, $window, Auth, $q, Country, ListingType, Bank, $timeout) {
            // add 'ie' classes to html
            var isIE = !!navigator.userAgent.match(/MSIE/i);
            if (isIE) {
                angular.element($window.document.body).addClass('ie');
            }
            if (isSmartDevice($window)) {
                angular.element($window.document.body).addClass('smart')
            }
            // config
            $scope.app = {
                name: 'Escapadas Flash de fin de Semana - INSTABONO.COM',
                version: '0.1'

            };

            $scope.Auth = Auth;
            $rootScope.pageTitle = $scope.app.name;
            $rootScope.$translate = $translate;

            // save settings to local storage
            if (angular.isDefined($localStorage.settings)) {
                $scope.app.settings = $localStorage.settings;
            } else {
                $localStorage.settings = $scope.app.settings;
            }


            $rootScope.dateOptions = {
                today: moment().add(-1, 'day').format(),
                formatYear: 'yy',
                startingDay: 1,
                shortFormat: 'DD-MM-YYYY',
                largeFormat: 'DD-MM-YYYY HH:mm:ss',
                datepicker: 'dd-MMMM-yyyy',
                datepickerShort: 'dd-MM-yyyy',
                localeFormat: 'DD-MM-YYYY',
                parse: function (strDate) {
                    if (!strDate)
                        return "";
                    return moment(strDate, $rootScope.dateOptions.localeFormat).format("YYYY-MM-DD");
                },
                parseDate: function (strDate, localeFormat) {
                    var format = localeFormat ? $rootScope.dateOptions.localeFormat : 'YYYY-MM-DD';
                    return moment(strDate, format).toDate();
                },
                parseDateObject: function (d) {
                    return moment(d).format($rootScope.dateOptions.localeFormat);
                }
            };


            // angular translate
            $scope.lang = {
                isopen: false
            };

            $scope.selectLang = $translate.proposedLanguage();
            $scope.setLang = function (langKey, $event) {
                $scope.selectLang = langKey;
                $translate.use(langKey);
                $scope.lang.isopen = !$scope.lang.isopen;
                $timeout(function () {
                    window.location.reload();
                })

            };


            $scope.bodyHeigth = window.outerHeight - 400;

            /**Messages part**/
            $timeout(function () {
                Country.list().success(function (r) {
                    $rootScope.countries = r.data;
                })
            }, 1000);

            $scope.onChangeCountry = function (value, city) {
                value && Country.cities(value).success(function (r) {
                    $rootScope.cities = r.data;
                    $rootScope[city] = '';
                });
                if (!value) $rootScope.cities = [];
            };

            ListingType.list().success(function (r) {
                $rootScope.listing_types = r.data;
            });

            Bank.list().success(function (r) {
                $scope.banks = r.data;
            });


            $scope.animateIn = function ($el) {

                $el.removeClass('not-visible');
                $el.addClass('animated ' + $el.attr('animated-scroll'));
            };

            $scope.animateOut = function ($el) {
                //console.log('out');
                $el.addClass('not-visible');
                $el.removeClass('animated ' + $el.attr('animated-scroll'));
            };


            function isSmartDevice($window) {
                // Adapted from http://www.detectmobilebrowsers.com
                var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
                // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
            }

            angular.element('#loadPage').addClass('hidden');


        }
    ])

    .controller('TopCtrl', ['$scope', '$rootScope', '$state', '$uibModal', 'Auth', '$translate', '$http', '$q', 'ListingReserve', 'Coin', 'Bank', function ($scope, $rootScope, $state, $uibModal, Auth, $translate, $http, $q, ListingReserve, Coin, Bank) {
        $scope.search = {
            key: $state.params.key
        };

        $scope.goSearch = function () {
            $state.go("app.users", {
                key: $scope.search.key
            });
        };

        $rootScope.$on('event:social-sign-in-success', function (event, userDetails) {
            Auth.loginSocial(userDetails).success(function (r) {
                $rootScope.loginInstance && $rootScope.loginInstance.close();
            });
        });


        $rootScope.showLogin = function () {
            $rootScope.loginInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'site/src/views/app/access/login.html',
                size: 'sm',
                scope: $scope,
                controller: function ($scope, $uibModalInstance) {
                    $scope.close = function () {
                        $uibModalInstance.dismiss();
                    };
                    $scope.login = function () {
                        Auth.login($scope.data).success(function (r) {
                            r.complete && $uibModalInstance.close();
                        })
                    }
                }
            });

            return $rootScope.loginInstance;
        };

        $rootScope.showPassword = function () {
            var modalInstance = $uibModal.open({
                windowTopClass: 'top-80',
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'site/src/views/app/access/password.html',
                size: 'sm',
                controller: function ($scope, $uibModalInstance) {
                    $scope.close = function () {
                        $uibModalInstance.dismiss();
                    };
                    $scope.recover = function () {
                        Auth.recoverPassword($scope.data).success(function (r) {
                            r.complete && $uibModalInstance.close()
                        })
                    }
                }
            });
        };

        $scope.showRegister = function () {
            var modalInstance = $uibModal.open({
                windowTopClass: 'top-20',
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'site/src/views/app/access/register.html',
                size: 'sm',
                controller: function ($scope, $uibModalInstance) {
                    $scope.data = {
                        role: 'client'
                    };
                    $scope.close = function () {
                        $uibModalInstance.dismiss();
                    };
                    $scope.register = function () {
                        Auth.register($scope.data).success(function (r) {
                            r.complete && $uibModalInstance.close();
                        })
                    }
                }
            });

        };

        $rootScope.listingReserve = function (listing) {
            if (!Auth.isLogged()) {
                $rootScope.showLogin();
                return;
            }
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'site/src/views/app/listings/reserve/insert.html',
                size: 'md',
                controller: function ($scope, $uibModalInstance, ListingHelper) {

                    $scope.listing = angular.copy(listing);
                    $scope.listing.disabled_dates = [];
                    angular.forEach($scope.listing.stopped_sales_dates,function (sd) {
                        var s = $rootScope.dateOptions.parseDate(sd.start_date);
                        var e = $rootScope.dateOptions.parseDate(sd.end_date);

                        while ( s <= e ){
                            $scope.listing.disabled_dates.push(s);
                            s = moment(s).add(1,'days');
                        }
                    });


                    $scope.view = 1;

                    $scope.data = {
                        listing_id: listing.id,
                        period: '',
                        price_type: 'day',
                        count_persons: '',
                        start_date: $scope.dateOptions.parseDateObject(new Date),
                        end_date: $scope.dateOptions.parseDateObject(new Date),
                        agree_termns: false,
                        client_first_name: '',
                        client_last_name: '',
                        client_email: '',
                        client_city: '',
                        client_phone: '',
                        client_reason: 'leisure',
                        client_special_request: '',
                        account_number: '',
                        account_month_expire: '',
                        account_year_expire: ''
                    };
                    $scope.years = [];
                    for (var i = (new Date()).getFullYear(); i < (new Date()).getFullYear() + 10; i++) {
                        $scope.years.push(i);
                    }
                    $scope.months = [];
                    for (var i = 1; i <= 12; i++) {
                        $scope.months.push({
                            code: i,
                            text: '01 - ' + $translate.instant('common.date.calendar.months.' + i)
                        });
                    }

                    $scope.huespeds = ListingHelper.getHuespeds(5);
                    $scope.periods = [];
                    $scope.$watch('data.price_type', function (c) {
                        $scope.periods = ListingHelper.getPeriods(c);
                        $scope.loadEndDate();
                    });
                    // Bank.list().success(function (r) {
                    //     $scope.banks = r.data;
                    // })

                    $scope.loadEndDate = function () {
                        $scope.data.end_date = $scope.dateOptions.parseDateObject(moment($scope.dateOptions.parseDate($scope.data.start_date, true)).add($scope.data.period, $scope.data.price_type + 's').toDate());
                    };

                    $scope.close = function () {
                        $uibModalInstance.dismiss();
                    };
                    $scope.makeAction = function () {
                        switch ($scope.view) {
                            case 1:
                                var d = angular.copy($scope.data);
                                d.start_date = $scope.dateOptions.parse($scope.data.start_date);
                                d.end_date = $scope.dateOptions.parse($scope.data.end_date);
                                ListingReserve.insert(d).then(function (r) {
                                    if (r.complete) {
                                        $scope.data.listing = r.data.listing;
                                        $scope.data.price = r.data.listing.price;
                                        $scope.data.id = r.data.id;
                                        $scope.view++;
                                    }
                                });
                                break;
                            case 2:
                                $scope.view++;
                                break;
                            case 3:
                                // $scope.data.status = 'confirmed';
                                $scope.data.status = 'created';
                                ListingReserve.update({
                                    id:$scope.data.id,
                                    status: 'created',  //status :'confirmed',
                                    client_first_name: $scope.data.client_first_name,
                                    client_last_name: $scope.data.client_last_name,
                                    client_email: $scope.data.client_email,
                                    client_city: $scope.data.client_city,
                                    client_phone: $scope.data.client_phone,
                                    client_reason: $scope.data.client_reason,
                                    client_special_request: $scope.data.client_special_request,
                                    account_number: $scope.data.account_number,
                                    account_month_expire: $scope.data.account_month_expire,
                                    account_year_expire:$scope.data.account_year_expire
                                }, 'listing_reserver.confirm_msg').then(function (r) {
                                    if (r.complete) {
                                        $scope.close();
                                        $state.go("app.listings_confirmedpre");  //$state.go("app.listings_confirmed");
                                    }
                                });
                                break;
                        }

                    }

                }
            });
        };

        $rootScope.openConversor = function () {
            var modalInstance = $uibModal.open({
                windowTopClass: 'top-20',
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'site/src/views/app/listings/coins.html',
                size: 'sm',
                controller: function ($scope, $uibModalInstance) {
                    Coin.list().success(function (r) {
                        $scope.coins = r.data;
                    });

                    $scope.data = {};
                    $scope.close = function () {
                        $uibModalInstance.dismiss();
                    };

                    $scope.calculate = function () {
                        Coin.calculate($scope.data.base, $scope.data.convert, $scope.data.amount).success(function (r) {
                            if (r.complete) {
                                $scope.result = r.data;
                            } else {
                                $scope.result = false;
                            }
                        })
                    }
                }
            });
        };
        //To verification

    }]);