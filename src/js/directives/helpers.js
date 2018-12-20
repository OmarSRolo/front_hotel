app.directive('ldSmileCaret', function($translate, $uibModal) {

    return {
        restrict: 'A',
        scope: {
            model: '=ngModel'
        },
        require: 'ngModel',
        link: function(scope, element, attrs) {
            function getPos() {
                if ('selectionStart' in element[0]) {
                    return element[0].selectionStart;
                } else if (document.selection) {
                    element.focus();
                    var sel = document.selection.createRange();
                    var selLen = document.selection.createRange().text.length;
                    sel.moveStart('character', -element[0].value.length);
                    return sel.text.length - selLen;
                }
            }

            function setPos(caretPos) {
                if (element[0].createTextRange) {
                    var range = element[0].createTextRange();
                    range.move('character', caretPos);
                    range.select();
                } else {
                    element.focus();
                    if (element[0].selectionStart !== undefined) {
                        element[0].setSelectionRange(caretPos, caretPos);
                    }
                }
            }


            if (attrs.ldSmileCaret != '') {
                var btn = angular.element("[ld-smile-btn='" + attrs.ldSmileCaret + "']");
            } else {
                var btn = angular.element('<button type="button" ng-click="addSmile()">' +
                    '<i class="icon-emoticon-smile"></i>  ' +
                    $translate.instant("post.btn_insert_emotions") +
                    '</button> <br>');
                element.before(btn);
            }


            btn.on("click", function() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'site/src/views/app/posts/add_smile.html',
                    controller: function($scope, $uibModalInstance) {
                        $scope.push = function(smile) {
                            $uibModalInstance.close(smile);
                        };
                        $scope.close = function() {
                            $uibModalInstance.dismiss();
                        }

                    },
                    size: 'sm',
                    backdrop: 'static'
                });
                modalInstance.result.then(function(emo) {
                    scope.model = angular.isDefined(scope.model) ? scope.model : '';
                    var p = getPos();
                    var n = "";
                    if (p == 0) {
                        n = emo + scope.model;
                    } else {
                        var a, b;
                        a = scope.model.substring(0, p);
                        b = scope.model.substring(p, scope.model.length);

                        n = a + emo + b;
                        setPos(p + emo.length + 1);
                    }

                    scope.model = n;
                    //element.val(n);
                });
            })

        }
    };
});


