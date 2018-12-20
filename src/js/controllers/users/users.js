'use strict';

app.controller('UsersCtr', ['$scope', '$rootScope', '$state', 'User', 'Auth', 'NgTableParams', 'FriendFunc', 'Country', function($scope, $rootScope, $state, User, Auth, NgTableParams, FriendFunc, Country) {

    Country.list().success(function(r) {
        $scope.countries = r.data;
    });

    $scope.$watch(function () {
      return $scope.tableUsers.filter()['country'];
    }, function(val) {
        Country.cities($scope.tableUsers.filter()['country']).success(function(r) {
            $scope.cities = r.data;
        })
    });



    $scope.tableUsers = new NgTableParams({
        page: 1,
        count: 12,
        sorting: {
            name: 'asc'
        },
        filter: {
            key: $state.params.key,
            country: Auth.get().country_id,
            city: Auth.get().city_id
        },
    }, {
        counts: [12],
        paginationMaxBlocks: 9,
        count: 12,
        total: 0,
        getData: function($defer, params) {
            User.filter(params.page(), params.count(), {
                key: params.filter().key != null ? params.filter().key : '',
                country: params.filter().country != null ? params.filter().country : '',
                city: params.filter().city != null ? params.filter().city : '',
            }).success(function(r) {
                params.total(r.data.total);
                $defer.resolve(r.data.data);
            })
        }
    });
}]);
