app.filter('dateSpanish', function () {
    return function (input) {
        var year = input.substr(0, 4);
        var month = input.substr(5, 2);
        var day = input.substr(8, 2);
        var time = input.substr(10);
        return day + '-' + month + '-' + year + ' ' + time;
    };
});

app.filter('dateSpanishShort', function () {
    return function (input) {
        if (input == null) {
            return '';
        }
        var year = input.substr(0, 4);
        var month = input.substr(5, 2);
        var day = input.substr(8, 2);
        return day + '-' + month + '-' + year;
    };
});

app.filter('dateGmtTime', function () {
    return function (input) {
        //var d = new Date();
        if (typeof input == 'object') {
            var hour = input.getHours();
            hour = hour < 10 ? '0' + hour : hour;
            var minute = input.getMinutes();
            minute = minute < 10 ? '0' + minute : minute;
            return hour + ':' + minute;
        }
        return '';
    };
});

app.filter('dateEnglish', function () {
    return function (input) {
        if (!angular.isDefined(input)) return '';

        var year = input.substr(0, 4);
        var month = input.substr(5, 2);
        var day = input.substr(8, 2);
        var time = input.substr(10);
        return month + '-' + day + '-' + year + ' ' + time;
    };
});

app.filter('dateEnglishShort', function () {
    return function (input) {
        var year = input.substr(0, 4);
        var month = input.substr(5, 2);
        var day = input.substr(8, 2);
        return month + '-' + day + '-' + year;
    };
});

app.filter('rawHtml', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}]);

app.filter('subs', function () {
    return function (dt, v) {
        return dt.length > v ? dt.substr(0, v) + '...' : dt;
    }
});


app.filter('rawHtml', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}]);

app.filter('subs', function () {
    return function (dt, v) {
        var c = 0;
        var go = true;
        for (var n = 0; n < dt.length; n++) {
            if (dt[n] = '<') go = false;
            if (dt[n] = '>') go = true;
            if (go) c++;
        }
        return (c > v ? dt.substr(0, v) + '...' : dt);
    }
});

app.filter('strComplete', function () {
    return function (dt, v) {
        v = angular.isDefined(v) ? v : 10;
        if (parseInt(dt) > v)
            return dt;
        else {
            return '0' + dt;
        }
    }
});


app.filter('timeAdvance', ['$translate', function ($translate) {
    return function (input) {
        if (!angular.isDefined(input)) return '0';
        if (input == null) return '0';
        if (input < 60) {
            return parseInt(input) + ' ' + $translate.instant('common.time_details.minute');
        }
        var d = parseInt(input / 1440);
        var h = parseInt((input % 1440) / 60);
        var m = parseInt((input % 1440) % 60);
        return (d > 0 ? (d + ' ' + $translate.instant('common.time_details.day') + ' ' + $translate.instant('common.time_details.first_separator') + ' ') : '') + h + ' ' + $translate.instant('common.time_details.hour') + ' ' + $translate.instant('common.time_details.last_separator') + ' ' + m + ' ' + $translate.instant('common.time_details.minute');
    };
}]);

app.filter('mysqlToDateTime', function () {
    return function (input) {
        if (!angular.isDefined(input)) {
            return '';
        }
        if (angular.isDate(input)) {
            return input;
        }
        var date = input.substring(0, 10);
        var year = input.substr(0, 4);
        var month = input.substr(5, 2);
        var day = input.substr(8, 2);
        var h = input.substr(11, 2);
        var m = input.substr(14, 2);
        var s = input.substr(17, 2);
        //var time = myDate.substring(11, 19);
        if (angular.isDefined(h)) {
            //var sDate = new Date(date.replace(/-/g, ',') + ',' + time);
            var sDate = new Date(parseInt(year),parseInt(month)-1,parseInt(day));
        } else {
            // var sDate = new Date(date.replace(/-/g, ','));
            var sDate = new Date(parseInt(year),parseInt(month)-1,parseInt(day));
        }

        return sDate;
    };
});


app.filter('default', function () {
    return function (v, d) {
        return (!angular.isDefined(v) || v == null) ?
            (angular.isDefined(d) ? d : '-') : v;
    }
});
