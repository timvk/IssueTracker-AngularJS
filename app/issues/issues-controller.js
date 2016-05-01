angular.module('issueTrackerSystem.issues', [])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/issues/:id', {
                template: 'app/issues/issue-page.html',
                controller: 'IssuePageCtrl'
            })
    }])
    .controller('IssuePageCtrl', [
        '$scope',
        function IssuePageCtrl($scope) {

        }
    ]);