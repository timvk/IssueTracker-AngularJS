angular.module('IssueTracker.services.authentication', [])
    .factory('userAuthentication', [
        '$http',
        '$q',
        'BASE_URL',
        function ($http, $q, BASE_URL) {

            function registerUser(user) {
                var deferred = $q.defer();

                $http.post(BASE_URL + 'api/Account/Register', user)
                    .then(function (data) {
                        deferred.resolve(data);
                    }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }

            function loginUser(user) {
                var deferred = $q.defer();

                var data = 'grant_type=password&username=' + user.email + '&password=' + user.password;

                $http.post(BASE_URL + 'api/Token', data, {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
                    .then(function (data) {
                        deferred.resolve(data);
                    }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }

            return {
                registerUser: registerUser,
                loginUser: loginUser
            }
        }]);