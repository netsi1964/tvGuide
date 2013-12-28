function FetchCtrl($scope, $http, $templateCache) {
    $scope.method = 'GET';
    $scope.url = 'http://yousee.tv/rest/tvguide/nowandnext/API-Key/cMy34N4qFOUfq5WfesmvgiEdcC6PCyHa6JYqOMbq';
    $scope.fetch = function() {
        $scope.code = null;
        $scope.response = null;

        $http({
            method: $scope.method,
            url: $scope.url,
            cache: $templateCache
        }).
        success(function(data, status) {
            $scope.status = status;
            $scope.data = data;
        }).
        error(function(data, status) {
            $scope.data = data || "Request failed";
            $scope.status = status;
        });
    };

    $scope.progress = function(sStart, sEnd) {
        var from = parseInt(sStart.replace(/\./g, ''));
        var toEnd = parseInt(sEnd.replace(/\./g, ''));
        var duration = toEnd - from;
        var now = new Date();
        var iMin = now.getMinutes();
        iMin = ((iMin < 10) ? '0' : '') + '' + iMin
        now = parseInt(now.getHours() + '' + iMin);
        var sLeft = toEnd - now;
        return 100 - (sLeft / duration * 100);

    }



    $scope.watch = function(schannel) {
        window.open('http://yousee.tv/livetv/' + schannel + '/');
    }

    $scope.updateModel = function(method, url) {
        $scope.method = method;
        $scope.url = url;
    };

    $scope.fetch();
    window.setInterval(function() {
        $scope.fetch();
        alert('fetching')
    }, 60 * 1000);

    $scope.predicate = 'channel_info.name';
    $scope.filter = function(desc) {
        return desc;
    }
}