app.directive('axDateSelect', function($translate, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            model: '=ngModel',
            class: '=initClass',
            placeholder: '=placeholder',
            readonly: '=ngReadonly'
        },
        require: 'ngModel',
        template: '<div><input class="form-control {{class}}"  placeholder="{{placeholder|translate}}"> <select class="ng-hide" style="height: 34px;;width: 28%">    </select>    <select class="ng-hide" style="height: 34px;;width: 28%">        </select>        <select class="ng-hide" style="height: 34px;width: 36%">        </select></div>',
        link: function(scope, element, attrs) {
            var initData = function() {
                var hideTime = function() {
                    /*$timeout(function () {
                     element.find("select").addClass('ng-hide');
                     element.find("input").removeClass('ng-hide');
                     }, 1000);*/
                };


                var optDays = "<option value=''>" + $translate.instant("common.date.calendar.label_day") + "</option>";
                for (var d = 1; d <= 31; d++) {
                    var parse = d > 9 ? d.toString() : "0" + d.toString();
                    var s = '';
                    if (parse == value.day) s = 'selected';
                    optDays += '<option value="' + parse + '" ' + s + '>' + parse + '</option>';
                }
                element.find("select:eq(0)").html(optDays);
                var optMonths = "<option value=''>" + $translate.instant("common.date.calendar.label_month") + "</option>";
                for (var d = 1; d <= 12; d++) {
                    var parse = d > 9 ? d.toString() : "0" + d.toString();
                    var s = '';
                    if (parse == value.month) s = 'selected';
                    optMonths += '<option value="' + parse + '" ' + s + '>' + $translate.instant("common.date.calendar.months." + d.toString()) + '</option>';
                }
                element.find("select:eq(1)").html(optMonths);
                var optYears = "<option value=''>" + $translate.instant("common.date.calendar.label_year") + "</option>";
                for (var d = 1950; d <= 2010; d++) {
                    var s = '';
                    if (d.toString() == value.year) s = 'selected';
                    optYears += '<option ' + s + '>' + d.toString() + '</option>';
                }
                element.find("select:eq(2)").html(optYears);


                element.find("select:eq(0)").on("change", function() {
                    value.day = element.find("select:eq(0)").val();
                    doVal()
                });

                element.find("select:eq(1)").on("change", function() {
                    value.month = element.find("select:eq(1)").val();
                    doVal()
                });

                element.find("select:eq(2)").on("change", function() {
                    value.year = element.find("select:eq(2)").val();
                    doVal()
                });

                element.find("input").bind("blur", function() {
                    element.find("select").removeClass('ng-hide');
                    element.find("input").addClass('ng-hide');
                    hideTime()
                });
                element.find("input").bind("focus", function() {
                    element.find("select").removeClass('ng-hide');
                    element.find("input").addClass('ng-hide');
                });
                element.find("input").bind("click", function() {
                    element.find("select").removeClass('ng-hide');
                    element.find("input").addClass('ng-hide');
                    hideTime()
                })
            };

            var value = {
                day: (angular.isDefined(scope.model) && scope.model.length > 0) ? scope.model.substr(8, 2) : '',
                month: (angular.isDefined(scope.model) && scope.model.length > 0) ? scope.model.substr(5, 2) : '',
                year: (angular.isDefined(scope.model) && scope.model.length > 0) ? scope.model.substr(0, 4) : ''
            };

            initData();


            scope.$watch(function() {
                return scope.model;
            }, function(val) {

                if (angular.isDefined(val) && val.length > 0) {
                    value.day = (angular.isDefined(val) && val.length > 0) ? val.substr(8, 2) : '';
                    value.month = (angular.isDefined(val) && val.length > 0) ? val.substr(5, 2) : '';
                    value.year = (angular.isDefined(val) && val.length > 0) ? val.substr(0, 4) : '';
                    initData();
                    element.find("select").removeClass('ng-hide');
                    element.find("input").addClass('ng-hide');
                }
            });

            scope.$watch(function() {
                return scope.readonly;
            }, function(v) {
                if (v) {
                    element.find("select").attr('disabled', '');
                } else {
                    element.find("select").removeAttr('disabled', '');
                }
            });

            var doVal = function() {
                scope.$apply(function() {
                    if (value.day.length != 0 && value.month.length != 0 && value.year.length != 0) {
                        scope.model = value.year + '-' + value.month + '-' + value.day;
                        //element.find("select").addClass('ng-hide');
                        //element.find("input").removeClass('ng-hide');
                    } else {
                        scope.model = '';
                        element.find("select").removeClass('ng-hide');
                        element.find("input").addClass('ng-hide');
                    }

                });
            }


        }
    }
});

app.directive('dmResize', function($window, $document) {

    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var r = (attrs.dmResize == '' || !angular.isDefined(attrs.dmResize)) ? 400 : attrs.dmResize;

            element.css('min-height', window.outerHeight - r + 'px');
            $window.onresize = function() {
                element.css('min-height', window.outerHeight - r + 'px');
            };
            $document.onresize = function() {
                element.css('min-height', window.outerHeight - r + 'px');
            };

        }
    };
});

