'use strict';

app.controller('ProfileLocationCtr', ['$scope', '$state', 'Auth', 'User', 'Country', '$translate', 'toaster', '$timeout', function($scope, $state, Auth, User, Country, $translate, toaster, $timeout) {

    Country.list().success(function(r) {
        $scope.countries = r.data;
    });

    $scope.timezones = moment.tz.names();

    $scope.onChangeCountry = function(nc) {
        var nc = nc || false;
        $scope.data.country_code && Country.cities($scope.data.country_code).success(function(r) {
            $scope.cities = r.data;
            if (!nc) {
                $scope.data.city = '';
            }
        })
    };

    User.get($state.params.id).success(function(r) {
        $scope.data = r.data;
        $scope.onChangeCountry(true);
    });





    $scope.save = function() {
        var d = angular.copy($scope.data);
        d.role = null;
        Auth.updateProfile(d);
    };

}]);
