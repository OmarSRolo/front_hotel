'use strict';

app.controller('ServicesCtr', ['$scope', '$state', 'Auth', '$translate', 'NgTableParams', 'Service', '$q', 'popQuestion','$uibModal', function($scope, $state, Auth, $translate, NgTableParams, Service, $q, popQuestion,$uibModal) {


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

            Service.query(params.page(), params.count(), {
                name_es: params.filter().name_es,
                name_en: params.filter().name_en,
                name_fr: params.filter().name_fr
            }).success(function(r) {
                params.total(r.data.total);
                defer.resolve(r.data.results);
            });
            return defer.promise;
        }
    });


    $scope.edit = function(service) {
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'site/src/views/app/services/update.html',
            size: 'md',
            controller: function($scope, $uibModalInstance) {
                $scope.data = angular.copy(service);

                $scope.close = function() {
                    $uibModalInstance.dismiss();
                };
                $scope.save = function() {
                    Service.update($scope.data).success(function(r) {
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
            templateUrl: 'site/src/views/app/services/insert.html',
            size: 'md',
            controller: function($scope, $uibModalInstance) {
                $scope.data = {};

                $scope.close = function() {
                    $uibModalInstance.dismiss();
                };
                $scope.save = function() {
                    Service.insert($scope.data).then(function(r) {
                        if (r.complete) $uibModalInstance.close();
                    });
                };
            }
        });

        modalInstance.result.then(function() {
              $scope.tableParams.reload();
        });

    };

    $scope.delete = function(s) {
        var defer = $q.defer();
        popQuestion.show($translate.instant('service.delete.header'), $translate.instant('service.delete.confirmation')).then(function() {
            Service.delete(s.id).success(function(r) {
                if (r.complete) {
                    $scope.tableParams.reload();
                }
            });
        });
    };

}]);
