'use strict';

app.controller('DifferentCtr', ['$scope', 'Content', function($scope, Content) {

    Content.get('why_is_diferent').success(function(r) {
        $scope.content = r.data;
    })

}]);
