angular.module('issueTrackerSystem.services.labels', [])
    .factory('labels', [
        'requester',
        'BASE_URL',
        function(requester, BASE_URL) {
            function getLabelByFilter(filter) {
                return requester.get(BASE_URL + 'labels/?filter=' + filter, true);
            }

            return {
                getLabelByFilter: getLabelByFilter
            }
        }
    ]);