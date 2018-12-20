'use strict';

app.controller('ListingsDetailsCtr', ['$scope', 'toaster', '$state', 'Auth', '$translate', 'ListingType', 'Country', 'Listing', 'store', '$uibModal', 'Coin', 'Service', '$q', 'ListingReview', 'NgTableParams', 'ListingComment', 'Socialshare', 'NgMap', '$timeout', function($scope, toaster, $state, Auth, $translate, ListingType, Country, Listing, store, $uibModal, Coin, Service, $q, ListingReview, NgTableParams, ListingComment, Socialshare, NgMap, $timeout) {

    $scope.data = {
        map: {
            center: {
                latitude: 0,
                longitude: 0
            },
            zoom: 0
        }
    };

    Listing.get($state.params.id).success(function(r) {
        $scope.data = r.data;
        $scope.data.map = {
            center: {
                latitude: $scope.data.latitude,
                longitude: $scope.data.longitude
            },
            zoom: 8
        };

        $scope.prettyData();
    });
    Service.list().success(function(r) {
        $scope.services = r.data;
    });

    $scope.prettyData = function() {
        var s = angular.copy($scope.data.services);
        $scope.data.services = [];
        angular.forEach(s, function(y) {
            $scope.data.services[y.id] = true;
        })
    };


    $scope.tableReview = new NgTableParams({
        page: 1,
        count: 10,
    }, {
        counts: [10, 20, 40],
        paginationMaxBlocks: 9,
        count: 10,
        total: 0,
        getData: function(params) {
            var defer = $q.defer();
            ListingReview.query(params.page(), params.count(), {
                listing_id: $state.params.id,
            }).success(function(r) {
                params.total(r.data.total);
                defer.resolve(r.data.results);
            });
            return defer.promise;
        }
    });


    $scope.insertReview = function() {
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'site/src/views/app/listings/reviews/insert.html',
            size: 'sm',
            controller: function($scope, $uibModalInstance) {
                $scope.data = {
                    listing_id: $state.params.id,
                    rating: '1',
                    comment: ''
                };
                $scope.close = function() {
                    $uibModalInstance.dismiss();
                };
                $scope.save = function() {
                    ListingReview.insert($scope.data).then(function(r) {
                        r.complete && $uibModalInstance.close();
                    })
                }
            }
        });

        modalInstance.result.then(function() {

            window.location = 'http://atuhotel.com/listings/details/' + $state.params.id;
        })
    };
    
    if ($state.params.review == 'true') {
        $scope.insertReview();
    }

    // $scope.insertReview();

    $scope.tableComments = new NgTableParams({
        page: 1,
        count: 10,
    }, {
        counts: [10, 20, 40],
        paginationMaxBlocks: 9,
        count: 10,
        total: 0,
        getData: function(params) {
            var defer = $q.defer();
            ListingComment.query(params.page(), params.count(), {
                listing_id: $state.params.id,
            }).success(function(r) {
                params.total(r.data.total);
                defer.resolve(r.data.results);
            });
            return defer.promise;
        }
    });
    $scope.newComment = {
        comment: '',
        listing_id: $state.params.id
    };
    $scope.insertComment = function() {
        if (!Auth.isLogged()) {
            $scope.showLogin().result.then(function() {
                ListingComment.insert($scope.newComment).then(function(r) {
                    $scope.newComment.comment = '';
                    // console.log($scope.tableComments);
                    if ($scope.tableComments.page() <= $scope.tableComments.total() / $scope.tableComments.count()) $scope.tableComments.page(parseInt($scope.tableComments.total() / $scope.tableComments.count()) + 1);
                    $scope.tableComments.reload();
                })
            });
            return;
        }
        ListingComment.insert($scope.newComment).then(function(r) {
            $scope.newComment.comment = '';
            // console.log($scope.tableComments);
            if ($scope.tableComments.page() <= $scope.tableComments.total() / $scope.tableComments.count()) $scope.tableComments.page(parseInt($scope.tableComments.total() / $scope.tableComments.count()) + 1);
            $scope.tableComments.reload();
        })
    };

    $scope.renderMap = function() {
        NgMap.getMap().then(function(map) {
            $timeout(function() {
                google.maps.event.trigger(map, 'resize');
                map.setCenter(new google.maps.LatLng($scope.data.latitude, $scope.data.longitude));
            }, 100);
        });
    }


}]);
