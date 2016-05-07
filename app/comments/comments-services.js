angular.module('issueTrackerSystem.services.comments', [])
    .factory('comments', [
        'requester',
        'BASE_URL',
        function(requester, BASE_URL) {
            function getCommentsForIssue(issueId) {
                return requester.get(BASE_URL + 'issues/' + issueId + '/comments', true);
            }

            function addCommentToIssue(comment, issueId) {
                return requester.post(BASE_URL + 'issues/' + issueId + '/comments', comment, true);
            }

            return {
                getCommentsForIssue: getCommentsForIssue,
                addCommentToIssue: addCommentToIssue
            }
        }
    ]);
