'use strict';

app.controller('HomeCtr', ['$scope', '$rootScope', '$state', '$translate', '$timeout', 'Listing', 'ListingType', '$q', function ($scope, $rootScope, $state, $translate, $timeout, Listing, ListingType, $q) {

    $scope.search = {};
    $scope.search = function () {
        $state.go('app.listings_search', {
            country_code: $scope.search.country_code,
            city: $scope.search.city,
            listing_type_id: $scope.listingTypeId.id
        });
    };
    $scope.slides = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10
    ];
    $scope.listingTypeId = null;
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
    $scope.count = moment().add('second', 15).toString();
    console.log($scope.count);
    $scope.hideListing = function () {
        console.log('evento pinchando al quilo');
    };

    Listing.query(1, 8, {order_by: {field: 'relevant', direction: 'desc'}}).success(function (r) {
        $scope.mainListings = r.data.results;
    });
    ListingType.list().success(function (res) {
        $scope.listingTypes = res.data;
        console.log($scope.listingTypes);
    });


    $scope.animateElementIn = function ($el) {
        //console.log('in');
        $el.removeClass('not-visible');
        $el.addClass('animated fadeInUp');
    };

    $scope.animateElementOut = function ($el) {
        //console.log('out');
        $el.addClass('not-visible');
        $el.removeClass('animated fadeInUp');
    };

    if ($state.params.unAuthorized) {
        $timeout(function () {
            $scope.showLogin();
        }, 2);

    }

}]);
