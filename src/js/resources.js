app.factory("ajax", ['$http', 'toaster', '$rootScope', '$location', '$state', 'jwtHelper', 'store', 'dateHelper', '$translate', 'Upload', '$timeout', '$q', function ($http, toaster, $rootScope, $location, $state, jwtHelper, store, dateHelper, $translate, Upload, $timeout, $q) {

    return {
        //base_url: 'http://instabono.com/api/index.php/',
        base_url: 'api/index.php/',
        authHeader: "ax-auth",
        authPrefix: "Bearer ",
        getHeader: function () {
            var headers = {
                'Content-Type': undefined,
                'lang': $translate.use()
            };

            if (store.get('token') != null) {
                headers[this.authHeader] = this.authPrefix + store.get('token');
            }
            return headers;
        },
        post: function (url, params, successMessage, errorMessage, skipAuthorization, auto) {
            var fd = new FormData();

            angular.forEach(params, function (value, key) {
                if (angular.isDefined(value) && value != null) {
                    if (angular.isArray(value)) {
                        value = JSON.stringify(value);
                    } else if (Date.prototype.isPrototypeOf(value)) {
                        value = dateHelper.dateTimeToMysql(value);
                    } else if (File.prototype.isPrototypeOf(value)) {

                    } else if (angular.isObject(value)) {
                        value = JSON.stringify(value);
                    }
                    fd.append(key, value);
                }
            });

            var headers = {
                'Content-Type': undefined,
                'AutoRespond': angular.isDefined(auto) && auto,
                'lang': $translate.use()
            };

            if ((!angular.isDefined(skipAuthorization) || !skipAuthorization) && store.get('token') != null) {
                headers[this.authHeader] = this.authPrefix + store.get('token');
            }
            return $http.post(this.base_url + url, fd, {
                transformRequest: angular.identity,
                headers: headers
            }).success(function (response) {
                response.token && store.set('token', response.token);

                if (response.complete) {
                    if (successMessage != null)
                        toaster.pop('success', $translate.instant("message.action_succeded"), (response.message != null && response.message != '') ? response.message : successMessage);
                } else if (errorMessage != null) {
                    if ($state.includes('site.login') && response.status == 'exit') {
                        return;
                    }
                    errorMessage = (errorMessage != null && errorMessage.length == 0) ? 'Action with error(s)' : errorMessage;

                    ((!angular.isDefined(auto) || !auto) && (response.status != 'exit' || !$rootScope.stopAutoRequest)) &&
                    toaster.pop('error', $translate.instant("message.action_error"), (response.message != null && response.message != '') ? response.message : errorMessage);

                    /*if (response.status == 'exit') {
                     $rootScope.stopAutoRequest = true;
                     $state.go('login');
                     }*/
                }
            }).error(function (error, status, config, headers) {

                toaster.pop('error', $translate.instant('message.ajax_error'), $translate.instant('message.ajax_server_error') + ((error) ? '<p>' + error + '</p>' : ''));

            });
        },

        get: function (url, params, successMessage, errorMessage, skipAuthorization, auto) {
            var fd = new FormData();
            angular.forEach(params, function (value, key) {
                if (angular.isDefined(value) && value != null) {
                    if (angular.isArray(value)) {
                        value = JSON.stringify(value);
                    } else if (Date.prototype.isPrototypeOf(value)) {
                        value = dateHelper.dateTimeToMysql(value);
                    } else if (File.prototype.isPrototypeOf(value)) {

                    } else if (angular.isObject(value)) {
                        value = JSON.stringify(value);
                    }
                    fd.append(key, value);
                }
            });

            var headers = {
                'Content-Type': undefined,
                'AutoRespond': angular.isDefined(auto) && auto,
                'lang': $translate.use()
            };
            if ((!angular.isDefined(skipAuthorization) || !skipAuthorization) && store.get('token') != null) {
                headers[this.authHeader] = this.authPrefix + store.get('token');
            }
            return $http.get(this.base_url + url, {
                transformRequest: angular.identity,
                headers: headers
            }).success(function (response) {
                response.token && store.set('token', response.token);

                if (response.complete) {
                    if (successMessage != null)
                        message.info((response.message != null && response.message != '') ? response.message : successMessage);

                } else if (errorMessage != null) {
                    if ($state.includes('site.login') && response.status == 'exit') {
                        return;
                    }
                    errorMessage = (errorMessage != null && errorMessage.length == 0) ? 'Action with error(s)' : errorMessage;

                    ((!angular.isDefined(auto) || !auto) && (response.status != 'exit' || !$rootScope.stopAutoRequest)) &&
                    toaster.pop('error', (response.message != null && response.message != '') ? response.message : errorMessage);

                    /*if (response.status == 'exit') {
                     $rootScope.stopAutoRequest = true;
                     $state.go('login');
                     }*/
                }
            }).error(function (error, status, config, headers) {
                var production = true;
                var msg = 'Error (' + status + ').' + $translate.instant('ajax_error');
                if (production == false) {
                    msg = $translate.instant('ajax_error') + '<p>' + error + '</p>';
                }
                toaster.pop('error', $translate.instant("message.action_error"), msg);

            });
        },

        postFile: function (url, params, successMessage, errorMessage) { //using ng File (Beatifull)
            var uploadResult = Upload.upload({
                url: this.base_url + url,
                headers: this.getHeader(),
                data: params
            });
            var defer = $q.defer();
            uploadResult.then(function (response) {
                $timeout(function () {
                    response.data.token && store.set('token', response.data.token);
                    defer.resolve(response.data);
                    if (response.data.complete) {
                        if (successMessage != null)
                            toaster.pop('success', $translate.instant("message.action_succeded"), (response.data.message != null && response.data.message != '') ? response.data.message : successMessage);
                    } else {
                        if (errorMessage != null)
                            toaster.pop('error', $translate.instant("message.action_error"), (response.data.message != null && response.data.message != '') ? response.data.message : errorMessage);
                    }
                });
            }, function (response) {
                console.log(response);
                var production = true;
                var msg = 'Error (' + response.status + ').' + response.statusText;
                if (production) {
                    msg += " <br> UrlApi: " + response.config.url;
                }

                toaster.pop('error', $translate.instant("message.action_error"), msg);
                defer.reject();
            });
            return defer.promise;
        }
    };
}]);

