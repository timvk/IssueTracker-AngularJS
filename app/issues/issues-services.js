angular.module('issueTrackerSystem.services.issues', [
    'issueTrackerSystem.common.requester'
])
    .factory('issues', [
        'requester',
        'BASE_URL',
        function (requester, BASE_URL) {

            function getIssuesByUser(pageSize, pageNumber) {
                pageSize = pageSize || 4;
                pageNumber = pageNumber || 1;
                //TODO: deal with the pageSize and pageNumber
                return requester.get(BASE_URL + 'issues/me?orderBy=DueDate, IssueKey&pageSize=' + pageSize + '&pageNumber=' + pageNumber, true);
            }

            function getIssueById(issueId){
                return requester.get(BASE_URL + 'issues/' + issueId, true);
            }

            function addIssue(issue) {
                return requester.post(BASE_URL + 'issues/', issue, true);
            }

            function changeStatus(issueId, statusId, issue) {
                return requester.put(BASE_URL + 'issues/' + issueId + '/changestatus?statusid=' + statusId,issue, true);
            }

            function getIssuesByFilter(filter, filterValue, pageSize, pageNumber) {
                pageSize = pageSize || 3;
                pageNumber = pageNumber || 1;

                return requester.get(BASE_URL + 'issues/?filter='+ filter +'== "' + filterValue + '"&pageSize=' + pageSize + '&pageNumber=' + pageNumber, true);
            }

            return {
                getIssuesByUser: getIssuesByUser,
                getIssueById: getIssueById,
                addIssue: addIssue,
                changeStatus: changeStatus,
                getIssuesByFilter: getIssuesByFilter
            }
        }
    ]);