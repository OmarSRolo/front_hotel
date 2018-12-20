'use strict';

app.controller('ListingsListCtr', ['$scope', 'toaster', '$state', 'Auth', '$translate', 'NgTableParams', 'Listing', '$q', 'popQuestion', function($scope, toaster, $state, Auth, $translate, NgTableParams, Listing, $q, popQuestion) {


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


            Listing.query(params.page(), params.count(), {
                created_at: $scope.dateOptions.parse(params.filter().created_at),
                capacity: params.filter().capacity,
                country_code: params.filter().country_code,
                city: params.filter().city,
                listing_type_id: params.filter().listing_type_id,
                owner_id: Auth.get().id
            }).success(function(r) {
                params.total(r.data.total);
                defer.resolve(r.data.results);
            });
            return defer.promise;
        }
    });

    $scope.edit = function(lst) {
        $state.go('app.profile.listings_update', {
            id: Auth.get().id,
            listing_id: lst.id
        });
    };
    $scope.delete = function(l) {
        var defer = $q.defer();
        popQuestion.show($translate.instant('listing.delete.header'), $translate.instant('listing.delete.confirmation')).then(function() {
            Listing.delete(l.id).then(function(r) {
                if (r.complete) {
                    $scope.tableParams.reload();
                }

            })
        });
    }

}]);
