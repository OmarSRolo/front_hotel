app.factory('ListingHelper', function($translate) {
    return {
        getPeriods: function(type) {
            var p = [];
            var max = 30;

            switch (type) {
                case "day":
                    max = 30;
                    break;
                case 'week':
                    max = 12;
                    break;
                case "year":
                    max = 5;
                    break;
                default:
                    max = 30;
                    break;
            }
            for (var i = 1; i <= max; i++) {
                p.push({
                    code: i,
                    text: i + ' ' + (i == 1 ? $translate.instant('common.date.' + type) : $translate.instant('common.date.' + type + 's'))
                })
            }
            return p;
        },
       getHuespeds: function(max) {
            var p = [];
            for (var i = 1; i <= max; i++) {
                p.push({
                    code: i,
                    text: i + ' ' + (i == 1 ? $translate.instant('common.huesped') : $translate.instant('common.huespeds'))
                })
            }
            return p;
        },
        getHuespedOrPeriod: function(code, list) {
            for (var i = 0; i < list.length; i++) {
                if(list[i].code == code){
                    return list[i];
                }
            }
            return null;
        },
        getYears: function () {
            var years = [];
            for (var i = (new Date()).getFullYear(); i < (new Date()).getFullYear() + 10; i++) {
                years.push(i);
            }
            return years;
        },
        getYear: function (code, list) {
            for (var i = 0; i < list.length; i++) {
                if(list[i] == code){
                    return list[i];
                }
            }
            return null;
        },
        getMonths: function () {
            var months = [];
            for (var i = 1; i <= 12; i++) {
                months.push({
                    code: i,
                    text: '01 - ' + $translate.instant('common.date.calendar.months.' + i)
                });
            }

            return months;
        },
        getMonth: function(code, list) {
            for (var i = 0; i < list.length; i++) {
                if(list[i].code == code){
                    return list[i];
                }
            }
            return null;
        }
    }
});
