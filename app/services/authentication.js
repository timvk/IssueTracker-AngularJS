angular.module('issueTracker.services.authentication', [
    'issueTrackerSystem.requester'
])
    .factory('userAuthentication', [
        '$http',
        '$q',
        'BASE_URL',
        'requester',
        function ($http, $q, BASE_URL, requester) {

            function registerUser(user) {
                return requester.post(BASE_URL + 'api/Account/Register', user);
            }

            function loginUser(user) {
                var data = 'grant_type=password&username=' + user.email + '&password=' + user.password;

                return requester.post(BASE_URL + 'api/Token', data, {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
            }

            function logoutUser() {
                return requester.post(BASE_URL + 'api/Account/Logout', null)
            }

            return {
                registerUser: registerUser,
                loginUser: loginUser,
                logoutUser: logoutUser
            }
        }]);