var $globalscope;
function FetchCtrl($scope, $http, $templateCache) {
    $globalscope = $scope;
    $scope.method = 'GET';
    $scope.url = 'http://yousee.tv/rest/tvguide/nowandnext/API-Key/cMy34N4qFOUfq5WfesmvgiEdcC6PCyHa6JYqOMbq';
    $scope.epg = 'http://guide.netsi.dk/get.php?url=http://yousee.tv/feeds/tvguide/dailyjson/8/&mimeType=JSON&headers=';
    $scope.categories = [];
    $scope.catSort = ['c','s'];

    $scope.fetch = function() {
        $scope.code = null;
        $scope.response = null;
        $scope.excludeChannels = {'14':false, '11':false}

        // EPG
        $http({
            method: 'get',
            url: $scope.epg+'?random='+(new Date()-new Date(2014,1,1))
        }).
        success(function(data, status) {
            $scope.epg_status = status;
            $scope.epg_data = data;

            // Channels
            $http({
                method: $scope.method,
                url: $scope.url+'?random='+(new Date()-new Date(2014,1,1)),
                cache: $templateCache
            }).
            success(function(data, status) {
                data.now = $scope.customChannels(data.now);
                for(var i=0; i<data.now.length; i++) {
                    data.now[i].epg =  $scope.epg_data[data.now[i].channel];
                    var sCat = data.now[i].category_string+' - '+data.now[i].subcategory_string;
                    if (typeof $scope.categories[sCat]==='undefined') {
                        $scope.categories[sCat] = 1;
                        $scope.categories.push({c:data.now[i].category_string, s:data.now[i].subcategory_string});
                    }
                }
                $scope.status = status;
                $scope.data = data;
            }).
            error(function(data, status) {
                $scope.data = data || "Request failed";
                $scope.status = status;
            });
        }).
        error(function(data, status) {
            $scope.epg_data = data || "Request failed";
            $scope.epg_status = status;
        });



    };

    $scope.customChannels = function(dataNow) {
        var newData = [];
        for(var i=0; i<dataNow.length; i++) {
            if ($scope.excludeChannels[dataNow[i].channel]!==false) newData.push(dataNow[i]);
        }
        return newData;
    }

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


    $scope.setSort = function(sortBy) {
        if ($scope.predicate === sortBy) {
            $scope.reverse = !$scope.reverse;
        } else {
            $scope.predicate = sortBy;
        }
    }

    $scope.watch = function(schannel) {
        window.open('http://yousee.tv/livetv/' + schannel + '/');
    }

    $scope.isCat = function() {
        var bHit = true;
        if (bHit) {
            bHit =  (typeof $scope.cat==='undefined' || $scope.cat=='') ? true : arguments[0].category_string+' - '+arguments[0].subcategory_string===$scope.cat;
            if (bHit) {
                bHit = (typeof $scope.search==='undefined') ? true : (JSON.stringify(arguments[0]).toLowerCase().indexOf($scope.search.toLowerCase())>-1)
            }
        };
        return bHit;
    }

    $scope.updateModel = function(method, url) {
        $scope.method = method;
        $scope.url = url;
    };

    $scope.fetch();
    window.setInterval(function() {
        $scope.fetch();

    }, 60 * 1000);

    $scope.reverse = false;
    $scope.predicate = 'channel_info.name';
    $scope.filter = function(desc) {
        return desc;
    }
}