app.factory("Auth", function ($rootScope, $http, ajax, $cookies, $cookieStore, store, $state, $q, $translate, jwtHelper, Upload, $timeout, toaster) {
    return {
        recoverPassword: function (data) {
            return ajax.post('auth/password/', data, $translate.instant('access.password.msg_success'), '');
        },
        getQuestion: function (data) {
            return ajax.post('auth/question', data, null, $translate.instant('access.forgotpwd.msg_error_email'));
        },
        get: function () {
            //store.remove('token');
            var token = store.get("token") || null;
            if (!token || token.length == 0)
                return {};
            var tokenPayload = jwtHelper.decodeToken(token);
            return tokenPayload;
        },
        isLogged: function () {
            var token = store.get("token") || null;
            if (!token || token.length == 0)
                return false;
            return true;
            //return !jwtHelper.isTokenExpired(token);
        },
        login: function (data) {
            return ajax.post('auth/login', data, null, $translate.instant('access.login.message_fail'), true).success(function (r) {
                if (r.complete) {
                    store.set('token', r.data);
                }
            })
        },
        loginSocial: function (data) {
            return ajax.post('auth/login_social', data, null, '', true).success(function (r) {
                if (r.complete) {
                    if (r.message) {
                        toaster.pop('success', $translate.instant("message.action_succeded"), r.message);
                    }
                    store.set('token', r.data);
                }
            })
        },
        register: function (data) {
            var msg = (data.role && data.role == 'owner') ? $translate.instant('access.register.msg_success_owner') : $translate.instant('access.register.msg_success_client');
            return ajax.post('auth/register', data, msg, "", true).success(function (r) {
                if (r.complete && (!data.role || data.role != 'owner')) {
                    store.set('token', r.data);
                }
            })
        },
        updateProfile: function (data) {
            return ajax.post('auth/update', data, $translate.instant('access.profile.info.msg_success'), '').success(function (r) {
                if (r.complete) {
                    store.set('token', r.data);
                }
            })
        },
        convetToOwner: function () {
            var data = this.get();
            data.role = 'owner';
            return ajax.post('auth/update', data, $translate.instant('access.profile.info.msg_success_owner_email'), '').success(function (r) {

            })
        },
        stopSales: function (data) {
            data.stop_sales = 1;
            data.edit_stop_sales = true;
            return ajax.post('auth/update', data, $translate.instant('access.profile.stop_sales.msg_success'), '').success(function (r) {

            });
        },
        playSales: function (data) {
            data.stop_sales = 0;
            data.edit_stop_sales = true;
            return ajax.post('auth/update', data, $translate.instant('access.profile.play_sales.msg_success'), '').success(function (r) {

            })
        },
        verificateOwnerTokenEmail: function (token) {
            return ajax.post('auth/confirmation/' + token, null, null, null).success(function (r) {
                if (r.complete) {
                    store.set('token', r.data);
                }
            })
        },
        uploadProfileImg: function (data) {
            var callback = ajax.postFile('auth/update', data, null, '');
            callback.then(function (response) {
                $timeout(function () {
                    if (response.complete) {
                        store.set('token', response.data);
                    }
                }, 1);
            });
            return callback;
        },
        getProfile: function () {
            return ajax.get('auth/get', null, null, '').success(function (r) {

            })
        },
        logout: function () {
            store.remove('token');
            $state.go('app.home');
        },
        contactUs: function (data) {
            return ajax.post('auth/contact_us', data, $translate.instant('contact_us.msg_success'), '').success(function (r) {

            })
        }
    }
});


