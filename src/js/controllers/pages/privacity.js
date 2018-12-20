'use strict';

app.controller('PrivacityCtr', ['$scope', 'Content', function($scope, Content) {

    Content.get('privacity').success(function(r) {
        $scope.content = r.data;
    })

}]);