app.factory('dateHelper', function() {
    return {
        dateTimeToMysql: function(jsDate) {
            if (typeof jsDate != 'object')
                return '';
            var month = parseInt(jsDate.getMonth()) + 1;
            month = month < 10 ? '0' + month : month;
            var fecha = jsDate.getFullYear() + '-' + month + '-' + ((jsDate.getDate() < 10) ? '0' + jsDate.getDate() : jsDate.getDate());
            return fecha;
        },
        dateMysqlToJsDate: function(myDate) {
            if (angular.isDate(myDate)) {
                return myDate;
            }
            var date = myDate.substring(0, 10);
            var year = myDate.substr(0, 4);
            var month = myDate.substr(5, 2);
            var day = myDate.substr(8, 2);
            var h = myDate.substr(11, 2);
            var m = myDate.substr(14, 2);
            var s = myDate.substr(17, 2);
            //var time = myDate.substring(11, 19);
            if (angular.isDefined(h)) {
                //var sDate = new Date(date.replace(/-/g, ',') + ',' + time);
                var sDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            } else {
                // var sDate = new Date(date.replace(/-/g, ','));
                var sDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            }

            return sDate;
        }

    }
});

app.factory('popQuestion', function($uibModal, $translate) {

    return {
        show: function(header, question) {
            var modalInstance = $uibModal.open({
                animation: true,
                windowClass: 'rotate-in',
                template: '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" ng-click="close()">&times;</button><h4 class="bigger"><i class="fa fa-question-circle"></i>  <span ng-bind-html="message.h"></span></h4></div><div class="modal-body"><p ng-bind-html="message.b"></p></div><div class="modal-footer"> <button class="btn btn-default" data-dismiss="modal" type="button" ng-click="close()"> <i class="fa fa-remove"></i>{{"common.btn_cancel"|translate}} </button> <button class="btn btn-default" type="button" ng-click="accept()"> <i class="fa fa-check"></i>{{"common.btn_accept"|translate}} </button> </div>',
                controller: function($scope, message, $uibModalInstance) {
                    $scope.message = message;
                    $scope.close = function() {
                        $uibModalInstance.dismiss();
                    };
                    $scope.accept = function() {
                        $uibModalInstance.close();
                    }
                },
                size: 'sm',
                backdrop: 'static',
                resolve: {
                    message: function() {
                        return {
                            h: header,
                            b: question
                        }
                    }
                }
            });
            return modalInstance.result;
        }
    }
});

app.directive('axNumber', function() {

    return {
        link: function(scope, element, attrs) {
            element.attr('style', 'text-align: right');
            element.val('0.00');
            element.bind('blur', function(event) {
                var v = element.val();
                if (v.indexOf('.') < 0) {
                    if (v.length != 0)
                        v += '.00';
                    else
                        v += '0.00';
                } else {
                    var rv = v.substring(v.indexOf('.') + 1);
                    switch (rv.length) {
                        case 0:
                            v += '00';
                            break;
                        case 1:
                            v += '0';
                            break;
                        case 2:
                            break;
                        default:
                            v = v.substring(0, v.indexOf('.') + 3);
                            break;
                    }
                }

                element.val(v);
            });
            element.bind('keypress', function(event) {
                if ((event.charCode < 46 || event.charCode > 58) && event.charCode != 0) {
                    event.preventDefault();
                }
            })
        }
    };
});

app.directive('axInteger', function() {

    return {
        link: function(scope, element, attrs) {
            element.attr('style', 'text-align: right');

            element.bind('blur', function(event) {
                var v = element.val();
                if (v == '') {
                    element.val(0);
                }
            });
            element.bind('keypress', function(event) {
                if ((event.charCode < 47 || event.charCode > 58) && event.charCode != 0) {
                    event.preventDefault();
                }
            })
        }
    };
});


