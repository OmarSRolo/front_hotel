'use strict';

app.controller('ProfileConfirmationCtr', ['$scope', '$state', 'Auth', '$timeout', '$translate', function($scope, $state, Auth, $timeout, $translate) {

    $scope.data = {
        verificated: false,
        ok: false,
        message: ''
    };
    $timeout(function() {

    }, 10);

    Auth.verificateOwnerTokenEmail($state.params.token).success(function(r) {
        $scope.data = {
            verificated: true,
            ok: r.complete,
            message: r.complete ? $translate.instant('access.profile.confirmation.msg_success') : r.message
        }
    })
}]);
