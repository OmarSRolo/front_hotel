'use strict';

app.controller('ListingsInsertCtr', ['$scope', 'toaster', '$state', 'User', '$translate', 'ListingType', 'Country', 'Listing', 'store', '$uibModal', 'Coin', 'Service', 'ListingCategory', '$timeout', 'NgTableParams', '$q', function ($scope, toaster, $state, User, $translate, ListingType, Country, Listing, store, $uibModal, Coin, Service, ListingCategory, $timeout, NgTableParams, $q) {

    $scope.userTemp = {id:"", email:""};
    $scope.data = {
        owner_id: "", //changed
        country_code: "",
        city: "",
        latitude: "",
        longitude: "",
        images: [],
        services: [],
        prices: [],
        price_day: '',
        price_week: '',
        price_month: ''
    };

    $scope.tableParams = new NgTableParams({
        page: 1,
        count: 10,
    }, {
        counts: [10, 20, 40],
        paginationMaxBlocks: 9,
        count: 10,
        total: 0,
        getData: function(params) {
            var defer = $q.defer();

            User.query(params.page(), params.count(), {
                email: params.filter().email,
                name: params.filter().name,
                role: 'owner'
            }).success(function(r) {
                params.total(r.data.total);
                defer.resolve(r.data.results);
            });
            return defer.promise;
        }
    });

    $scope.select = function (user) {
        $scope.userTemp = user;
        $scope.data.owner_id = user.id;
        $scope.data.country_code = user.country_code;
        $scope.data.city = user.city;
        $scope.data.latitude = user.latitude;
        $scope.data.longitude = user.longitude;

        console.log($scope.data);
    };

    Service.list().success(function (r) {
        $scope.services = r.data;
    });

    $scope.onChangeCountry = function (nc) {
        var nc = nc || false;
        $scope.data.country_code && Country.cities($scope.data.country_code).success(function (r) {
            $scope.cities = r.data;
            if (!nc) {
                $scope.data.city = '';
            }
        })
    };


    var nc = true;
    $scope.$watch(function () {
        return $scope.data.country;
    }, function (val) {
        $scope.data.country && Country.cities($scope.data.country.code).success(function (r) {
            $scope.cities = r.data;
            if (!nc) {
                $scope.data.city = '';
            }
            nc = false;
        })
    });

    $scope.$watch(function () {
        return $scope.data.listing_type_id;
    }, function (val) {
        $scope.data.price = 0;
        angular.forEach($scope.listing_types, function (l) {
            if (l.id == val) {
                $scope.data.price = l.price;
            }
        });
    });

    $scope.$watch(function () {
        return $scope.data.listing_category_id;
    }, function (val) {
        if(!val) $scope.data.listing_type_id = '';
    });




    $scope.wizard = {
        currentStep: 1,
        disabled: {
            step1: false,
            step2: true,
            step3: true,
            step4: true
        },
        percent: 25,
        next: function () {
            if (this.currentStep == 1) {
                // if ($scope.data.price_month <= 0 && $scope.data.price_day <= 0 && $scope.data.price_week <= 0) {
                //     toaster.pop('error', $translate.instant("message.action_error"), $translate.instant("listing.price_empty"));
                //     return;
                // }
            }
            if (this.currentStep == 2) {
                var e = false;
                angular.forEach($scope.data.services, function (s) {
                    if (s) e = true;
                });
                if (!e) {
                    toaster.pop('error', $translate.instant("message.action_error"), $translate.instant("listing.services_empty"));
                    return;
                }

            }
            if (this.currentStep == 3) {
                // if ($scope.data.prices.length == 0) {
                //     toaster.pop('error', $translate.instant("message.action_error"), $translate.instant("listing.price_empty"));
                //     return;
                // }
               Listing.insertAdmin($scope.data).then(function (r) {
                    if (r.complete) {
                        if (r.complete) {
                            $state.go('app.dashboard.listing');
                        }
                    }
                });
                return;
            }
            $scope.wizard.currentStep++;
            // $scope.wizard.percent += 25;

        },
        prev: function () {
            this.currentStep--;
            // this.percent -= 25;
        }
    };

    $scope.selectNewImage = function (files, event, invalidFiles) {

        if (files.length != 0) {
            $scope.data.images.push({
                file: files[0],
                caption: '',
                is_primary: $scope.data.images.length == 0
            })

        } else if (invalidFiles.length != 0) {
            toaster.pop('error', $translate.instant("message.action_error"), $translate.instant("message.validation." + invalidFiles[0].$error) + '(' + invalidFiles[0].$errorParam + ')');
        }
    };
    $scope.changePrimary = function (image) {
        angular.forEach($scope.data.images, function (img) {
            img.is_primary = false;
        });
        image.is_primary = true;
    };
    $scope.removeImage = function (i) {

        $scope.data.images.splice(i, 1);
    };

   

    $scope.loadMap = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'site/src/views/app/listings/map.html',
            size: 'md',
            scope: $scope,
            controller: function ($scope, $uibModalInstance, NgMap) {
                NgMap.getMap().then(function (map) {
                    $timeout(function () {
                        google.maps.event.trigger(map, 'resize');
                        if ($scope.data.latitude != 0 && $scope.data.latitude != 0)
                            map.setCenter(new google.maps.LatLng($scope.data.latitude, $scope.data.longitude));
                    }, 100);
                });

                $scope.placeMarker = function (e) {
                    $scope.data.latitude = e.latLng.lat();
                    $scope.data.longitude = e.latLng.lng();
                };
                $scope.data.address = $scope.data.city;

                $scope.close = function () {
                    $uibModalInstance.dismiss();
                }
            }
        });
    }

}]);