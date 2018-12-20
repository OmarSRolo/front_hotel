'use strict';

app.controller('PiedeimprentaCtr', ['$scope', 'Content', function($scope, Content) {

    Content.get('piedeimprenta').success(function(r) {
        $scope.content = r.data;
    })

}]);
