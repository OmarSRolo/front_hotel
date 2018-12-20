'use strict';

app.controller('HomeCtr', ['$scope', '$rootScope', '$state', '$translate', '$timeout', 'Listing', '$q', function($scope, $rootScope, $state, $translate, $timeout, Listing, $q) {

    $scope.search = {};
    $scope.search = function() {
        $state.go('app.listings_search', {
            country_code: $scope.search.country_code,
            city: $scope.search.city,
            start_date: $scope.search.start_date,
            end_date: $scope.search.end_date,
            capacity: $scope.search.capacity
        });
    };


    /*$scope.places = [{
        name: 'london',
        image: 'site/img/home/places/london.jpg',
        country: 'GB'
    }, {
        name: 'berlin',
        image: 'site/img/home/places/berlin.jpg',
        country: 'DE'
    }, {
        name: 'madrid',
        country: 'ES',
        image: 'site/img/home/places/madrid.jpg'
    }];*/

    $scope.places = [{
        name: 'alicante',
        image: 'site/img/home/places/alicante.jpg',
        country: 'ES'
    }, {
        name: 'barcelona',
        image: 'site/img/home/places/barcelona.jpg',
        country: 'ES'
    }, {
        name: 'madrid',
        country: 'ES',
        image: 'site/img/home/places/madrid.jpg'
    }];

    Listing.query(1, 8,{order_by:{field:'relevant',direction:'desc'}}).success(function(r) {
        $scope.mainListings = r.data.results;
    });


    $scope.animateElementIn = function($el) {
        //console.log('in');
        $el.removeClass('not-visible');
        $el.addClass('animated fadeInUp');
    };

    $scope.animateElementOut = function($el) {
        //console.log('out');
        $el.addClass('not-visible');
        $el.removeClass('animated fadeInUp');
    };

    if ($state.params.unAuthorized) {
        $timeout(function() {
            $scope.showLogin();
        }, 2);

    }

}]);
