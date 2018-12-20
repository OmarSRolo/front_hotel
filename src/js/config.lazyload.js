// lazyload config

angular.module('app')
    /**
     * jQuery plugin config use ui-jq directive , config the js and css files that required
     * key: function name of the jQuery plugin
     * value: array of the css js file located
     */

.constant('JQ_CONFIG', {
    easyPieChart: ['site/libs/jquery/jquery.easy-pie-chart/dist/jquery.easypiechart.fill.js'],
    sparkline: ['site/libs/jquery/jquery.sparkline/dist/jquery.sparkline.retina.js'],
    plot: ['site/libs/jquery/flot/jquery.flot.js',
        'site/libs/jquery/flot/jquery.flot.pie.js',
        'site/libs/jquery/flot/jquery.flot.resize.js',
        'site/libs/jquery/flot.tooltip/js/jquery.flot.tooltip.min.js',
        'site/libs/jquery/flot.orderbars/js/jquery.flot.orderBars.js',
        'site/libs/jquery/flot-spline/js/jquery.flot.spline.min.js'
    ],
    screenfull: ['site/libs/jquery/screenfull/dist/screenfull.min.js'],
    slimScroll: ['site/libs/jquery/slimscroll/jquery.slimscroll.min.js'],
    sortable: ['site/libs/jquery/html5sortable/jquery.sortable.js'],
    nestable: ['site/libs/jquery/nestable/jquery.nestable.js',
        'site/libs/jquery/nestable/jquery.nestable.css'
    ],
    filestyle: ['site/libs/jquery/bootstrap-filestyle/src/bootstrap-filestyle.js'],
    slider: ['site/libs/jquery/bootstrap-slider/bootstrap-slider.js',
        'site/libs/jquery/bootstrap-slider/bootstrap-slider.css'
    ],
    chosen: ['site/libs/jquery/chosen/chosen.jquery.min.js',
        'site/libs/jquery/chosen/bootstrap-chosen.css'
    ],
    TouchSpin: ['site/libs/jquery/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js',
        'site/libs/jquery/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.css'
    ],
    wysiwyg: ['site/libs/jquery/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
        'site/libs/jquery/bootstrap-wysiwyg/external/jquery.hotkeys.js'
    ],
    dataTable: ['site/libs/jquery/datatables/media/js/jquery.dataTables.min.js',
        'site/libs/jquery/plugins/integration/bootstrap/3/dataTables.bootstrap.js',
        'site/libs/jquery/plugins/integration/bootstrap/3/dataTables.bootstrap.css'
    ],
    vectorMap: ['site/libs/jquery/bower-jvectormap/jquery-jvectormap-1.2.2.min.js',
        'site/libs/jquery/bower-jvectormap/jquery-jvectormap-world-mill-en.js',
        'site/libs/jquery/bower-jvectormap/jquery-jvectormap-us-aea-en.js',
        'site/libs/jquery/bower-jvectormap/jquery-jvectormap.css'
    ],
    footable: ['site/libs/jquery/footable/v3/js/footable.min.js',
        'site/libs/jquery/footable/v3/css/footable.bootstrap.min.css'
    ],
    fullcalendar: ['site/libs/jquery/moment/moment.js',
        'site/libs/jquery/fullcalendar/dist/fullcalendar.min.js',
        'site/libs/jquery/fullcalendar/dist/fullcalendar.css',
        'site/libs/jquery/fullcalendar/dist/fullcalendar.theme.css'
    ],
    daterangepicker: ['site/libs/jquery/moment/moment.js',
        'site/libs/jquery/bootstrap-daterangepicker/daterangepicker.js',
        'site/libs/jquery/bootstrap-daterangepicker/daterangepicker-bs3.css'
    ],
    tagsinput: ['site/libs/jquery/bootstrap-tagsinput/dist/bootstrap-tagsinput.js',
        'site/libs/jquery/bootstrap-tagsinput/dist/bootstrap-tagsinput.css'
    ]

})

