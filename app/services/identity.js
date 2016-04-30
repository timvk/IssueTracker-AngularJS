angular.module('issueTrackerSystem.services.identity', [])
    .factory('identity', [function() {

        function getCurrentUser() {
            return sessionStorage.currentUser;
        }

        function isAuthenticated() {
            return !!sessionStorage.accessToken;
        }

        return {
            getCurrentUser: getCurrentUser,
            isAuthenticated:  isAuthenticated
        }
    }]);