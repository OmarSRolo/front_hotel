'use strict';

app.controller('FaqsCtr', ['$scope','$rootScope', 'Faq','$uibModal','popQuestion','$q','$translate', function($scope, $rootScope,Faq,$uibModal,popQuestion,$q,$translate) {
    $scope.q = '';
    $scope.loadFaqs = function () {
      Faq.query(0, 0).success(function(r) {
          $scope.faqs = r.data.results;
      });
    };
    $scope.loadFaqs();


    $scope.edit = function(type) {
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'site/src/views/app/faqs/update.html',
            size: 'md',
            controller: function($scope, $uibModalInstance) {
                $scope.data = angular.copy(type);

                $scope.close = function() {
                    $uibModalInstance.dismiss();
                };
                $scope.save = function() {
                    Faq.update($scope.data).success(function(r) {
                        if (r.complete) $uibModalInstance.close();
                    });
                };
            }
        });

        modalInstance.result.then(function() {
            $scope.loadFaqs();
        });
    };

    $scope.insert = function(type) {

        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'site/src/views/app/faqs/insert.html',
            size: 'md',
            controller: function($scope, $uibModalInstance) {
                $scope.data = {};

                $scope.close = function() {
                    $uibModalInstance.dismiss();
                };
                $scope.save = function() {
                    Faq.insert($scope.data).success(function(r) {
                        if (r.complete) $uibModalInstance.close();
                    });
                };
            }
        });

        modalInstance.result.then(function() {
            $scope.loadFaqs();
        });

    };

    $scope.delete = function(f) {
        var defer = $q.defer();
        popQuestion.show($translate.instant('faq.delete.header'), $translate.instant('faq.delete.confirmation')).then(function() {
            Faq.delete(f.id).success(function(r) {
                if (r.complete) {
                    $scope.loadFaqs();
                }

            });
        });
    };

    $rootScope.tinymceOptions.height = 100;
    // $rootScope.tinymceOptions = {
    //     menubar: "edit format tools format view insert",
    //     plugins: 'link image code',
    //     toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code|sizeselect | bold italic | fontselect |  fontsizeselect',
    //     fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
    //     height: 100,
    //     language:'es'
    // };

}]);