//////*******************************************/////////////
app.factory("User", function ($http, ajax, $q, $translate) {
    return {
        filter: function (page, count, filters) {
            var dt = angular.isDefined(filters) ? filters : {};
            dt.page = page;
            dt.count = count;
            return ajax.post('users/filter', dt, null, '');
        },
        get: function (id) {
            return ajax.get('users/get/' + id, null, null, '');
        },
        insert: function (data) {
            return ajax.post('posts/insert', data, $translate.instant('post.insert.msg_success'), '');
        },
        update: function (data) {
            return ajax.post('posts/update', data, $translate.instant('post.update.msg_success'), '');
        },
        delete: function (id) {
            return ajax.post('users/delete', {
                id: id
            }, $translate.instant('access.profile.delete.msg_success'), '');
        }
    }
});

app.factory("Faq", function ($http, ajax, $q, $translate) {
    return {
        query: function (page, count, filters) {
            var dt = angular.isDefined(filters) ? filters : {};
            dt.page = page;
            dt.count = count;
            return ajax.post('faqs/query', dt, null, '');
        },
        insert: function (data) {
            return ajax.post('faqs/insert', data, $translate.instant('faq.insert.msg_success'), '');
        },
        update: function (data) {
            return ajax.post('faqs/update', data, $translate.instant('faq.update.msg_success'), '');
        },
        delete: function (id) {
            return ajax.post('faqs/delete', {
                id: id
            }, $translate.instant('message.delete.msg_success'), '');
        }
    }
});

app.factory("Content", function ($http, ajax, $q, $translate) {
    return {
        query: function (page, count, filters) {
            var dt = angular.isDefined(filters) ? filters : {};
            dt.page = page;
            dt.count = count;
            return ajax.post('contents/query', dt, null, '');
        },
        get: function (key) {
            return ajax.post('contents/get/' + key, null, null, '');
        },
        insert: function (data) {
            return ajax.post('contents/insert', data, $translate.instant('faq.insert.msg_success'), '');
        },
        update: function (data) {
            return ajax.post('contents/update', data, $translate.instant('faq.update.msg_success'), '');
        },
        delete: function (id) {
            return ajax.post('contents/delete', {
                id: id
            }, $translate.instant('message.delete.msg_success'), '');
        }
    }
});

app.factory("ListingType", function ($http, ajax, $q, $translate) {
    return {
        list: function () {
            return ajax.get('listing_types', null, null, '');
        },
        query: function (page, count, filters) {
            var dt = angular.isDefined(filters) ? filters : {};
            dt.page = page;
            dt.count = count;
            return ajax.post('listing_types/query', dt, null, '');
        },
        insert: function (data) {
            return ajax.post('listing_types/insert', data,'', '');
        },
        update: function (data) {
            return ajax.post('listing_types/update', data, '', '');
        },
        delete: function (id) {
            return ajax.post('listing_types/delete', {
                id: id
            }, '', '');
        }
    }
});
app.factory("ListingSegment", function ($http, ajax, $q, $translate) {
    return {
        list: function (page, count) {
            var dt = {};
            dt.page = page;
            dt.count = count;
            return ajax.post('listing_segment', dt, null, '');
        },
        all: function() {
            return ajax.post('listing_segment', {}, null, '');
        },
        query: function (page, count, filters) {
            var dt = angular.isDefined(filters) ? filters : {};
            dt.page = page;
            dt.count = count;
            return ajax.post('listing_segment/query', dt, null, '');
        },
        insert: function (data) {
            return ajax.post('listing_segment/insert', data, '', '');
        },
        update: function (data) {
            return ajax.post('listing_segment/update', data, '', '');
        },
        delete: function (id) {
            return ajax.post('listing_segment/delete', {
                id: id
            }, '', '');
        }
    }
});

