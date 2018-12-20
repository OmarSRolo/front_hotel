'use strict';

app.controller('LegalTermsCtr', ['$scope', 'Content', function($scope, Content) {

    Content.get('termns').success(function(r) {
        $scope.content = r.data;
    })
}]);
