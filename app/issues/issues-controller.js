angular.module('issueTrackerSystem.issues', [])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/issues/:issueId', {
                templateUrl: 'app/issues/issue-page.html',
                controller: 'IssuePageCtrl'
            })
    }])
    .controller('IssuePageCtrl', [
        '$scope',
        '$routeParams',
        'issues',
        'identity',
        function IssuePageCtrl($scope, $routeParams, issues, identity) {

            issues.getIssueById($routeParams.issueId)
                .then(function(response) {
                    console.log(response.data);
                    $scope.issue = response.data;
                    $scope.checkIfAuthorized = checkIfAssignee();
                    //console.log($scope.checkIfAuthorized)
                }, function(error) {
                    console.log(error);
                });

            function checkIfAssignee() {
                //TODO: test this
                return $scope.issue.Assignee.Id == identity.getCurrentUser().userId || $scope.issue.Assignee.isAdmin
            }
        }
    ]);