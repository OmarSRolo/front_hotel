'use strict';

app.controller('DireccionCtr', ['$scope', 'Content', function($scope, Content) {

    Content.get('direccion').success(function(r) {
        $scope.content = r.data;
    })

}]);
