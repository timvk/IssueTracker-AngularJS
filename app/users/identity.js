angular.module('issueTrackerSystem.services.identity', [])
    .factory('identity', [function() {

        function getCurrentUser() {
            return JSON.parse(sessionStorage.currentUser);
        }

        function isAuthenticated() {
            return !!sessionStorage.accessToken;
        }

        function isAdmin() {
            return JSON.parse(sessionStorage.currentUser).isAdmin;
        }

        return {
            getCurrentUser: getCurrentUser,
            isAuthenticated:  isAuthenticated,
            isAdmin: isAdmin
        }
    }]);