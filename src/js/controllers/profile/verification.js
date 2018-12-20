'use strict';

app.controller('ProfileVerificationCtr', ['$scope', '$state', 'Auth', 'User', 'Country', '$translate', 'toaster', '$timeout', 'Upload', function($scope, $state, Auth, User, Country, $translate, toaster, $timeout, Upload) {


    User.get($state.params.id).success(function(r) {
        $scope.data = r.data;
    });

    $scope.save = function() {
        if ($scope.data.country) $scope.data.country_code = $scope.data.country.code;
        Auth.updateProfile($scope.data).success(function(r) {

        })
    };

    $scope.infoUpload = {};
    $scope.uploadFiles = function(file, invalidFiles) {
        if (invalidFiles.length != 0) {
            toaster.pop('error', $translate.instant("message.action_error"), $translate.instant("message.validation." + invalidFiles[0].$error) + '(' + invalidFiles[0].$errorParam + ')');
            return;
        }
        var d = angular.copy($scope.data);
        d.img_dni = file;
        d.role = null;
        d.verification_id_status = 'waiting';
        Auth.uploadProfileImg(d).then(function(r) {
            if (r.complete) {
                $scope.data.verification_id_status = 'waiting';
            }
        });
    }

}]);