app.factory("Listing", function ($http, ajax, $q, $translate, toaster, Upload, $timeout) {
    return {
        query: function (page, count, filters) {
            var dt = angular.isDefined(filters) ? filters : {};
            dt.page = page;
            dt.count = count;
            return ajax.post('listings/query', dt, null, '');
        },
        get: function (id) {
            return ajax.post('listings/get/' + id, null, null, '');
        },
        getBy: function (id) {
            return ajax.post('listings/getBy/' + id, null, null, '');
        },
        insert: function (data) {
            return ajax.postFile('listings/insert', data, $translate.instant('listing.insert.msg_success'), '');
        },
        update: function (data) {
            return ajax.postFile('listings/update', data, $translate.instant('listing.update.msg_success'), '');
        },
        delete: function (id) {
            return ajax.post('listings/delete', {
                id: id
            }, $translate.instant('message.delete.msg_success'), '');
        },
        getListingsByUser: function(page, count, filters) {
            var dt = angular.isDefined(filters) ? filters : {};
            dt.page = page;
            dt.count = count;
            return ajax.post('listings/getListingsByUser', dt, null, '');
        }
    }
});

app.factory("ListingReserve", function ($http, ajax, $q, $translate, toaster, Upload, $timeout) {
    return {
        query: function (page, count, filters) {
            var dt = angular.isDefined(filters) ? filters : {};
            dt.page = page;
            dt.count = count;
            return ajax.post('listing_reserves/query', dt, null, '');
        },
        queryall: function (page, count, filters) {
            var dt = angular.isDefined(filters) ? filters : {};
            dt.page = page;
            dt.count = count;
            return ajax.post('listing_reserves/queryall', dt, null, '');
        },
        get: function (id) {
            return ajax.post('listing_reserves/get/' + id, null, null, '');
        },
        insert: function (data) {
            return ajax.postFile('listing_reserves/insert', data, null, '');
        },
        update: function (data, msg) {
            msg = msg ? $translate.instant(msg) : null;
            return ajax.postFile('listing_reserves/update', data, null, '');
        },
        updateSecond: function (data, msg) {
            msg = msg ? $translate.instant(msg) : null;
            return ajax.postFile('listing_reserves/updateSecond', data, null, '');
        },
        calification: function (data, msg) {
            msg = msg ? $translate.instant(msg) : null;
            return ajax.postFile('listing_reserves/sendCalification', data, null, '');
        },
        cancel: function (id) {
            var data = {
                id: id,
                status: 'cancelled'
            };
            return ajax.postFile('listing_reserves/update', data, null, '');
        },
        finish: function (id) {
            var data = {
                id: id,
                status: 'finish'
            };
            return ajax.postFile('listing_reserves/update', data, null, '');
        },
        start: function (id) {
            var data = {
                id: id,
                status: 'started'
            };
            return ajax.postFile('listing_reserves/update', data, null, '');
        },
        confirm: function (id) {
            var data = {
                id: id,
                status: 'confirmed'
            };
            return ajax.postFile('listing_reserves/update', data, null, '');
        },
        delete: function (id) {
            return ajax.post('listing_reserves/delete', {
                id: id
            }, $translate.instant('message.delete.msg_success'), '');
        }
    }
});

app.factory("ListingStopSale", function ($http, ajax, $q, $translate, toaster, Upload, $timeout) {
    return {
        query: function (page, count, filters) {
            var dt = angular.isDefined(filters) ? filters : {};
            dt.page = page;
            dt.count = count;
            return ajax.post('listing_stop_sales/query', dt, null, '');
        },
        queryDate: function (filters) {
            var dt = angular.isDefined(filters) ? filters : {};
            return ajax.post('listing_stop_sales/queryDate', dt);
        },
        insert: function (data) {
            return ajax.postFile('listing_stop_sales/insert', data, $translate.instant('listing_stop_sales.insert.msg_success'), '');
        },
        delete: function (id) {
            return ajax.post('listing_stop_sales/delete', {
                id: id
            }, $translate.instant('listing_stop_sales.delete.msg_success'), '');
        },
        deleteAll: function (filters) {
            var dt = angular.isDefined(filters) ? filters : {};
            return ajax.post('listing_stop_sales/deleteRange', dt,
                $translate.instant('listing_stop_sales.delete.msg_success'), '');
        }
    }
});

