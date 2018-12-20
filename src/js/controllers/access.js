'use strict';

app.controller('LoginCtr', ['$scope', '$state', '$translate', 'Auth', function($scope, $state, $translate, Auth) {
    $scope.login = function() {
        Auth.login($scope.data).success(function(r) {
            if (r.complete) $state.go('app.dashboard.content', {
                key: 'about_us'
            });
        });
    };

}]);
