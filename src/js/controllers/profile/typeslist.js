'use strict';

app.controller('ListingTypesListCtr', ['$scope', 'toaster', '$state', 'Auth', '$translate', 'NgTableParams', 'ListingType', '$uibModal', '$q', 'popQuestion', function($scope, toaster, $state, Auth, $translate, NgTableParams, ListingType, $uibModal, $q, popQuestion) {


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


            ListingType.query(params.page(), params.count(), {}).success(function(r) {
                params.total(r.data.total);
                defer.resolve(r.data.results);
            });
            return defer.promise;
        }
    });
    $scope.insert = function (obj) {
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'site/src/views/app/listing_type/insert.html',
            size: 'sm',
            controller: function ($scope, $uibModalInstance) {
                $scope.data = {
                    id: null,
                    name_es: '',
                    name_en: '',
                    price: null
                };
                if (obj === undefined || obj === null) {
                    $scope.data = {
                        id: null,
                        name_es: '',
                        name_en: '',
                        price: null
                    };
                }
                else {
                    $scope.data = {
                        id: obj.id,
                        name_es: obj.name_es,
                        name_en: obj.name_en,
                        price: obj.price
                    };
                }

                $scope.close = function () {
                    $uibModalInstance.dismiss();
                };
                $scope.save = function () {
                    var d = angular.copy($scope.data);
                    if(d.id !== undefined && d.id !== null){
                        ListingType.update(d);
                    }
                    else{
                        ListingType.insert(d);
                    }
                    $uibModalInstance.dismiss();

                };
            }
        });

        modalInstance.closed.then(function () {
            $scope.tableParams.reload();
        });
    };
    $scope.delete = function (l) {
        var defer = $q.defer();
        popQuestion.show($translate.instant('access.profile.listing_type.delete_header'), $translate.instant('access.profile.listing_type.delete_question')).then(function () {
            ListingType.delete(l.id).then(function (r) {
                if (r.data.complete) {
                    $scope.tableParams.reload();
                }
            });
        });
    };
}]);
