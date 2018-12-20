'use strict';

app.controller('ContactUsCtr', ['$scope', 'Auth', '$state', function($scope, Auth, $state) {
    $scope.data = {
        role: Auth.get() ? Auth.get().role : 'client',
        email: Auth.get() ? Auth.get().email : '',
    };
    $scope.send = function() {
        Auth.contactUs($scope.data).success(function(r) {
            if (r.complete) {
                $state.go('app.home');
            }
        })
    };
}]);
