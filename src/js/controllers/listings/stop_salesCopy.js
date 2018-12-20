'use strict'; //Yeiniel

app.controller('ListingsStopSalesCtr', ['$scope', 'toaster', '$state', 'Auth', '$translate', 'uiCalendarConfig', 'ListingStopSale', '$q', 'ListingType', 'popQuestion', '$compile', '$uibModal', 'dateCreatedFactory', function ($scope, toaster, $state, Auth, $translate, uiCalendarConfig, ListingStopSale, $q, ListingType, popQuestion, $compile, $uibModal, dateCreatedFactory) {

    // Initial Create Date
    $scope.createDateFactory = dateCreatedFactory;
    
    $scope.removeDateFilter = function(evt) {
        var create = $scope.createDateFactory
            .CreateDateNew($scope.createDateFactory.createDate);

        popQuestion.show($translate.instant("listing_stop_sales.delete.header"), $translate.instant("listing_stop_sales.delete.confirmation")).then(function () {
            ListingStopSale.deleteAll({
                user_id: $scope.filter_user == 'owner' ? Auth.get().id : '',
                start_date: create.dateRangeStart,
                end_date: create.dateRangeEnd,
                lang: $("#langdate").text()
            }).then(function (r) {
                $scope.renderEvents($scope.lastViewRender);
            })
        })
    };

    $scope.addOrRemoveCreateDateFilter = function(evt) {

        var create = $scope.createDateFactory
            .CreateDateNew(
                $scope.createDateFactory.createDate);

        var parameters = {
            start_date: moment(create.dateRangeStart).toDate(),
            end_date: moment(create.dateRangeEnd).toDate()
        };

        console.log(parameters);

        popQuestion.show($translate.instant("listing_stop_sales.insert.header"), $translate.instant("listing_stop_sales.insert.confirmation")).then(function () {
            ListingStopSale.insert(parameters).then(function (r) {
                if (r.complete)
                    $scope.renderEvents($scope.lastViewRender);
            })
        })
    };

    /* Date range functions */
    /* creation date */
    $scope.createDateStartDateOnSetTime = function() {
        $scope
            .$broadcast('create-date-start-date-changed');
    };

    $scope.createDateEndDateOnSetTime = function() {
        $scope
            .$broadcast('create-date-end-date-changed');
    };

    // End Create Date

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
            slotEventOverlap:false,
            editable: true,
            selectable: true,
            selectHelper: true,
            displayEventTime:false,
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
                        end_date: end.add(-1,'day').format("YYYY-MM-DD")
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
