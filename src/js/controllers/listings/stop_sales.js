'use strict'; //Yeiniel

app.controller('ListingsStopSalesCtr', ['$scope', 'toaster', '$state', 'Auth', '$translate', 'uiCalendarConfig', 'ListingStopSale', '$q', 'ListingType', 'popQuestion', '$compile', '$uibModal', function ($scope, toaster, $state, Auth, $translate, uiCalendarConfig, ListingStopSale, $q, ListingType, popQuestion, $compile, $uibModal) {

    $scope.dateOptions = {
        today: moment().add(-1, 'day').format(),
        formatYear: 'yy',
        startingDay: 1,
        shortFormat: 'DD-MM-YYYY',
        largeFormat: 'DD-MM-YYYY HH:mm:ss',
        datepicker: 'dd-MMMM-yyyy',
        datepickerShort: 'dd-MM-yyyy',
        localeFormat: 'DD-MM-YYYY',
        parse: function (strDate) {
            if (!strDate)
                return "";
            return moment(strDate, $scope.dateOptions.localeFormat).format("YYYY-MM-DD");
        },
        parseDate: function (strDate, localeFormat) {
            var format = localeFormat ? $scope.dateOptions.localeFormat : 'YYYY-MM-DD';
            return moment(strDate, format).toDate();
        },
        parseDateObject: function (d) {
            return moment(d).format($scope.dateOptions.localeFormat);
        }
    };
    
    $scope.dateData = {
        start_date: $scope.dateOptions.parseDateObject(new Date),
        end_date: $scope.dateOptions.parseDateObject(new Date)
    }
    function ConvertDate() {
        return {
            start_date: $scope.dateOptions.parse($scope.dateData.start_date),
            end_date: $scope.dateOptions.parse($scope.dateData.end_date)
        }
    }

    $scope.removeDateFilter = function (evt) {
        var create = ConvertDate();

        popQuestion.show($translate.instant("listing_stop_sales.delete.header"), $translate.instant("listing_stop_sales.delete.confirmation")).then(function () {
            ListingStopSale.deleteAll({
                user_id: $scope.filter_user == 'owner' ? Auth.get().id : '',
                start_date: create.start_date,
                end_date: create.end_date,
                lang: $("#langdate").text()
            }).then(function (r) {
                $scope.renderEvents($scope.lastViewRender);
            })
        })
    };

    $scope.addOrRemoveCreateDateFilter = function (evt) {

        var parameters = ConvertDate();

        console.log(parameters);

        popQuestion.show($translate.instant("listing_stop_sales.insert.header"), $translate.instant("listing_stop_sales.insert.confirmation")).then(function () {
            ListingStopSale.insert(parameters).then(function (r) {
                if (r.complete)
                    $scope.renderEvents($scope.lastViewRender);
            })
        })
    };

    $scope.filter_user = Auth.get().role;

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $scope.events = [];

    $scope.eventSources = [$scope.events];

    $scope.lastViewRender = null;

    $scope.uiConfig = {
        calendar: {
            lang: 'he',
            height: 'auto',
            slotEventOverlap: false,
            editable: true,
            selectable: true,
            selectHelper: true,
            displayEventTime: false,
            selectOverlap: false,
            header: {
                left: 'title',
                center: '',
                right: 'today prev,next'
            },
            select: function (start, end) {
                popQuestion.show($translate.instant("listing_stop_sales.insert.header"), $translate.instant("listing_stop_sales.insert.confirmation")).then(function () {
                    ListingStopSale.insert({
                        start_date: start.format("YYYY-MM-DD"),
                        end_date: end.add(-1, 'day').format("YYYY-MM-DD")
                    }).then(function (r) {
                        if (r.complete)
                            $scope.renderEvents($scope.lastViewRender);
                    })
                })
                ;
            },
            eventClick: function (date, jsEvent, view) {
                popQuestion.show($translate.instant("listing_stop_sales.delete.header"), $translate.instant("listing_stop_sales.delete.confirmation")).then(function () {
                    ListingStopSale.delete(date.data.id).then(function (r) {

                        $scope.renderEvents($scope.lastViewRender);
                    })
                })
            },
            eventRender: function (event, element, view) {
                element.attr({
                    'uib-tooltip': event.title,
                });
                $compile(element)($scope);
            },
            viewRender: function (view, element) {
                $scope.lastViewRender = view;
                $scope.renderEvents($scope.lastViewRender);

            },
            monthNames: [$translate.instant('common.date.calendar.months.1'), $translate.instant('common.date.calendar.months.2'), $translate.instant('common.date.calendar.months.3'), $translate.instant('common.date.calendar.months.4'), $translate.instant('common.date.calendar.months.5'), $translate.instant('common.date.calendar.months.6'),
                $translate.instant('common.date.calendar.months.7'), $translate.instant('common.date.calendar.months.8'), $translate.instant('common.date.calendar.months.9'), $translate.instant('common.date.calendar.months.10'), $translate.instant('common.date.calendar.months.11'), $translate.instant('common.date.calendar.months.12')],
            dayNamesShort: [$translate.instant('common.date.calendar.days.1'), $translate.instant('common.date.calendar.days.2'), $translate.instant('common.date.calendar.days.3'), $translate.instant('common.date.calendar.days.4'),
                $translate.instant('common.date.calendar.days.5'), $translate.instant('common.date.calendar.days.6'), $translate.instant('common.date.calendar.days.7')],
            buttonText: {
                today: $translate.instant('common.date.today')
            },
        }
    };

    $scope.onChangeReserveView = function (c) {
        $scope.filter_user = c;
        uiCalendarConfig.calendars.calendar.fullCalendar('refetchEvents');
        $scope.renderEvents($scope.lastViewRender);
    };

    /*$scope.renderEvents = function (view) {

     //$scope.events = [];
     ListingStopSale.query(1, 0, {
     //user_id: $scope.filter_user == 'client' ? Auth.get().id : '',
     user_id: $scope.filter_user == 'owner' ? Auth.get().id : '',
     start_date: view.start.format("YYYY-MM-DD"),
     end_date: view.end.format("YYYY-MM-DD")
     }).success(function (r) {
     console.log(r.data.results);
     uiCalendarConfig.calendars.calendar.fullCalendar('refetchEvents');
     angular.forEach(r.data.results, function (e) {
     $scope.events.push({
     title: $translate.instant('listing_stop_sales.event_title'),
     start: $scope.dateOptions.parseDate(e.start_date),
     end: moment($scope.dateOptions.parseDate(e.end_date)).add(1, 'day').toDate(),
     className: ['bg bg-danger'],
     data: e
     })
     })
     });
     };*/

    $scope.renderEvents = function (view) {

        var data = {
            user_id: $scope.filter_user == 'owner' ? Auth.get().id : '',
            start_date: view.start.format("YYYY-MM-DD"),
            end_date: view.end.format("YYYY-MM-DD")
        };

        console.log(data);
        console.log(Auth.get().id);

        //$scope.events = [];
        ListingStopSale.queryDate(data).success(function (r) {
            uiCalendarConfig.calendars.calendar.fullCalendar('refetchEvents');
            angular.forEach(r.data.results, function (e) {
                $scope.events.push({
                    title: $translate.instant('listing_stop_sales.event_title'),
                    start: $scope.dateOptions.parseDate(e.start_date),
                    end: moment($scope.dateOptions.parseDate(e.end_date)).add(1, 'day').toDate(),
                    className: ['bg bg-danger'],
                    data: e
                })
            })
        });
    };

}]);
