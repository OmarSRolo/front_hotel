'use strict';

app.controller('ListingsInsertCtr', ['$scope', 'toaster', '$state', 'Auth', '$translate', 'ListingType', 'Country', 'Listing', 'store', '$uibModal', 'Coin', 'Service', 'ListingCategory', '$timeout', function ($scope, toaster, $state, Auth, $translate, ListingType, Country, Listing, store, $uibModal, Coin, Service, ListingCategory, $timeout) {


    $scope.data = {
        owner_id: Auth.get().id, //changed
        country_code: Auth.get().country_code,
        city: Auth.get().city,
        latitude: Auth.get().latitude,
        longitude: Auth.get().longitude,
        images: [],
        services: [],
        prices: [],
        price_day: '',
        price_week: '',
        price_month: ''
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

                Listing.insert($scope.data).then(function (r) {
                    if (r.complete) {
                        if (r.complete) {
                            $state.go('app.profile.listings_list');
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