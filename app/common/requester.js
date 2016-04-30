angular.module('issueTrackerSystem.common.requester', [])
    .factory('requester', [
        '$http',
        '$q',
        function ($http, $q) {

            function getItem(url, useSession) {
                var headers = getHeaders.call(this, false, useSession);
                return makeRequest('GET', url, headers, null);
            }

            function postItem(url, data, useSession) {
                var headers = getHeaders.call(this, data, useSession);
                return makeRequest('POST', url, headers, data);
            }

            function putItem(url, data, useSession) {
                var headers = getHeaders.call(this, data, useSession);
                return makeRequest('PUT', url, headers, data);
            }

            function deleteItem(url, useSession) {
                var headers = getHeaders.call(this, false, useSession);
                return makeRequest('DELETE', url, headers, null);
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

            function getHeaders(isJSON, useSession) {
                var headers = {},
                    token;

                if (isJSON) {
                    headers['Content-Type'] = 'application/json';
                }

                if (useSession) {
                    token = sessionStorage.accessToken;
                    headers['Authorization'] = 'Bearer ' + token;
                }

                return headers;
            }

            return {
                get: getItem,
                post: postItem,
                put: putItem,
                delete: deleteItem
            }
        }]);