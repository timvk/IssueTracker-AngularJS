angular.module('issueTrackerSystem.services.users', [])
    .factory('users', [
        'BASE_URL',
        'requester',
        function (BASE_URL,requester) {

            function getUsersByFilter(filter) {
                return requester.get(BASE_URL + 'users/?filter=Username.Contains("' + filter + '")', true);
            }

            function getAllUsers() {
                return requester.get(BASE_URL + '/users', true);
            }

            return {
                getUsersByFilter: getUsersByFilter,
                getAllUsers: getAllUsers
            }
        }]);