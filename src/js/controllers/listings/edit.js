'use strict';

app.controller('ListingsEditCtr', ['$scope', 'toaster', '$state', 'Auth', '$translate', 'ListingType', 'Country', 'Listing', 'store', '$uibModal', 'Coin', 'Service', function ($scope, toaster, $state, Auth, $translate, ListingType, Country, Listing, store, $uibModal, Coin, Service) {

    $scope.data = {};

    Listing.get($state.params.listing_id).success(function (r) {
        $scope.data = r.data;
        $scope.onChangeCountry(true);
        $scope.prettyData();
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

    $scope.prettyData = function () {
        var s = angular.copy($scope.data.services);
        $scope.data.services = [];
        angular.forEach(s, function (y) {
            $scope.data.services[y.id] = true;
        })
    };

    Service.list().success(function (r) {
        $scope.services = r.data;
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
                $scope.data.delete_images = true;
                Listing.update($scope.data).then(function (r) {
                    if (r.complete) {
                        $state.go('app.profile.listings_list');
                    }
                });
                return;
            }
            $scope.wizard.currentStep++;
            // $scope.wizard.percent += 33;

        },
        prev: function () {
            this.currentStep--;
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
    $scope.removeImage = function (i) {
        $scope.data.images.splice(i, 1);
    };
    $scope.changePrimary = function (image) {
        angular.forEach($scope.data.images, function (img) {
            img.is_primary = false;
        });
        image.is_primary = true;
    };

    $scope.loadMap = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'site/src/views/app/listings/map.html',
            size: 'md',
            scope: $scope,
            controller: function ($scope, $uibModalInstance, NgMap, $timeout) {
                NgMap.getMap().then(function (map) {
                    $timeout(function () {
                        google.maps.event.trigger(map, 'resize');
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