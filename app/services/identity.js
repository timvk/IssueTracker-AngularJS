angular.module('issueTrackerSystem.services.identity', [])
    .factory('identity', [function() {

        function getCurrentUser() {

        }

        function isAuthenticated() {
            return sessionStorage.accessToken;
        }

        return {
            getCurrentUser: getCurrentUser,
            isAuthenticated:  isAuthenticated
        }
    }]);