app.directive('fileModel', ['$parse', 'toaster', function($parse, message) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {

            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(e) {
                if (attrs.onlyImages == 'true') {
                    if (element[0].files[0].name.substring(element[0].files[0].name.lastIndexOf('.')) != '.jpg' && element[0].files[0].name.substring(element[0].files[0].name.lastIndexOf('.')) != '.jpeg' && element[0].files[0].name.substring(element[0].files[0].name.lastIndexOf('.')) != '.png' && element[0].files[0].name.substring(element[0].files[0].name.lastIndexOf('.')) != '.gif' && element[0].files[0].name.substring(element[0].files[0].name.lastIndexOf('.')) != '.bmp') {
                        toaster.pop('error', 'File Error', "This field only accept files of type images(jpg,png)");
                        element.attr('is_valid', false);
                        return false;
                    } else {
                        element.attr('is_valid', true);
                    }
                }
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.directive('axImgReader', [function($parse, message) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.$watch(attrs.ngReference, function(newval) {
                if (File.prototype.isPrototypeOf(newval)) {
                    var r = new FileReader;
                    r.onload = function(e) {
                        element.attr('src', e.target.result);
                    }, r.readAsDataURL(newval);
                }
            });
        }
    };
}]);

//validators

app.directive('axMax', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {

            scope.$watch(attrs.ngModel, function(newval) {
                if (parseFloat(newval) > parseFloat(attrs.axMax)) {
                    ctrl.$setValidity('max', false);
                } else {
                    ctrl.$setValidity('max', true);
                }

            })
        }
    }
});

app.directive('axMin', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {

            scope.$watch(attrs.ngModel, function(newval) {
                if (parseFloat(newval) >= parseFloat(attrs.axMin)) {
                    ctrl.$setValidity('min', true);
                } else {
                    ctrl.$setValidity('min', false);
                }

            })
        }
    }
});

app.directive('axMinDate', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {

            scope.$watch(attrs.ngModel, function(newval) {
                newval.setSeconds(0);
                newval.setMinutes(0);
                var d = new Date(attrs.axMaxDate);
                d.setSeconds(0);
                d.setMinutes(0);
                if (newval >= d) {
                    ctrl.$setValidity('min', true);
                } else {
                    ctrl.$setValidity('min', false);
                }

            })
        }
    }
});

app.directive('axMaxDate', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {

            scope.$watch(attrs.ngModel, function(newval) {
                newval.setSeconds(0);
                newval.setMinutes(0);
                var d = new Date(attrs.axMaxDate);
                d.setSeconds(0);
                d.setMinutes(0);
                if (newval <= d) {
                    ctrl.$setValidity('max', true);
                } else {
                    ctrl.$setValidity('max', false);
                }

            })
        }
    }
});

app.directive('axEqual', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {

            if (attrs.axTriggerModels != null) {
                angular.forEach(eval(attrs.axTriggerModels), function(m) {
                    scope.$watch(m, function(newval) {
                        check(eval('scope.' + attrs.ngModel));
                    });
                });
            }

            scope.$watch(attrs.ngModel, function(newval) {
                check(newval);
            });

            function check(newval) {
                if (newval == attrs.axEqual) {
                    ctrl.$setValidity('equal', true);
                } else {
                    ctrl.$setValidity('equal', false);
                }
            }
        }
    }
});

app.directive('axTooltip', function() {
    return {
        link: function(scope, element, attrs) {
            element.tooltip({
                placement: angular.isDefined(attrs.tooltipPlace) ? attrs.tooltipPlace : 'left',
                title: attrs.axTooltip
            });
            /*scope.$watch(attrs.ngModel, function(newval) {
             if (newval >= attrs.axMax) {
             ctrl.$setValidity('max', true);
             } else {
             ctrl.$setValidity('max', false);
             }

             })*/
        }
    }
});

