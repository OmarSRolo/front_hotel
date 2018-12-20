'use strict';

app.controller('HowWorkCtr', ['$scope', 'Content', function($scope, Content) {

    Content.get('how').success(function(r) {
        $scope.content = r.data;
    })

}]);
