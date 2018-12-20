'use strict';

app.controller('FaqsCtr', ['$scope', 'Faq', function($scope, Faq) {
    $scope.q = '';
    Faq.query(0, 0).success(function(r) {
        $scope.faqs = r.data.results;
    });

    $scope.search = function() {
        Faq.query(0, 0, {
            question: $scope.q,
            answer: $scope.q
        }).success(function(r) {
            $scope.faqs = r.data.results;
        })
    }

}]);
