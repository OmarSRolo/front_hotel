angular.module('app').directive('countdown', [
    'timeUtil',
    '$interval',
    function (Util, $interval) {

        return {
            scope: {
                date: '@',
                countdownStop: '&'
            },
            controller: function($scope) {

                $scope.timeLeft = true;
                $scope.counting = -1;

                var stop;

                $scope.start = function() {
                    stop = $interval($scope.countdown, 1000);
                };
                $scope.stop = function() {
                    $interval.cancel(stop);
                    $scope.countdownStop();
                };
                $scope.countdown = function () {
                    var diff, time, html;
                    diff = Math.floor(($scope.future.getTime() - new Date().getTime()) / 1000);
                    console.log($scope.future);
                    if(diff > 0) {
                        time = Util.convertTime(diff);
                        $scope.time = time;
                    }
                    else {
                        $scope.time  = {days: 0, hours: 0, minutes: 0, seconds:0};
                        $scope.stop();
                    }

                };

                $scope.time = {
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                };

            },
            template: '<p class="home-listing-title text-right"><i class="fa fa-clock-o"></i> {{time.days + "D "+ time.hours+ "H " + time.minutes + "M " + time.seconds+ "S"}}</p>',
            restrict: 'E',
            link: function ($scope, element) {
                $scope.future = new Date($scope.date);
                console.log($scope.date);
                if($scope.future instanceof Date) {
                    $scope.start();
                }
            }
        };
    }
]).factory('timeUtil', [function () {

    return {
        convertTime: function (t) {
            var days, hours, minutes, seconds;
            days = Math.floor(t / 86400);
            t -= days * 86400;
            hours = Math.floor(t / 3600) % 24;
            t -= hours * 3600;
            minutes = Math.floor(t / 60) % 60;
            t -= minutes * 60;
            seconds = t % 60;
            return {
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            };
        }
    };
}]);
