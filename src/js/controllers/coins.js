'use strict';

app.controller('CoinsCtr', ['$scope', '$state', 'Auth', '$translate', 'NgTableParams', 'Coin', '$q', 'popQuestion','$uibModal', function($scope, $state, Auth, $translate, NgTableParams, Coin, $q, popQuestion,$uibModal) {


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

            Coin.query(params.page(), params.count(), {
                code: params.filter().code,
                name: params.filter().name
            }).success(function(r) {
                params.total(r.data.total);
                defer.resolve(r.data.results);
            });
            return defer.promise;
        }
    });


    $scope.update = function(coin) {
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'site/src/views/app/coins/update.html',
            size: 'sm',
            controller: function($scope, $uibModalInstance) {
                $scope.data = angular.copy(coin);

                $scope.close = function() {
                    $uibModalInstance.dismiss();
                };
                $scope.save = function() {
                    Coin.update($scope.data).success(function(r) {
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
            templateUrl: 'site/src/views/app/coins/insert.html',
            size: 'sm',
            controller: function($scope, $uibModalInstance) {
                $scope.data = {};

                $scope.close = function() {
                    $uibModalInstance.dismiss();
                };
                $scope.save = function() {
                    Coin.insert($scope.data).then(function(r) {
                        if (r.complete) $uibModalInstance.close();
                    });
                };
            }
        });

        modalInstance.result.then(function() {
              $scope.tableParams.reload();
        });

    };

    $scope.delete = function(c) {
        var defer = $q.defer();
        popQuestion.show($translate.instant('coin.delete.header'), $translate.instant('coin.delete.confirmation')).then(function() {
            Coin.delete(c.id).success(function(r) {
                if (r.complete) {
                    $scope.tableParams.reload();
                }
            });
        });
    };

}]);