app.directive('axMultiple', function() {
    return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        scope: {
            source: '=axSource',
            text: '=axDisplay',
            id: '=axId',
            model: '=ngModel',
            placeholder: '=ngPlaceholder'
        },
        template: '<span class="dropdown" dropdown on-toggle=" ">' +
            '<a href class="btn btn-default dropdown-toggle" dropdown-toggle>' +
            '<span class="label label-info" style="margin-left: 1px" ng-repeat="s in model" ng-if="model.length>0">{{s[text]}}</span> ' +
            '<span ng-show="model==null || model.length==0" ng-bind="placeholder"></span> ' +
            '</a>' +
            '<ul class="dropdown-menu">' +
            ' <li ng-repeat="s in source"> ' +
            '<a class="" href  ng-click="select(s)">' +
            '<input type="checkbox"  ng-model="s.selected" > {{s[text]}}' +
            '</a>' +
            ' </li>' +
            '</ul>' +
            '</span>',
        link: function(scope, element, attrs) {
            scope.select = function(s) {
                s.selected = angular.isDefined(s.selected) ? !s.selected : true;
                if (!angular.isDefined(scope.model)) {
                    scope.model = [];
                }
                if (s.selected) {
                    scope.model.push(s);
                } else {
                    var cp = [];
                    angular.forEach(scope.model, function(item) {
                        if (item[scope.id] != s[scope.id]) {
                            cp.push(item);
                        }
                    });
                    scope.model = cp;
                }

            };
            angular.forEach(scope.model, function(mItem, mI) {
                angular.forEach(scope.source, function(item, i) {
                    if (mItem[scope.id] == item[scope.id]) {
                        item.selected = true;
                    }
                })
            })
        }
    }
});


app.directive('axHtmlEditor', function() {
    return {
        restrict: 'E',
        replace: true,
        link: function(scope, element, attrs) {
            //document.append('<script type="text/javascript">alert("ello")</script>');
            angular.element('body').append('<script src="' + content_url('content/admin/tiny_mce/tiny_mce.js') + '"></script>');

            tinyMCE.init({
                // General options
                mode: "textareas",
                theme: "advanced",
                plugins: "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount,advlist,autosave,visualblocks",
                // Theme options
                theme_advanced_buttons1: "newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
                theme_advanced_buttons2: "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
                theme_advanced_buttons3: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
                theme_advanced_buttons4: "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak,restoredraft,visualblocks",
                theme_advanced_toolbar_location: "top",
                theme_advanced_toolbar_align: "left",
                theme_advanced_statusbar_location: "bottom",
                theme_advanced_resizing: true,
                // Example content CSS (should be your site CSS)
                content_css: "css/content.css",
                // Drop lists for link/image/media/template dialogs
                template_external_list_url: "lists/template_list.js",
                external_link_list_url: "lists/link_list.js",
                external_image_list_url: "lists/image_list.js",
                media_external_list_url: "lists/media_list.js",
                // Style formats
                style_formats: [{
                    title: 'Bold text',
                    inline: 'b'
                }, {
                    title: 'Red text',
                    inline: 'span',
                    styles: {
                        color: '#ff0000'
                    }
                }, {
                    title: 'Red header',
                    block: 'h1',
                    styles: {
                        color: '#ff0000'
                    }
                }, {
                    title: 'Example 1',
                    inline: 'span',
                    classes: 'example1'
                }, {
                    title: 'Example 2',
                    inline: 'span',
                    classes: 'example2'
                }, {
                    title: 'Table styles'
                }, {
                    title: 'Table row 1',
                    selector: 'tr',
                    classes: 'tablerow1'
                }],
                /*setup: function (ed) {
                 ed.onChange.add(function (ed, b) {
                 scope.mod = b.content;
                 //alert(scope.ngModel);
                 });
                 ed.onKeyPress.add(function (ed, b) {
                 //alert('aa');
                 });
                 },*/
                // Replace values for the template plugin
                template_replace_values: {
                    username: "Some User",
                    staffid: "991234"
                }
            });

            /*scope.$watch(function () {
             return scope.mod;
             }, function (newValue, oldValue) {
             if(!angular.isDefined(newValue) || newValue ==''){
             ;
             }
             //alert('as');
             var x = 0;
             });*/
        }
    }
});

app.directive('axDatePicker', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.datepicker();
        }
    }
});