app.factory("ListingReview", function ($http, ajax, $q, $translate, toaster, Upload, $timeout) {
    return {
        query: function (page, count, filters) {
            var dt = angular.isDefined(filters) ? filters : {};
            dt.page = page;
            dt.count = count;
            return ajax.post('listing_reviews/query', dt, null, '');
        },
        get: function (id) {
            return ajax.post('listing_reviews/get/' + id, null, null, '');
        },
        insert: function (data) {
            return ajax.postFile('listing_reviews/insert', data, $translate.instant('listing_review.insert.msg_success'), '');
        },
        update: function (data) {
            return ajax.postFile('listing_reviews/update', data, $translate.instant('listing_review.update.msg_success'), '');
        },
        delete: function (id) {
            return ajax.post('listing_reviews/delete', {
                id: id
            }, $translate.instant('message.delete.msg_success'), '');
        }
    }
});

app.factory("ListingComment", function ($http, ajax, $q, $translate, toaster, Upload, $timeout) {
    return {
        query: function (page, count, filters) {
            var dt = angular.isDefined(filters) ? filters : {};
            dt.page = page;
            dt.count = count;
            return ajax.post('listing_comments/query', dt, null, '');
        },
        get: function (id) {
            return ajax.post('listing_comments/get/' + id, null, null, '');
        },
        insert: function (data) {
            return ajax.postFile('listing_comments/insert', data, $translate.instant('listing_comment.insert.msg_success'), '');
        },
        update: function (data) {
            return ajax.postFile('listing_comments/update', data, $translate.instant('listing_comment.update.msg_success'), '');
        },
        delete: function (id) {
            return ajax.post('listing_comments/delete', {
                id: id
            }, $translate.instant('message.delete.msg_success'), '');
        }
    }
});

app.factory("Service", function ($http, ajax, $q, $translate, toaster, Upload, $timeout) {
    return {
        list: function (page, count, filters) {
            var dt = angular.isDefined(filters) ? filters : {};
            dt.page = page;
            dt.count = count;
            return ajax.get('services', null, null, '');
        },
        query: function (page, count, filters) {
            var dt = angular.isDefined(filters) ? filters : {};
            dt.page = page;
            dt.count = count;
            return ajax.post('services/query', dt, null, '');
        },
        insert: function (data) {
            return ajax.postFile('services/insert', data, $translate.instant('service.insert.msg_success'), '');
        },
        update: function (data) {
            return ajax.post('services/update', data, $translate.instant('service.update.msg_success'), '');
        },
        delete: function (id) {
            return ajax.post('services/delete', {
                id: id
            }, $translate.instant('message.delete.msg_success'), '');
        }
    }
});

app.factory("Country", function ($http, ajax, $q) {
    return {
        list: function () {
            return ajax.post('countries/index', null, null, '');
        },
        cities: function (countryId) {
            return ajax.get('countries/cities/' + countryId, null, null, '');
        },
        timezones: function () {
            return ajax.get('countries/timezones', null, null, '');
        }
    }
});

app.factory("Coin", function ($http, ajax, $q) {
    return {
        list: function () {
            return ajax.post('coins/index', null, null, '');
        },
        calculate: function (base, convert, amount) {
            return ajax.post('coins/convert', {
                base: base,
                convert: convert,
                amount: amount
            }, null, '');
        }
    }
});

app.factory("CancelPrevCost", function ($http, ajax, $q, $translate) {
    return {
        list: function () {
            return ajax.get('cancel_prev_costs', null, null, '');
        }
    }
});

app.factory("CancelTotalCost", function ($http, ajax, $q, $translate) {
    return {
        list: function () {
            return ajax.get('cancel_total_costs', null, null, '');
        }
    }
});

app.factory("CancelTermn", function ($http, ajax, $q, $translate) {
    return {
        list: function () {
            return ajax.get('cancel_termns', null, null, '');
        }
    }
});

app.factory("Bank", function ($http, ajax, $q, $translate) {
    return {
        list: function () {
            return ajax.get('banks', null, null, '');
        }
    }
});

app.factory("PeriodPrice", function ($http, ajax, $q, $translate) {
    return {
        query: function (filters) {
            var dt = angular.isDefined(filters) ? filters : {};
            return ajax.post('Period_price/query', dt);
        },
        queryRooms: function (filters) {
            var dt = angular.isDefined(filters) ? filters : {};
            return ajax.post('Period_price/queryRooms', dt);
        },
        insert: function (data) {
            return ajax.postFile('period_price/insert', data, $translate.instant('price_period.insert.msg_success'), '');
        },
        update: function (data) {
            return ajax.postFile('period_price/update', data, $translate.instant('price_period.update.msg_success'), '');
        },
        delete: function (id) {
            return ajax.post('period_price/delete', {
                id: id
            }, $translate.instant('price_period.delete.msg_success'), '');
        }
    }
});
