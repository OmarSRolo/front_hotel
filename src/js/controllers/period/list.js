'use strict';

app.controller('PeriodsListCtr',
    ['$scope', 'toaster', '$state', 'Auth', '$translate', 'uiCalendarConfig', 'PeriodPrice', '$q', 'popQuestion', '$compile',
        function ($scope, toaster, $state, Auth, $translate, uiCalendarConfig, PeriodPrice, $q, popQuestion, $compile) {

            $scope.view = 1;
            $scope.copyRooms = [];

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

            $scope.selected = {};

            var initialData = function () {
                $scope.selected = {
                    name: "",
                    date_initial: $scope.dateOptions.parseDateObject(new Date),
                    date_end: $scope.dateOptions.parseDateObject(new Date),
                    owner_id: Auth.get().id,
                    lang: $('#langdate').html(),
                    rooms: []
                };
            }

            $scope.insert = function () {

                initialData();

                if ($scope.copyRooms.length == 0) {
                    var parameter = {
                        owner_id: Auth.get().id,
                        lang: $('#langdate').html()
                    };

                    PeriodPrice.queryRooms(parameter).success(function (r) {
                        $scope.selected.rooms = angular.copy(r.data);
                        $scope.copyRooms = angular.copy(r.data);
                        $scope.view = 2;
                    });

                } else {
                    $scope.selected.rooms = angular.copy($scope.copyRooms);
                    $scope.view = 2;
                }
            };

            $scope.edit = function () {
                $scope.view = 3;
            };

            $scope.detail = function () {
                $scope.selected = {
                    name: $scope.selected.name,
                    date_initial: $scope.dateOptions.parseDateObject($scope.selected.date_initial),
                    date_end: $scope.dateOptions.parseDateObject($scope.selected.date_end),
                    owner_id: Auth.get().id,
                    lang: $('#langdate').html(),
                    rooms: angular.copy($scope.selected.rooms)
                };
                $scope.view = 4;
            };

            $scope.delete = function () {
                var defer = $q.defer();
                var id = $scope.selected.id;
                popQuestion.show($translate.instant('price_period.delete.header'), $translate.instant('price_period.delete.confirmation')).then(function () {
                    PeriodPrice.delete(id).then(function (r) {
                        if (r.data.complete) {
                            $scope.renderEvents($scope.lastViewRender);
                        }
                    })
                });
            };

            $scope.save = function () {
                if ($scope.view == 2) {
                    popQuestion.show($translate.instant("price_period.insert.header"), $translate.instant("price_period.insert.confirmation")).then(function () {
                        PeriodPrice.insert($scope.selected).then(function (r) {
                            $scope.view = 1;
                        })
                    });
                }

                if ($scope.view == 3) {
                    popQuestion.show($translate.instant("price_period.update.header"), $translate.instant("price_period.update.confirmation")).then(function () {
                        PeriodPrice.update($scope.selected).then(function (r) {
                            $scope.view = 1;
                        })
                    });
                }
            };

            $scope.cancel = function () {
                $scope.view = 1;
            };

            $scope.events = [];
            $scope.eventSources = [$scope.events];
            $scope.lastViewRender = null;
            $scope.uiConfig = {
                calendar: {
                    lang: 'he',
                    height: 'auto',
                    slotEventOverlap: false,
                    editable: false,
                    selectable: false,
                    selectHelper: false,
                    displayEventTime: false,
                    selectOverlap: false,
                    header: {
                        left: 'title',
                        center: '',
                        right: 'today prev,next'
                    },
                    eventClick: function (date, jsEvent, view) {
                        $scope.selected = angular.copy(date.data);
                        $('#myModal').modal('show');
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

            $scope.renderEvents = function (view) {

                var parameter = {
                    date_initial: view.start.format("YYYY-MM-DD"),
                    date_end: view.end.format("YYYY-MM-DD"),
                    owner_id: Auth.get().id,
                    lang: $('#langdate').html()
                };

                PeriodPrice.query(parameter).success(function (r) {
                    $scope.events.splice(0, $scope.events.length);
                    uiCalendarConfig.calendars.calendar.fullCalendar('refetchEvents');
                    angular.forEach(r.data, function (e) {
                        $scope.events.push({
                            title: e.id + ". " + e.name,
                            start: $scope.dateOptions.parseDate(e.date_initial),
                            end: moment($scope.dateOptions.parseDate(e.date_end)).add(1, 'day').toDate(),
                            className: ['bg bg-success'],
                            data: e
                        })
                    });
                });
            };
        }]);
