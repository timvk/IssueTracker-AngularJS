angular.module('issueTrackerSystem.issues', [])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/issues/:issueId', {
                templateUrl: 'app/issues/issue-page.html',
                controller: 'IssuePageCtrl'
            })
            .when('/projects/:projectId/add-issue', {
                templateUrl: 'app/issues/add-issue.html',
                controller: 'AddIssueCtrl'
            })
    }])
    .controller('IssuePageCtrl', [
        '$scope',
        '$routeParams',
        'issues',
        'identity',
        'projects',
        function IssuePageCtrl($scope, $routeParams, issues, identity, projects) {

            issues.getIssueById($routeParams.issueId)
                .then(function (response) {
                    $scope.issue = response.data;
                    $scope.checkIfAuthorized = checkIfAssignee();

                    var projectId = $scope.issue.Project.Id;
                    projects.getProjectById(projectId)
                        .then(function (response) {
                            $scope.LeaderId = response.data.Lead.Id;
                            //console.log($scope.LeaderId);
                            //console.log(identity.getCurrentUser().userId);
                            $scope.checkLeader = $scope.LeaderId == identity.getCurrentUser().userId;
                        });

                }, function (error) {
                    console.log(error);
                });

            function checkIfAssignee() {
                //TODO: test this
                return $scope.issue.Assignee.Id == identity.getCurrentUser().userId || $scope.issue.Assignee.isAdmin
            }
        }
    ])
    .controller('AddIssueCtrl', [
        '$scope',
        '$routeParams',
        'issues',
        'identity',
        'projects',
        'users',
        'labels',
        function AddIssueCtrl($scope, $routeParams, issues, identity, projects, users, labels) {
            var projectId = $routeParams.projectId;

            projects.getProjectById(projectId)
                .then(function(response) {
                    console.log(response.data);
                    $scope.project = response.data;
                });

            $scope.useFilter = function() {
                users.getUsersByFilter($scope.issue.LeadFilter)
                    .then(function(response) {
                        //console.log(response.data);
                        $scope.users = response.data;
                    })
            };

            $scope.useLabelFilter = function() {
                labels.getLabelByFilter($scope.issue.labelFilter)
                    .then(function(response) {
                        //console.log(response.data);
                        $scope.labels = response.data;
                    })
            }
        }
    ]);