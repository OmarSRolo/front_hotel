'use strict';

app.controller('ProfileHotelCtr', ['$scope', '$state', 'Auth', 'User', 'Country', '$translate', 'toaster', 'Upload', '$timeout', '$q', 'popQuestion', 'CancelPrevCost', 'CancelTotalCost', 'CancelTermn', function ($scope, $state, Auth, User, Country, $translate, toaster, Upload, $timeout, $q, popQuestion, CancelPrevCost, CancelTotalCost, CancelTermn) {

    CancelPrevCost.list().success(function (r) {
        $scope.cancel_prev_costs = r.data;
    });
    CancelTotalCost.list().success(function (r) {
        $scope.cancel_total_costs = r.data;
    });
    CancelTermn.list().success(function (r) {
        $scope.cancel_terms = r.data;
    });
    User.get($state.params.id).success(function (r) {
        $scope.data = r.data;
        console.log($scope.data);
        $scope.$watch(function () {
            return $scope.data.cancel_term_id;
        }, function (val) {
            angular.forEach($scope.cancel_terms, function (t) {
                if (t.id === val) {
                    $scope.cancel_term_selected = t.name;
                }
            });
        });
    });




    $scope.save = function () {
        if ($scope.data.password && $scope.data.password !== $scope.data.confirm_password) {
            toaster.pop('error', $translate.instant("message.action_error"), $translate.instant("access.profile.info.password_not_match"));
            return;
        }
        var d = angular.copy($scope.data);
        d.role = null;
        Auth.updateProfile(d);
    };

    $scope.resendConfirmation = function () {
        Auth.convetToOwner($scope.data).success(function (r) {

        })
    };
}]);