app.directive('axSpinner', ['$http', '$rootScope', '$uibModal', function($http, $rootScope) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            path: '=path'
        },
        template: '<div class="message-loading-overlay-spinner"><img src="{{path}}" style="width: 250px"></img></div>',
        link: function(scope, elm, attrs) {

            scope.isLoading = function() {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function(loading) {
                if (loading && (!angular.isDefined($rootScope.customSpinner) || $rootScope.customSpinner == null)) {
                    !$rootScope.hideAjaxRequest && elm.removeClass('ng-hide');
                } else {
                    elm.addClass('ng-hide');
                }
            });
        }
    };
}]);

app.directive('axSpinnerCustom', ['$http', '$rootScope', '$uibModal', function($http, $rootScope) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            path: '=path'
        },
        template: '<div class="message-loading-overlay-spinner-custom"><img src="{{path}}" style="width: 70px"></img></div>',
        link: function(scope, elm, attrs) {
            elm.parent().css('position', 'relative');
            scope.isLoading = function() {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function(loading) {
                if (loading && (angular.isDefined($rootScope.customSpinner) && $rootScope.customSpinner == attrs.customName)) {
                    !$rootScope.hideAjaxRequest && elm.removeClass('ng-hide');
                    $rootScope.customSpinner = null;
                } else {
                    elm.addClass('ng-hide');
                }
            });
        }
    };
}]);


app.directive('axInputFileStyle', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var p = element.filestyle({
                'classButton': attrs.dataClassButton,
                'classInput': attrs.dataClassInput,
                'classIcon': attrs.dataClassIcon,
                'placeholder': attrs.placeholder
            });

            scope.$watch(attrs.fileModel, function(n) {
                if (!n) {
                    element.parent().find('.bootstrap-filestyle input').val('');
                    //element.remove();
                    /*element.filestyle({
                     'classButton': attrs.dataClassButton,
                     'classInput': attrs.dataClassInput,
                     'classIcon': attrs.dataClassIcon
                     })*/

                }
            })
        }
    }
});

app.directive('axRateO', ['$parse', function($parse) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            model: '=ngModel'
        },
        template: '<span></span>',
        link: function(scope, element, attrs) {
            var fill = function(v) {
                var partInt = parseInt(v);
                element.html('<span></span>');
                for (var i = 0; i < partInt; i++) {
                    element.append('<i class="fa fa-2x fa-star"></i>');
                }
                var t = 0;
                if (scope.model > partInt + 0.5) {
                    element.append('<i class="fa fa-2x fa-star-half-empty"></i>');
                    t++;
                }
                for (var i = 0; i < 5 - partInt - t; i++) {
                    element.append('<i class="fa fa-2x fa-star-o"></i>');
                }
            };

            scope.model = scope.model != null ? scope.model : 0;
            fill(scope.model);
            scope.$watch(function() {
                return scope.model;
            }, function(a, b) {
                fill(scope.model);
            })
        }
    }
}]);

app.directive('axRate', ['$parse', function($parse) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            model: '=ngModel'
        },
        template: '<span></span>',
        link: function(scope, element, attrs) {
            var fill = function(v) {
                var partInt = parseInt(v);
                element.html('<span></span>');
                for (var i = 0; i < partInt; i++) {
                    element.append('<i class="fa fa-star"></i>');
                }
                var t = 0;
                if (scope.model > partInt + 0.5) {
                    element.append('<i class="fa fa-star-o"></i>');
                    t++;
                }
                for (var i = 0; i < 5 - partInt - t; i++) {
                    element.append('<i class="fa fa-star-o"></i>');
                }

            };

            scope.model = scope.model != null ? scope.model : 0;
            fill(scope.model);
            scope.$watch(function() {
                return scope.model;
            }, function(a, b) {
                fill(scope.model);
            })


        }
    }
}]);

app.directive('axAutoScroll', function($uiViewScroll) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $uiViewScroll(element.parent());
        }
    }
});

app.directive('axItemScroll', function($uiViewScroll) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $uiViewScroll(element);
        }
    }
});

