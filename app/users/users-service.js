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

            function changePassword(data) {
                return requester.post(BASE_URL + 'api/Account/ChangePassword', data, true);
            }

            return {
                getUsersByFilter: getUsersByFilter,
                getAllUsers: getAllUsers,
                changePassword: changePassword
            }
        }]);