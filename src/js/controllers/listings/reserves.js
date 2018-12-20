'use strict';

app.controller('ListingsReservesCtr', ['$scope', 'toaster', '$state', 'Auth', '$translate', 'uiCalendarConfig', 'ListingReserve', '$q', 'ListingType', 'popQuestion', '$compile', '$uibModal', 'ListingHelper', 'dateCreatedFactory', function ($scope, toaster, $state, Auth, $translate, uiCalendarConfig, ListingReserve, $q, ListingType, popQuestion, $compile, $uibModal, ListingHelper, dateCreatedFactory) {

    $scope.createDateFactory = dateCreatedFactory;

    $scope.filter_user = Auth.get().role;
    $scope.periods = ListingHelper.getPeriods("day");
    $scope.huespeds = ListingHelper.getHuespeds(5);
    $scope.years = ListingHelper.getYears();
    $scope.months = ListingHelper.getMonths();

    $scope.step = 1;
    $scope.optionUpdate = 1;

    // Initial Create Date

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
            height: 450,
            editable: true,
            header: {
                left: 'title',
                center: '',
                right: 'today prev,next'
            },
            eventClick: function (date, jsEvent, view) {

                $uibModal.open({
                    templateUrl: 'site/src/views/app/listings/reserve/details.html',
                    size: 'md',
                    scope: $scope,
                    controller: function ($scope, $uibModalInstance) {
                        $scope.reserve = angular.copy(date.data);

                        if ($scope.filter_user == 'client' && $scope.reserve.status == 'created') {

                            $scope.data = {
                                id: $scope.reserve.id,
                                listing_id: $scope.reserve.listing_id,
                                period: '',
                                price_type: 'day',
                                childs: $scope.reserve.childs == 1,
                                price: $scope.reserve.price,
                                count_persons: $scope.reserve.count_persons,
                                start_date: $scope.reserve.start_date,
                                end_date: $scope.reserve.end_date,
                                agree_termns: true,
                                client_first_name: $scope.reserve.client_first_name,
                                client_last_name: $scope.reserve.client_last_name,
                                client_email: $scope.reserve.client_email,
                                client_city: $scope.reserve.client_city,
                                client_phone: $scope.reserve.client_phone,
                                client_reason: $scope.reserve.client_reason,
                                client_special_request: $scope.reserve.client_special_request,
                                account_number: $scope.reserve.account_number,
                                account_month_expire: $scope.reserve.account_month_expire,
                                account_year_expire: $scope.reserve.account_year_expire,
                                status: $scope.reserve.status,
                                lang: $("#langdate").text(),
                                owner_email: $scope.reserve.listing.owner.email,
                                owner_first_name: $scope.reserve.listing.owner.first_name,
                                owner_last_name: $scope.reserve.listing.owner.last_name
                            };

                            /* Date range functions */
                            /* creation date */
                            $scope.createDateStartDateOnSetTime = function () {
                                $scope
                                    .$broadcast('create-date-start-date-changed');

                                if ($scope.itemPeriod != undefined) {
                                    $scope.loadEndDate($scope.itemPeriod);
                                }
                            };

                            $scope.createDateEndDateOnSetTime = function () {
                                $scope
                                    .$broadcast('create-date-end-date-changed');
                            };

                            $scope.createDateFactory.createDate.dateRangeStart = $scope.reserve.start_date;
                            $scope.createDateFactory.createDate.dateRangeEnd = $scope.reserve.end_date;

                            var createDate = $scope.createDateFactory.createDate;

                            $scope.itemHuesped = ListingHelper.getHuespedOrPeriod($scope.data.count_persons, $scope.huespeds);
                            var dif = moment(createDate.dateRangeEnd).toDate() - moment(createDate.dateRangeStart).toDate();
                            $scope.itemPeriod = ListingHelper.getHuespedOrPeriod(moment(dif).format("D"), $scope.periods);
                            $scope.itemYear = ListingHelper.getYear($scope.data.account_year_expire, $scope.years);
                            $scope.itemMonth = ListingHelper.getMonth($scope.data.account_month_expire, $scope.months);

                            $scope.loadEndDate = function (item) {
                                $scope.itemPeriod = item;
                                $scope.createDateFactory.createDate.dateRangeEnd = moment($scope.createDateFactory.createDate.dateRangeStart).add($scope.itemPeriod.code, 'days').toDate();
                            };
                            $scope.loadHuesped = function (item) {
                                $scope.itemHuesped = item;
                                $scope.data.count_persons = $scope.itemHuesped.code;
                            };
                            $scope.loadYear = function (item) {
                                $scope.itemYear = item;
                                $scope.data.account_year_expire = $scope.itemYear;
                            };
                            $scope.loadMonth = function (item) {
                                $scope.itemMonth = item;
                                $scope.data.account_month_expire = $scope.itemMonth.code;
                            };
                            $scope.makeAction = function () {
                                $scope.data.start_date = $scope.createDateFactory.createDate.dateRangeStart;
                                $scope.data.end_date = $scope.createDateFactory.createDate.dateRangeEnd;
                                $scope.data.price = $scope.reserve.listing.price * $scope.itemPeriod.code;

                                ListingReserve.updateSecond($scope.data, 'listing_reserver.confirm_msg').then(function (r) {
                                    if (r.complete) {
                                        $scope.close();
                                        $scope.onChangeReserveView($scope.filter_user);
                                    }
                                });
                            }
                        }

                        $scope.close = function () {
                            $uibModalInstance.dismiss();
                            $scope.info();
                        };

                        $scope.info = function () {
                            $scope.optionUpdate = 1;
                            $scope.step = 1;
                        };
                        $scope.SetStep = function (next) {
                            if (next) {
                                $scope.step++;
                            } else {
                                $scope.step--;
                            }
                        };

                        $scope.view = function () {
                            $scope.optionUpdate = 2;
                            $scope.step = 1;
                        };

                        $scope.cancel = function () {
                            popQuestion.show($translate.instant('listing_reserve.cancel.header'), $translate.instant('listing_reserve.cancel.confirmation')).then(function () {
                                ListingReserve.cancel($scope.reserve.id).then(function (r) {
                                    if (r.complete) {
                                        toaster.pop('success', $scope.reserve.is_flexible_cancellable ? $translate.instant('listing_reserve.cancel.message_success_flexible') : $translate.instant('listing_reserve.cancel.message_success'));
                                        $uibModalInstance.dismiss();
                                        uiCalendarConfig.calendars.calendar.fullCalendar('refetchEvents');
                                        $scope.renderEvents($scope.lastViewRender);
                                    }
                                });
                            });

                        };

                        //Yeiniel
                        $scope.finish = function () {
                            popQuestion.show($translate.instant('listing_reserve.finish.header'), $translate.instant('listing_reserve.finish.confirmation')).then(function () {
                                ListingReserve.finish($scope.reserve.id).then(function (r) {
                                    if (r.complete) {
                                        toaster.pop('success', $scope.reserve.is_flexible_cancellable ? $translate.instant('listing_reserve.finish.message_success_flexible') : $translate.instant('listing_reserve.finish.message_success'));
                                        $uibModalInstance.dismiss();
                                        uiCalendarConfig.calendars.calendar.fullCalendar('refetchEvents');
                                        $scope.renderEvents($scope.lastViewRender);

                                        $scope.askReview($scope.reserve.id);
                                    }
                                });
                            });

                        };

                        $scope.start = function () {
                            popQuestion.show($translate.instant('listing_reserve.started.header'), $translate.instant('listing_reserve.started.confirmation')).then(function () {
                                ListingReserve.start($scope.reserve.id).then(function (r) {
                                    if (r.complete) {
                                        toaster.pop('success', $scope.reserve.is_flexible_cancellable ? $translate.instant('listing_reserve.started.message_success_flexible') : $translate.instant('listing_reserve.started.message_success'));
                                        $uibModalInstance.dismiss();
                                        uiCalendarConfig.calendars.calendar.fullCalendar('refetchEvents');
                                        $scope.renderEvents($scope.lastViewRender);
                                    }
                                });
                            });

                        };

                        $scope.confirm = function () {
                            popQuestion.show($translate.instant('listing_reserve.confirm.header'), $translate.instant('listing_reserve.confirm.confirmation')).then(function () {
                                ListingReserve.confirm($scope.reserve.id).then(function (r) {
                                    if (r.complete) {
                                        toaster.pop('success', $scope.reserve.is_flexible_cancellable ? $translate.instant('listing_reserve.confirm.message_success_flexible') : $translate.instant('listing_reserve.confirm.message_success'));
                                        $uibModalInstance.dismiss();
                                        uiCalendarConfig.calendars.calendar.fullCalendar('refetchEvents');
                                        $scope.renderEvents($scope.lastViewRender);
                                    }
                                });
                            });

                        };
                    }
                });

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
        ListingReserve.queryall(1, 0, {
            client_id: $scope.filter_user == 'client' ? Auth.get().id : '',
            owner_id: $scope.filter_user == 'owner' ? Auth.get().id : '',
            start_date: view.start.format("YYYY-MM-DD"),
            end_date: view.end.format("YYYY-MM-DD")
        }).success(function (r) {

            angular.forEach(r.data.results, function (e) {
                var statusBg = '';
                switch (e.status) {
                    case 'created':
                        statusBg = 'bg-warning';
                        break;
                    case 'confirmed':
                        statusBg = 'bg-success';
                        break;
                    case "cancelled":
                        statusBg = 'bg-danger';
                        break;
                    case "started":
                        statusBg = 'bg-info';
                        break;
                    case "finish":
                        statusBg = 'bg-primary';
                        break;
                }
                $scope.events.push({
                    title: e.listing ? e.status + ' ' + $translate.instant('listing.id') + ' # ' + e.listing.id + '(' + e.listing.country.name + ',' + e.listing.city + ')' : '',
                    start: $scope.dateOptions.parseDate(e.start_date),
                    end: moment($scope.dateOptions.parseDate(e.end_date)).add(1, 'day').toDate(),
                    className: ['bg ' + statusBg],
                    data: e
                })
            })
        });
    };

    $scope.askReview = function (id) {
        ListingReserve.calification({
            id: id,
            ask_review: 1
        }).then(function (r) {
            if (r.complete) {
                toaster.pop('success', $translate.instant('listing_reserve.ask_review_msg_success'));
                uiCalendarConfig.calendars.calendar.fullCalendar('refetchEvents');
                $scope.renderEvents($scope.lastViewRender);
            }
        })
    }
}]);
