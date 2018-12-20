'use strict';

/* Filters */
// need load the moment.js to use this filter.
angular.module('app')
    .filter('fromNowO', function() {
        return function(date) {
            return moment(date).fromNow();
        }
    })
    .filter('parseLinks', function() {
        return function(input) {

            var quote = /"([^"]*)"/g;
            var url = /([\w.]+)(\S*)([.w]+)$/g;
            //url = /(\w+):\/\/([\w.]+)\/(\S*)/

            return input.replace(url, '<a href="http://$1">$1</a>');

        }
    })
    .filter('fromNow', function($translate) {
        return function(input) {
            if (!angular.isDefined(input)) return '';
            var date = input.substring(0, 10);
            var time = input.substring(11, 19);
            if (time != '') {
                var sDate = new Date(date.replace(/-/g, ',') + ',' + time);
            } else {
                var sDate = new Date(date.replace(/-/g, ','));
            }
            var today = new Date();
            var txtDay = '';
            var dToday = moment(today).dayOfYear();
            var dDate = moment(sDate).dayOfYear();
            switch (dToday - dDate) {
                case 0:
                    txtDay = $translate.instant('common.date.today');
                    break;
                case 1:
                    txtDay = $translate.instant('common.date.yesterday');
                    break;
                default:
                    var year = input.substr(0, 4);
                    var month = input.substr(5, 2);
                    var day = input.substr(8, 2);
                    var time = input.substr(10);
                    txtDay =  day + '-' + month + '-' + year ;
                    //txtDay = (dToday - dDate) + ' ' + $translate.instant('common.date.days_ago');
                    break;
            }

            return txtDay + ' ' + time;
        };
    });
