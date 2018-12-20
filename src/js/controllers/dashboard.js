app.controller('ContenCtr', ['$scope', '$rootScope', '$state', '$translate', 'Content', function($scope, $rootScope, $state, $translate, Content) {

    if ($state.params.key != 'about_us' && $state.params.key != 'termns' && $state.params.key != 'signup_hotel' && $state.params.key != 'why_is_diferent' && $state.params.key != 'termns' && $state.params.key != 'cookies' && $state.params.key != 'privacity') {
        $state.go('app.dashboard', {
            key: 'about_us'
        });
    }

    $scope.action = 1; //1 Insert, 2 Update
    $scope.data = {};
    Content.get($state.params.key).success(function(r) {
        if (r.data != null) {
            $scope.data = r.data;
            $scope.action = 2;
        } else {
            $scope.data = {
                key: $state.params.key,
                content_es: '',
                content_en: '',
                content_fr: ''
            };
            $scope.action = 1;
        }

    });

    $scope.save = function() {
        if ($scope.action == 1) {
            Content.insert($scope.data);
        } else {
            Content.update($scope.data);
        }

    };

    $rootScope.tinymceOptions.height = 200;
}]);
