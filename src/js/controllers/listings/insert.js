'use strict';

app.controller('ListingsInsertCtr', ['$scope', 'toaster', '$state', 'Auth', '$translate', 'ListingType', 'Country', 'Listing', 'store', '$uibModal', 'Coin', 'Service', '$timeout', 'ListingSegment', function ($scope, toaster, $state, Auth, $translate, ListingType, Country, Listing, store, $uibModal, Coin, Service, $timeout, ListingSegment) {


    $scope.data = {
        owner_id: Auth.get().id, //changed
        country_code: Auth.get().country_code,
        city: Auth.get().city,
        latitude: Auth.get().latitude,
        longitude: Auth.get().longitude,
        images: [],
        expiration_date: null,
        validDates:'',
        services: [],
        end_day: '',
        begin_day:'',
        base_price: null,
        discount: null,
        nights: null,
        segmentos: [],
        type_id: null

    };
    $scope.week_days=[
        'domingo',
        'lunes',
        'martes',
        'miércoles',
        'jueves',
        'viernes',
        'sábado'
    ]
    $scope.dateOptions = {
        today: moment().format(),
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
            return moment(strDate, $scope.dateOptions.localeFormat).format("YYYY-MM-DD");
        },
        parseDate: function (strDate, localeFormat) {
            var format = localeFormat ? $scope.dateOptions.localeFormat : 'YYYY-MM-DD';
            return moment(strDate, format).toDate();
        },
        parseDateObject: function (d) {
            return moment(d).format($scope.dateOptions.localeFormat);
        }
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
        });
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

    // $scope.$watch(function () {
    //     return $scope.data.type_id;
    // }, function (val) {
    //     $scope.data.price = 0;
    //     angular.forEach($scope.listing_types, function (l) {
    //         if (l.id == val) {
    //             $scope.data.price = l.price;
    //         }
    //     });
    // });

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
    $scope.cambio = function () {
        console.log($scope.data);
    };

    $scope.selectNewImage = function (files, event, invalidFiles) {

        if (files.length != 0) {
            $scope.data.images.push({
                file: files[0],
                caption: '',
                is_primary: $scope.data.images.length == 0
            })

        } else if (invalidFiles.length !== 0) {
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
    };

    // var newSegmentoId = null;
    // $scope.insertSegmento = function () {
    //
    //     var modalInstance = $uibModal.open({
    //         ariaLabelledBy: 'modal-title',
    //         ariaDescribedBy: 'modal-body',
    //         templateUrl: 'site/src/views/app/listing_segments/insert.html',
    //         size: 'sm',
    //         controller: function ($scope, $uibModalInstance) {
    //             $scope.data = {
    //                 id: null,
    //                 name_es: '',
    //                 name_en: ''
    //             };
    //             console.log(newSegmentoId);
    //
    //
    //             $scope.close = function () {
    //                 $uibModalInstance.dismiss();
    //             };
    //             $scope.save = function () {
    //                 var d = angular.copy($scope.data);
    //                 ListingSegment.insert(d).success(function (res) {
    //                     newSegmentoId = res.complete;
    //                     $uibModalInstance.dismiss();
    //                 }).error(function () {
    //                     $uibModalInstance.dismiss();
    //                 });
    //
    //             };
    //         }
    //     });
    //     modalInstance.closed.then(function () {
    //         //$scope.tableParams.reload();
    //         if (newSegmentoId !== null) {
    //             ListingSegment.list().success(function (res) {
    //                 $scope.segmentos = res.data.results;
    //                 $scope.data.segmento_id = newSegmentoId;
    //                 newSegmentoId = null;
    //             });
    //         }
    //     });
    // };

    $scope.test = function () {
      console.log($scope.data.type_id);
    };
    var newTypeId = null;
    $scope.insertType = function () {

        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'site/src/views/app/listing_type/insert.html',
            size: 'sm',
            controller: function ($scope, $uibModalInstance) {
                $scope.data = {
                    id: null,
                    name_es: '',
                    name_en: ''
                };
                $scope.close = function () {
                    $uibModalInstance.dismiss();
                };
                $scope.save = function () {
                    var d = angular.copy($scope.data);
                    ListingType.insert(d).success(function (res) {
                        newTypeId = res.complete;
                        $uibModalInstance.dismiss();
                    }).error(function () {
                        $uibModalInstance.dismiss();
                    });
                };
            }
        });
        modalInstance.closed.then(function () {
            //$scope.tableParams.reload();
            if (newTypeId !== null) {
                ListingType.list().success(function (res) {
                    $scope.listing_types = res.data;
                    $scope.data.type_id = newTypeId.toString();
                    newTypeId = null;
                    console.log($scope.data.type_id);
                });
            }
        });
    };

}]);