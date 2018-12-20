'use strict';

app.controller('SignupHotelCtr', ['$scope', 'Content', function($scope, Content) {

    Content.get('signup_hotel').success(function(r) {
        $scope.content = r.data;
    })

}]);
