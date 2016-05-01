angular.module('issueTrackerSystem.services.issues', [
    'issueTrackerSystem.common.requester'
])
    .factory('issues', [
        'requester',
        'BASE_URL',
        function (requester, BASE_URL) {

            function getIssuesByUser() {
                //TODO: deal with the pageSize and pageNumber
                return requester.get(BASE_URL + 'issues/me?orderBy=DueDate desc, IssueKey&pageSize=5&pageNumber=1', true);
            }

            return {
                getIssuesByUser: getIssuesByUser
            }
        }
    ]);