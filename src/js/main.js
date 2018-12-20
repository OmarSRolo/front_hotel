'use strict';

/* Controllers */

angular.module('app')

.controller('AppCtrl', ['$scope', '$rootScope', '$translate', '$localStorage', '$window', 'Auth', '$q', 'Country', 'ListingType','ListingCategory',
    function($scope, $rootScope, $translate, $localStorage, $window, Auth, $q, Country, ListingType,ListingCategory) {
        // add 'ie' classes to html
        var isIE = !!navigator.userAgent.match(/MSIE/i);
        if (isIE) {
            angular.element($window.document.body).addClass('ie');
        }
        if (isSmartDevice($window)) {
            angular.element($window.document.body).addClass('smart')
        };

        // config
        $scope.app = {
            name: 'Atuhotel Dashborad Admin',
            version: '0.1'

        }

        $scope.Auth = Auth;
        $rootScope.pageTitle = $scope.app.name;
        $rootScope.$translate = $translate;

        // save settings to local storage
        if (angular.isDefined($localStorage.settings)) {
            $scope.app.settings = $localStorage.settings;
        } else {
            $localStorage.settings = $scope.app.settings;
        }


        $rootScope.dateOptions = {
            today: moment().add(-1, 'day').format(),
            formatYear: 'yy',
            startingDay: 1,
            shortFormat: 'DD-MM-YYYY',
            largeFormat: 'DD-MM-YYYY HH:mm:ss',
            datepicker: 'dd-MMMM-yyyy',
            datepickerShort: 'dd-MM-yyyy',
            localeFormat: 'DD-MM-YYYY',
            parse: function(strDate) {
                return moment(strDate, $rootScope.dateOptions.localeFormat).format("YYYY-MM-DD");
            },
            parseDate: function(strDate, localeFormat) {
                var format = localeFormat ? $rootScope.dateOptions.localeFormat : 'YYYY-MM-DD';
                return moment(strDate, format).toDate();
            },
            parseDateObject: function(d) {
                return moment(d).format($rootScope.dateOptions.localeFormat);
            }
        };


        // angular translate
        $scope.lang = {
            isopen: false
        };
        $scope.selectLang = $translate.proposedLanguage();
        $scope.setLang = function(langKey, $event) {
            $scope.selectLang = langKey;
            $translate.use(langKey);
            $scope.lang.isopen = !$scope.lang.isopen;
            window.location.reload();
        };


        $scope.bodyHeigth = window.outerHeight - 400;

        /**Messages part**/

        Country.list().success(function(r) {
            $rootScope.countries = r.data;
        });
        $rootScope.onChangeCountry = function(value, city) {
            if (value) {
                Country.cities(value).success(function(r) {
                    $rootScope.cities = r.data;
                    $rootScope[city] = '';
                });
            }
            if (!value) $rootScope.cities = [];
        };

        ListingType.list().success(function(r) {
            $rootScope.listing_types = r.data;
        });
        ListingCategory.list().success(function (r) {
            $rootScope.listing_categories = r.data;
        })


        $rootScope.tinymceOptions = {
            menubar: "edit format tools format view insert",
            plugins: 'link image code',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code|sizeselect | bold italic | fontselect |  fontsizeselect',
            fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
            height: 200,
            language:'es'
        };




        function isSmartDevice($window) {
            // Adapted from http://www.detectmobilebrowsers.com
            var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
            // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
            return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
        }


    }
])

.controller('TopCtrl', ['$scope', '$rootScope', '$state', '$uibModal', 'Auth', '$translate', '$http', '$q', 'ListingReserve', function($scope, $rootScope, $state, $uibModal, Auth, $translate, $http, $q, ListingReserve) {

}]);
