'use strict';

app.controller('CookiesCtr', ['$scope', 'Content', function($scope, Content) {

    Content.get('cookies').success(function(r) {
        $scope.content = r.data;
    })

}]);
