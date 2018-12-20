'use strict';

app.controller('BankCtr', ['$scope','$rootScope', 'Bank','$uibModal','popQuestion','$q','$translate','NgTableParams', function($scope, $rootScope,Bank,$uibModal,popQuestion,$q,$translate,NgTableParams) {

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


            Bank.query(params.page(), params.count(), {

            }).success(function(r) {
                params.total(r.data.total);
                defer.resolve(r.data.results);
            });
            return defer.promise;
        }
    });

    $scope.edit = function(type) {
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'site/src/views/app/bank/update.html',
            size: 'sm',
            controller: function($scope, $uibModalInstance) {
                $scope.data = angular.copy(type);

                $scope.close = function() {
                    $uibModalInstance.dismiss();
                };
                $scope.save = function() {
                    Bank.update($scope.data).success(function(r) {
                        if (r.complete) $uibModalInstance.close();
                    });
                };
            }
        });

        modalInstance.result.then(function() {
            $scope.tableParams.reload();
        });
    };

    $scope.insert = function(type) {

        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'site/src/views/app/bank/insert.html',
            size: 'sm',
            controller: function($scope, $uibModalInstance) {
                $scope.data = {};

                $scope.close = function() {
                    $uibModalInstance.dismiss();
                };
                $scope.save = function() {
                    Bank.insert($scope.data).success(function(r) {
                        if (r.complete) $uibModalInstance.close();
                    });
                };
            }
        });

        modalInstance.result.then(function() {
            $scope.tableParams.reload();
        });

    };

    $scope.delete = function(l) {
        var defer = $q.defer();
        popQuestion.show($translate.instant('bank.delete.header'), $translate.instant('bank.delete.confirmation')).then(function() {
            Bank.delete(l.id).success(function(r) {
                if (r.complete) {
                    $scope.tableParams.reload();
                }

            });
        });
    };

}]);
