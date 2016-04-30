angular.module('issueTrackerSystem.services.projects', [
    'issueTrackerSystem.common.requester'
])
    .factory('projects', [
        'requester',
        'BASE_URL',
        function (requester, BASE_URL) {

            function getProjectsByUser(userId) {
                //TODO: pageSize and pageNumber optional
                var url = BASE_URL + 'projects?filter=Lead.Id="' + userId + '"&pageSize=4&pageNumber=1';
                return requester.get(url, true);
            }

            function getProjectById(projectId) {
                return requester.get(BASE_URL + 'projects/' + projectId, true);
            }

            return {
                getProjectsByUser: getProjectsByUser,
                getProjectById: getProjectById
            }
        }]);