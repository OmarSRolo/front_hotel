'use strict';

app.controller('ListingSegmentListCtr', ['$scope', 'toaster', '$state', 'Auth', '$translate', 'NgTableParams', 'ListingSegment', '$q', 'popQuestion', '$uibModal', function ($scope, toaster, $state, Auth, $translate, NgTableParams, ListingSegment, $q, popQuestion, $uibModal) {


    $scope.tableParams = new NgTableParams({
        page: 1,
        count: 10,
    }, {
        counts: [10, 20, 40],
        paginationMaxBlocks: 9,
        count: 10,
        total: 0,
        getData: function (params) {
            var defer = $q.defer();


            ListingSegment.list(params.page(), params.count()).success(function (r) {
                params.total(r.data.total);
                defer.resolve(r.data.results);
            });
            return defer.promise;
        }
    });

    $scope.edit = function (lst) {
        $state.go('app.profile.segment_update', {
            id: lst.id
        });
    };
    $scope.insert = function (obj) {
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'site/src/views/app/listing_segments/insert.html',
            size: 'sm',
            controller: function ($scope, $uibModalInstance) {
                $scope.data = {
                    id: null,
                    name_es: '',
                    name_en: ''
                };
                if (obj === undefined || obj === null) {
                    $scope.data = {
                        name_es: '',
                        name_en: ''
                    };
                }
                else {
                    $scope.data = {
                        id: obj.id,
                        name_es: obj.name_es,
                        name_en: obj.name_en
                    };
                }

                $scope.close = function () {
                    $uibModalInstance.dismiss();
                };
                $scope.save = function () {
                    var d = angular.copy($scope.data);
                    if(d.id !== undefined && d.id !== null){
                        ListingSegment.update(d);
                    }
                    else{
                        ListingSegment.insert(d);
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
        popQuestion.show($translate.instant('access.profile.listing_segment.delete_header'), $translate.instant('access.profile.listing_segment.delete_question')).then(function () {
            ListingSegment.delete(l.id).then(function (r) {
                if (r.data.complete) {
                    $scope.tableParams.reload();
                }
            });
        });
    };

}]);
