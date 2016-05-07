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
            .when('/issues/:id/edit', {
                templateUrl: 'app/issues/edit-issue.html',
                controller: 'EditIssueCtrl'
            })
    }])
    .controller('IssuePageCtrl', [
        '$scope',
        '$routeParams',
        'issues',
        'identity',
        'projects',
        '$location',
        function IssuePageCtrl($scope, $routeParams, issues, identity, projects, $location) {

            issues.getIssueById($routeParams.issueId)
                .then(function (response) {
                    $scope.issue = response.data;
                    $scope.checkIfAuthorized = checkIfAssignee();

                    var projectId = $scope.issue.Project.Id;
                    projects.getProjectById(projectId)
                        .then(function (response) {
                            $scope.LeaderId = response.data.Lead.Id;
                            $scope.checkLeader = $scope.LeaderId ==
                            identity.getCurrentUser().userId || identity.isAdmin();
                            //$scope.issue.Assignee.Id == identity.getCurrentUser().userId ||
                        });

                }, function (error) {
                    console.log(error);
                });

            function checkIfAssignee() {
                return $scope.issue.Assignee.Id == identity.getCurrentUser().userId || identity.isAdmin();
            }

            $scope.changeStatus = function (issueId, statusId) {
                issues.changeStatus(issueId, statusId, $scope.issue)
                    .then(function (response) {
                        $location.path('/issues/' + issueId);
                        notify('You have successfully changed the status.');
                    });
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
        '$location',
        'notify',
        function AddIssueCtrl($scope, $routeParams, issues, identity, projects, users, labels, $location, notify) {
            var projectId = $routeParams.projectId;

            projects.getProjectById(projectId)
                .then(function (response) {
                    $scope.project = response.data;
                });

            $scope.useFilter = function () {
                users.getUsersByFilter($scope.issue.AssigneeFilter)
                    .then(function (response) {
                        $scope.users = response.data;
                        $scope.isVisible = true;
                    })
            };

            $scope.setAssignee = function (assigneeUsername) {
                $scope.issue.AssigneeFilter = assigneeUsername;
                $scope.isVisible = false;
            };

            $scope.labelsArr = [];

            $scope.useLabelFilter = function () {
                if ($scope.issue.labelFilter) {
                    $scope.inputLabels = $scope.issue.labelFilter.split(',');
                    var lastLabel = $scope.inputLabels[$scope.inputLabels.length - 1].trim();

                    labels.getLabelByFilter(lastLabel)
                        .then(function (response) {
                            $scope.labels = response.data;
                            $scope.isLabelsVisible = true;

                            if (!$scope.issue.labelFilter) {
                                clearLabels($scope.labelsArr);
                            }
                        })
                } else {
                    clearLabels($scope.labelsArr);
                }
            };

            $scope.setLabels = function (label) {
                $scope.labelsArr.push(label);
                $scope.issue.labelFilter = $scope.labelsArr.join(', ');
                $scope.isLabelsVisible = false;
            };

            $scope.addIssue = function (issue) {
                var newIssue = {
                    Title: issue.Title,
                    Description: issue.Description,
                    DueDate: issue.DueDate,
                    ProjectId: projectId,
                    AssigneeId: $scope.users[0].Id,
                    PriorityId: issue.PriorityId,
                    Labels: []
                };

                $scope.inputLabels.forEach(function (l) {
                    newIssue.Labels.push({Name: l});
                });

                issues.addIssue(newIssue)
                    .then(function (response) {
                        $location.path('/projects/' + projectId);
                        notify('You have successfully added a new issue.');
                    }, function(error) {
                        notify({message: 'Cannot ass issue.', classes: 'red-message'});
                    })
            };

            function clearLabels(arr) {
                arr = [];
                $scope.isLabelsVisible = false;
            }
        }
    ])
    .controller('EditIssueCtrl', [
        '$scope',
        '$routeParams',
        'issues',
        'identity',
        'projects',
        'users',
        'labels',
        '$location',
        'notify',
        function EditIssueCtrl($scope, $routeParams, issues, identity, projects, users, labels, $location, notify) {
            var issueId = $routeParams.id;

            issues.getIssueById(issueId)
                .then(function(response) {
                    $scope.issue = response.data;
                    $scope.issue.DueDate = "";
                    projects.getProjectById($scope.issue.Project.Id)
                        .then(function(response) {
                            $scope.project = response.data;
                            $scope.canChangeLead = identity.getCurrentUser().userId == $scope.project.Lead.Id || identity.isAdmin();
                        });
                }, function(error) {

                });

            //TODO: move to a service
            $scope.useFilter = function () {
                users.getUsersByFilter($scope.issue.AssigneeFilter)
                    .then(function (response) {
                        $scope.users = response.data;
                        $scope.isVisible = true;
                    })
            };

            $scope.setAssignee = function (assigneeUsername) {
                $scope.issue.AssigneeFilter = assigneeUsername;
                $scope.isVisible = false;
            };

            var labelsArr = [];

            $scope.useLabelFilter = function () {
                if ($scope.issue.labelFilter) {
                    $scope.inputLabels = $scope.issue.labelFilter.split(',');
                    var lastLabel = $scope.inputLabels[$scope.inputLabels.length - 1].trim();

                    labels.getLabelByFilter(lastLabel)
                        .then(function (response) {
                            $scope.labels = response.data;
                            $scope.isLabelsVisible = true;

                            if (!$scope.issue.labelFilter) {
                                clearLabels(labelsArr);
                            }
                        })
                } else {
                    clearLabels(labelsArr);
                }
            };

            $scope.setLabels = function (label) {
                labelsArr.push(label);
                $scope.issue.labelFilter = labelsArr.join(', ');
                $scope.isLabelsVisible = false;
            };

            function clearLabels(arr) {
                arr = [];
                $scope.isLabelsVisible = false;
            }

            $scope.editIssue = function(editted) {
                editted.AssigneeId = $scope.users[0].Id;
                editted.Labels = [];
                $scope.inputLabels.forEach(function(l){
                    editted.Labels.push({Name: l})
                });

                issues.editIssue(editted, issueId)
                    .then(function(response) {
                        $location.path('/issues/' + issueId);
                        notify('You have successfully edited the issue.');
                    })
            }
        }
    ]);