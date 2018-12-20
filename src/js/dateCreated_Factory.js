'use strict';

app
    .factory(
        "dateCreatedFactory",
        function () {

            /**
             * Model for filter creation date
             */
            var createDate = {
                dateRangeStart: "",
                dateRangeEnd: ""
            };

            var configuration = [];
            configuration['dropdownStartCreateDate'] = {
                dropdownSelector: '#dropdownStartCreateDate',
                renderOn: 'create-date-end-date-changed',
                configureOn: 'config-changed',
                startView: 'day',
                minView: 'day'
            };
            configuration['dropdownEndCreateDate'] = {
                dropdownSelector: '#dropdownEndCreateDate',
                renderOn: 'create-date-start-date-changed',
                configureOn: 'config-changed',
                startView: 'day',
                minView: 'day'
            };

            var formatCreateDate = function () {
                var langWeb = document.getElementById('langdate').innerHTML;
                return langWeb == "en" ? "yyyy-MM-dd" : "dd-MM-yyyy";
            };

            var CreateDateNew = function (createDateFilter) {

                // validate no value in date range start
                if (createDateFilter.dateRangeStart == "") {
                    angular.element('[id="createDateRangeStart"]')
                        .focus();
                    return;
                }
                // validate no value in date range end
                if (createDateFilter.dateRangeEnd == "") {
                    angular.element('[id="createDateRangeEnd"]')
                        .focus();
                    return;
                }

                var create = {};
                create.dateRangeStart = createDateFilter.dateRangeStart;
                create.dateRangeEnd = createDateFilter.dateRangeEnd;
                return create;
            };

            /**
             * Update dates values in component start date of
             * creation date filter
             */
            var createDateStartDateBeforeRender = function ($dates, createDate) {
                if (createDate.dateRangeEnd) {
                    var activeDate = moment(createDate.dateRangeEnd);

                    $dates
                        .filter(
                            function (date) {
                                return date
                                        .localDateValue() >= activeDate
                                        .valueOf()
                            }).forEach(function (date) {
                        date.selectable = false;
                    })
                }
            };
            /**
             * Update dates values in component end date of
             * creation date filter
             */
            var createDateEndDateBeforeRender = function ($view, $dates, createDate) {
                if (createDate.dateRangeStart) {
                    var activeDate = moment(
                        createDate.dateRangeStart)
                        .subtract(1, $view)
                        .add(1, 'minute');
                    $dates
                        .filter(
                            function (date) {
                                return date
                                        .localDateValue() <= activeDate
                                        .valueOf()
                            }).forEach(function (date) {
                        date.selectable = false;
                    })
                }
            };

            return {
                glyphicon: "glyphicon-chevron-down",
                createDate: createDate,
                configuration: configuration,
                formatCreateDate: formatCreateDate,
                CreateDateNew: CreateDateNew,
                createDateStartDateBeforeRender: createDateStartDateBeforeRender,
                createDateEndDateBeforeRender: createDateEndDateBeforeRender
            }
        });