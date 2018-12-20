'use strict';

app.controller('ListingsSearchCtr', ['$scope', 'toaster', '$state', 'Auth', '$translate', 'ListingType', 'Country', 'Listing', 'store', '$uibModal', 'Coin', 'Service', '$q', 'ListingReview', 'NgTableParams', 'ListingComment', function($scope, toaster, $state, Auth, $translate, ListingType, Country, Listing, store, $uibModal, Coin, Service, $q, ListingReview, NgTableParams, ListingComment) {

    $scope.data = {};

    Service.list().success(function(r) {
        $scope.services = r.data;
    });

    Service.list().success(function(r) {
        $scope.services = r.data;
    });


    $scope.tableListings = new NgTableParams({
        page: 1,
        count: 9,
        filter: {
            listing_type_id: $state.params.listing_type_id,
            country_code: $state.params.country_code,
            city:$state.params.city,
            start_date: $state.params.start_date,
            end_date: $state.params.end_date,
            capacity:$state.params.capacity,
            hotel_name:''
        },
        sorting: {
            field: "price",
            direction: 'asc'
        }
    }, {
        counts: [9, 18, 27],
        paginationMaxBlocks: 9,
        count: 10,
        total: 0,
        getData: function (params) {
            var defer = $q.defer();
            Listing.query(params.page(), params.count(), {
                hotel_name:params.filter().hotel_name,
                listing_type_id: params.filter().listing_type_id,
                country_code: params.filter().country_code,
                city: params.filter().city,
                start_date: params.filter().start_date ? $scope.dateOptions.parse(params.filter().start_date):'',
                end_date: params.filter().end_date ? $scope.dateOptions.parse(params.filter().end_date): '',
                capacity: params.filter().capacity,
                services: params.filter().services,
                order_by: params.sorting()
            }).success(function(r) {
                params.total(r.data.total);
                defer.resolve(r.data.results);

            });
            return defer.promise;
        }
    });

    $scope.onChangeCountry = function(value) {
        if (!value) $scope.cities = [];
    }



}]);
