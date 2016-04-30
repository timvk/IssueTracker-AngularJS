angular.module('issueTrackerSystem.requester', [])
    .factory('requester', [
        '$http',
        '$q',
        function ($http, $q) {

            function getItem(url) {
                return makeRequest('GET', url, {headers: { 'Authorization': sessionStorage.accessToken }});
            }

            function postItem(url, data) {
                return makeRequest('POST', url, {headers: { 'Authorization': sessionStorage.accessToken }},data);
            }

            function putItem(url, data) {
                return makeRequest('PUT', url, {headers: { 'Authorization': sessionStorage.accessToken }},data);
            }

            function deleteItem(url) {
                return makeRequest('DELETE', url, {headers: { 'Authorization': sessionStorage.accessToken }});
            }

            function makeRequest(method, url, headers, data) {
                var defer = $q.defer();

                $http({
                    method: method,
                    url: url,
                    headers: headers,
                    data: data
                }).
                    then(function (data) {
                        defer.resolve(data);
                    },
                    function (error) {
                        defer.reject(error);
                    })
                ;

                return defer.promise;
            }

            return {
                get: getItem,
                post: postItem,
                put: putItem,
                delete: deleteItem
            }
        }]);