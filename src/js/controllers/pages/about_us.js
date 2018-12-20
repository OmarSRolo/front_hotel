'use strict';

app.controller('AboutUsCtr', ['$scope', 'Content', function($scope, Content) {

    Content.get('about_us').success(function(r) {
        $scope.content = r.data;
    })

}]);