app.directive('axAdjustImg', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var parent = element.parent();
            element.attr("style", "width:" + parent.width() + "px;height:" + parent.width() + "px");
        }
    }
});
app.directive('pageSelect', function() {
    return {
        restrict: 'E',
        template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
        link: function(scope, element, attrs) {
            scope.$watch('currentPage', function(c) {
                scope.inputPage = c;
            });
        }
    }
});
app.directive('axFormValid', ['$parse', function($parse) {
    return {
        restrict: 'A',
        require: 'form',
        priority: -100,
        compile: function() {
            return {
                pre: function preLink(scope, elem, attrs) {

                },
                post: function postLink(scope, elem, attrs, formCtrl) {
                    elem.bind('submit', function(e) {
                        if (formCtrl.$invalid) {
                            e.stopImmediatePropagation();
                            scope.$broadcast('submit');
                        }
                    });
                }
            };
        }
    };
}]);

app.directive('axValid', ['$parse', '$compile', '$translate', function($parse, $compile, $translate) {
    return {
        require: ['ngModel'],
        restrict: 'A',
        compile: function() {
            return function postLink(scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0];
                var msgElements = angular.element('<label class="error">Este campo es obligatorio.</label>');
                    //$compile(msgElements)(scope);
                $compile(msgElements)(scope).addClass('ng-hide');
                /*if (attrs.axValid == 'parent') {
                 element.parent().append(msgElements);
                 }
                 else if (attrs.axValid == 'next') {
                 element.next().after(msgElements);
                 } else {
                 element.after(msgElements);
                 }*/
                element.parent().append(msgElements);


                msgElements.addClass(attrs.axValidCss);


                var renderMessage = function(isSubmit) {
                    !angular.isDefined(isSubmit) && (isSubmit = false);
                    msgElements.addClass('ng-hide');

                    if (ngModelCtrl.$error.required == true) {
                        msgElements.html('<i class="fa fa-warning"></i>' + $translate.instant('message.validation.empty'));
                    }
                    if (ngModelCtrl.$error.max == true) {
                        msgElements.html('<i class="fa fa-warning"></i> ' + $translate.instant('message.validation.min') + ' ' + attrs.max);
                    }
                    if (ngModelCtrl.$error.min == true) {
                        msgElements.html('<i class="fa fa-warning"></i>' + $translate.instant('message.validation.max') + ' ' + attrs.min);
                    }
                    if (ngModelCtrl.$error.equal == true) {
                        msgElements.html('<i class="fa fa-warning"></i>' + $translate.instant('message.validation.equal') + ' ' + attrs.axMin);
                    }
                    if (ngModelCtrl.$error.email == true) {
                        msgElements.html('<i class="fa fa-warning"></i>' + $translate.instant('message.validation.email'));
                    }
                    if (ngModelCtrl.$error.url == true) {
                        msgElements.html('<i class="fa fa-warning"></i>' + $translate.instant('message.validation.url'));
                    }

                    !ngModelCtrl.$valid && (ngModelCtrl.$dirty || isSubmit) && msgElements.removeClass('ng-hide');
                };


                element.parents('form').on('submit', function(f, a) {
                    renderMessage(true);
                });
                element.parents('form').find('button[type="submit"]').on('click', function(f, a) {
                    renderMessage(true);
                });
                scope.$watch(function() {
                    return ngModelCtrl.$error.required;
                }, function(isValid, wasValid) {
                    renderMessage();
                });
                scope.$watch(function() {
                    return ngModelCtrl.$error.max;
                }, function(isValid, wasValid) {
                    renderMessage();
                });
                scope.$watch(function() {
                    return ngModelCtrl.$error.min;
                }, function(isValid, wasValid) {
                    renderMessage();
                });
                scope.$watch(function() {
                    return ngModelCtrl.$error.email;
                }, function(isValid, wasValid) {
                    renderMessage();
                });
                scope.$watch(function() {
                    return ngModelCtrl.$error.url;
                }, function(isValid, wasValid) {
                    renderMessage();
                });
            }
        }
    }
}]);
