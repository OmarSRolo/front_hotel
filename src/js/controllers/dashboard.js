'use strict';

app.controller('DashboardCtr', ['$scope', '$rootScope', 'MessagesFunc', 'SocialFunc', 'NgTableParams', 'Post', '$state', 'FriendFunc', 'Notification', '$translate', function($scope, $rootScope, MessagesFunc, SocialFunc, NgTableParams, Post, $state, FriendFunc, Notification, $translate) {
    $scope.video = {
        theme: {
            url: ""
        },
        plugins: {
            controls: {
                autoHide: true,
                autoHideTime: 5000
            }
        }
    };

    $scope.tablePosts = new NgTableParams({
        page: 1,
        count: 10,
        sorting: {
            name: 'asc'
        },
        filter: {
            post_type: (angular.isDefined($state.params.post_type) && $state.params.post_type != '') ? $translate.instant('post.post_type_url_rev.' + $state.params.post_type) : 0
        },
    }, {
        counts: [10],
        paginationMaxBlocks: 9,
        count: 10,
        total: 0,
        getData: function($defer, params) {
            Post.filter(params.page(), params.count(), {
                post_type: params.filter().post_type != null ? params.filter().post_type : '',
            }).success(function(r) {
                params.total(r.data.total);
                /*angular.forEach(r.data.data, function (d) {
                    if (d.video != '') {
                        d.video = {
                            sources: [
                                {src: d.video},
                            ]
                        };
                    }
                })*/
                $defer.resolve(r.data.data);
                $scope.tablePosts.initiated = true;
            })
        }
    });
    $scope.tablePosts.initiated = false;

    FriendFunc.getRequests().success(function(r) {
        $scope.friendRequests = r.data.data;
    });

    $scope.openRequest = function(id) {
        FriendFunc.openRequest(id).then(function() {
            FriendFunc.getRequests().success(function(r) {
                $scope.friendRequests = r.data.data;
            })
        })
    };

    MessagesFunc.reloadThreads(1, 5).then(function(r) {
        $rootScope.messages.threadsTop = r;
    })
}]);
