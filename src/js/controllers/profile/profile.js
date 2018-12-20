'use strict';

app.controller('ProfileCtr', ['$scope', '$state', 'Auth', 'User', function ($scope, $state, Auth, User) {
    User.get($state.params.id).success(function (r) {
        $scope.data = r.data;
    })
}]);