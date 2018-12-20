'use strict';

app.controller('SignupHotelCtr', ['$scope', 'Content', 'Auth', '$state', '$uibModal', function ($scope, Content, Auth, $state, $uibModal) {

    Content.get('signup_hotel').success(function (r) {
        $scope.content = r.data;
    });
    $scope.logged = false;
    if (Auth.isLogged()) {
        $scope.logged = true;
        $scope.currentUser = Auth.get();
    }
    $scope.showRegister = function () {
        if (Auth.isLogged()) {
            $scope.logged = true;
            $scope.currentUser = Auth.get();
        }
        if (!$scope.logged) {
            var modalInstance = $uibModal.open({
                windowTopClass: 'top-20',
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'site/src/views/app/access/register.html',
                size: 'sm',
                controller: function ($scope, $uibModalInstance) {
                    $scope.data = {
                        role: 'owner'
                    };
                    $scope.close = function () {
                        $uibModalInstance.dismiss();
                    };
                    $scope.register = function () {
                        Auth.register($scope.data).success(function (r) {
                            r.complete && $uibModalInstance.close();
                            $state.go('app.profile.hotel', {id: $scope.data.id});
                        });
                    };
                }
            });
        }
        else {
            if ($scope.currentUser.role === "owner" || $scope.currentUser.role === "owner_unverificated" ) {
                $state.go('app.profile.hotel', {id: $scope.currentUser.id});
            }
            else {
                var changeInstance = $uibModal.open({
                    windowTopClass: 'top-20',
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'site/src/views/app/access/registerPlace.html',
                    size: 'sm',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.data = Auth.get();
                        $scope.data.role = 'owner';
                        $scope.close = function () {
                            $uibModalInstance.dismiss();
                        };
                        $scope.register = function () {
                            Auth.updateProfile($scope.data).success(function (r) {
                                r.complete && $uibModalInstance.close();
                                $state.go('app.profile.hotel', {id: $scope.data.id});
                            });
                        };
                    }
                });
            }
        }
    };
}]);
