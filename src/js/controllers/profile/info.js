'use strict';

app.controller('ProfileInfoCtr', ['$scope', '$state', 'Auth', 'User', 'Country', '$translate', 'toaster', 'Upload', '$timeout', '$q', 'popQuestion', 'CancelPrevCost', 'CancelTotalCost', 'CancelTermn', function ($scope, $state, Auth, User, Country, $translate, toaster, Upload, $timeout, $q, popQuestion, CancelPrevCost, CancelTotalCost, CancelTermn) {

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
                if (t.id == val) {
                    $scope.cancel_term_selected = t.name;
                }
            });
        })
    });




    $scope.save = function () {
        if ($scope.data.password && $scope.data.password != $scope.data.confirm_password) {
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

    $scope.convertToOwner = function () {
        Auth.convetToOwner($scope.data).success(function (r) {
            if (r.complete) {
                $scope.data.role = 'owner_unverificated';
            }
        })
    };


    $scope.uploadFiles = function (file, invalidFiles) {
        if (invalidFiles.length != 0) {
            toaster.pop('error', $translate.instant("message.action_error"), $translate.instant("message.validation." + invalidFiles[0].$error) + '(' + invalidFiles[0].$errorParam + ')');
            return;
        }
        var d = angular.copy($scope.data);
        d.img_profile = file;
        d.role = null;
        Auth.uploadProfileImg(d);
    };

    $scope.stopSales = function () {
        popQuestion.show($translate.instant('access.profile.stop_sales.header'), $translate.instant('access.profile.stop_sales.confirmation')).then(function () {
            Auth.stopSales($scope.data).success(function (r) {
                if (r.complete) {
                    $scope.data.stope_sales = 1;
                }
            })
        });
    };

    $scope.playSales = function () {
        popQuestion.show($translate.instant('access.profile.play_sales.header'), $translate.instant('access.profile.play_sales.confirmation')).then(function () {
            Auth.playSales($scope.data).success(function (r) {
                if (r.complete) {
                    $scope.data.stope_sales = 0;
                }
            })
        });
    };

    $scope.remove = function () {
        var defer = $q.defer();
        popQuestion.show($translate.instant('access.profile.delete.header'), $translate.instant('access.profile.delete.confirmation')).then(function () {
            User.delete(Auth.get().id).success(function (r) {
                if (r.complete) {
                    Auth.logout();
                    $state.go('app.home');
                }
            })
        });
    }
}]);