.constant('MODULE_CONFIG', [{
    name: 'ngGrid',
    files: [
        'site/libs/angular/ng-grid/build/ng-grid.min.js',
        'site/libs/angular/ng-grid/ng-grid.min.css',
        'site/libs/angular/ng-grid/ng-grid.bootstrap.css'
    ]
}, {
    name: 'ui.grid',
    files: [
        'site/libs/angular/angular-ui-grid/ui-grid.min.js',
        'site/libs/angular/angular-ui-grid/ui-grid.min.css',
        'site/libs/angular/angular-ui-grid/ui-grid.bootstrap.css'
    ]
}, {
    name: 'ui.select',
    files: [
        'site/libs/angular/angular-ui-select/dist/select.min.js',
        'site/libs/angular/angular-ui-select/dist/select.min.css'
    ]
}, {
    name: 'angularFileUpload',
    files: [
        'site/libs/angular/angular-file-upload/angular-file-upload.js'
    ]
}, {
    name: 'ui.calendar',
    files: ['site/libs/angular/angular-ui-calendar/src/calendar.js']
}, {
    name: 'ngImgCrop',
    files: [
        'site/libs/angular/ngImgCrop/compile/minified/ng-img-crop.js',
        'site/libs/angular/ngImgCrop/compile/minified/ng-img-crop.css'
    ]
}, {
    name: 'angularBootstrapNavTree',
    files: [
        'site/libs/angular/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
        'site/libs/angular/angular-bootstrap-nav-tree/dist/abn_tree.css'
    ]
}, {
    name: 'vr.directives.slider',
    files: [
        'site/libs/angular/venturocket-angular-slider/build/angular-slider.min.js',
        'site/libs/angular/venturocket-angular-slider/build/angular-slider.css'
    ]
}, {
    name: 'com.2fdevs.videogular',
    files: [
        'site/libs/angular/videogular/videogular.min.js'
    ]
}, {
    name: 'com.2fdevs.videogular.plugins.controls',
    files: [
        'site/libs/angular/videogular-controls/controls.min.js'
    ]
}, {
    name: 'com.2fdevs.videogular.plugins.buffering',
    files: [
        'site/libs/angular/videogular-buffering/buffering.min.js'
    ]
}, {
    name: 'com.2fdevs.videogular.plugins.overlayplay',
    files: [
        'site/libs/angular/videogular-overlay-play/overlay-play.min.js'
    ]
}, {
    name: 'com.2fdevs.videogular.plugins.poster',
    files: [
        'site/libs/angular/videogular-poster/poster.min.js'
    ]
}, {
    name: 'com.2fdevs.videogular.plugins.imaads',
    files: [
        'site/libs/angular/videogular-ima-ads/ima-ads.min.js'
    ]
}, {
    name: 'info.vietnamcode.nampnq.videogular.plugins.youtube',
    files: [
        'site/libs/angular/videogular-youtube/youtube.js'
    ]
}, {
    name: 'xeditable',
    files: [
        'site/libs/angular/angular-xeditable/dist/js/xeditable.min.js',
        'site/libs/angular/angular-xeditable/dist/css/xeditable.css'
    ]
}, {
    name: 'smart-table',
    files: [
        'site/libs/angular/angular-smart-table/dist/smart-table.min.js'
    ]
}, {
    name: 'angular-skycons',
    files: [
        'site/libs/angular/angular-skycons/angular-skycons.js'
    ]
}]);

// oclazyload config

// .config(['$ocLazyLoadProvider', 'MODULE_CONFIG', function($ocLazyLoadProvider, MODULE_CONFIG) {
//     // We configure ocLazyLoad to use the lib script.js as the async loader
//     $ocLazyLoadProvider.config({
//         debug: false,
//         events: true,
//         modules: MODULE_CONFIG
//     });
// }]);
