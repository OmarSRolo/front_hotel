'use strict';

app.controller('UsersCtr', ['$scope', '$rootScope', '$state', 'Auth', 'NgTableParams', 'Country', 'User', '$q', '$uibModal', 'popQuestion', '$translate', 'message', function($scope, $rootScope, $state, Auth, NgTableParams, Country, User, $q, $uibModal, popQuestion, $translate, message) {


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

            User.query(params.page(), params.count(), {
                email: params.filter().email,
                name: params.filter().name,
                country_code: params.filter().country_code,
                role: params.filter().role,
                verification_id_status: params.filter().verification_id_status
            }).success(function(r) {
                params.total(r.data.total);
                defer.resolve(r.data.results);
            });
            return defer.promise;
        }
    });

    $scope.edit = function(user) {
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'site/src/views/app/users/update.html',
            size: '',
            controller: function($scope, $uibModalInstance) {
                $scope.data = angular.copy(user);

                $scope.close = function() {
                    $uibModalInstance.dismiss();
                };
                $scope.save = function() {
                    User.update($scope.data).then(function(r) {
                        if (r.complete) $uibModalInstance.close();
                    });
                };
            }
        });

        modalInstance.result.then(function() {
            $scope.tableParams.reload();
        });
    };

    $scope.password = function(user) {
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'site/src/views/app/users/password.html',
            size: 'sm',
            controller: function($scope, $uibModalInstance) {
                $scope.data = angular.copy(user);

                $scope.close = function() {
                    $uibModalInstance.dismiss();
                };
                $scope.save = function() {
                    if ($scope.data.password != $scope.data.confirm_password) {
                        message.error($translate.instant('user.password.password_match_error'));
                        return false;
                    }
                    User.update($scope.data, $translate.instant('user.password.message_success')).then(function(r) {
                        if (r.complete) $uibModalInstance.close();
                    });
                };
            }
        });
    };

    $scope.verification = function(user) {
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'site/src/views/app/users/verification.html',
            size: '',
            controller: function($scope, $uibModalInstance) {
                $scope.data = angular.copy(user);

                $scope.close = function() {
                    $uibModalInstance.dismiss();
                };
                $scope.save = function() {
                    User.update($scope.data, $translate.instant('user.verification.message_success')).then(function(r) {
                        if (r.complete) $uibModalInstance.close();
                    });
                };
            }
        });

        modalInstance.result.then(function() {
            $scope.tableParams.reload();
        });
    };


    $scope.details = function(user) {
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'site/src/views/app/users/details.html',
            size: 'lg',
            controller: function($scope, $uibModalInstance) {
                $scope.data = angular.copy(user);

                $scope.close = function() {
                    $uibModalInstance.dismiss();
                };
            }
        });

        modalInstance.result.then(function() {
            $scope.tableParams.reload();
        });
    };

    $scope.stopSales = function (data) {
        popQuestion.show($translate.instant('user.stop_sales.header'), $translate.instant('user.stop_sales.confirmation')).then(function () {
            Auth.stopSales(data).success(function (r) {
                if (r.complete) {
                    $scope.tableParams.reload();
                }
            })
        });
    }

    $scope.playSales = function (data) {
        popQuestion.show($translate.instant('user.play_sales.header'), $translate.instant('user.play_sales.confirmation')).then(function () {
            Auth.playSales(data).success(function (r) {
                if (r.complete) {
                    $scope.tableParams.reload();
                }
            })
        });
    }

    $scope.delete = function(user) {
        var defer = $q.defer();
        popQuestion.show($translate.instant('user.delete.header'), $translate.instant('user.delete.confirmation')).then(function() {
            User.delete(user.id).success(function(r) {
                if (r.complete) {
                    $scope.tableParams.reload();
                }

            });
        });
    };


}]);
