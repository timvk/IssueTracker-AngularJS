angular.module('issueTrackerSystem.services.projects', [
    'issueTrackerSystem.common.requester'
])
    .factory('projects', [
        'requester',
        'BASE_URL',
        'issues',
        function (requester, BASE_URL) {

            function getProjectsByLead(userId) {
                //TODO: pageSize and pageNumber optional
                var url = BASE_URL + 'projects?filter=Lead.Id="' + userId + '"&pageSize=8&pageNumber=1';
                return requester.get(url, true);
            }

            function getProjectById(projectId) {
                return requester.get(BASE_URL + 'projects/' + projectId, true);
            }

            function getAllProjects() {
                return requester.get(BASE_URL + 'projects?filter=&pageSize=8&pageNumber=1', true);
            }

            function addProject(project) {
                return requester.post(BASE_URL + 'projects', project, true);
            }

            return {
                getProjectsByLead: getProjectsByLead,
                getProjectById: getProjectById,
                getAllProjects: getAllProjects,
                addProject: addProject
            }
        }]);