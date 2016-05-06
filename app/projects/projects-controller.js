angular.module('issueTrackerSystem.projects', [])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/projects/add', {
                templateUrl: 'app/projects/add-project.html',
                controller: 'AddProjectCtrl'
            })
            .when('/projects/:projectId', {
                templateUrl: 'app/projects/project-page.html',
                controller: 'ProjectPageCtrl'
            })
            .when('/projects/', {
                templateUrl: 'app/projects/list-projects.html',
                controller: 'AllProjectsCtrl'
            })
            .when('/projects/:id/edit', {
                templateUrl: 'app/projects/edit-project.html',
                controller: 'EditProjectCtrl'
            });
    }])

    .controller('AddProjectCtrl', [
        '$scope',
        'projects',
        '$location',
        'users',
        'notify',
        function ($scope, projects, $location, users, notify) {

            $scope.useFilter = function () {
                users.getUsersByFilter($scope.project.UsernameFilter)
                    .then(function (response) {
                        $scope.users = response.data;
                        $scope.isVisible = true;
                    })
            };

            $scope.setLead = function(leadUsername) {
                $scope.project.UsernameFilter = leadUsername;
                $scope.isVisible = false;
            };

            $scope.addProject = function (project) {

                //TODO: think of a better way to do it
                var labels = project.labels.split(',');
                var priorities = project.priorities.split(',');

                var newProject = {
                    Name: project.Name,
                    ProjectKey: project.ProjectKey,
                    Description: project.Description,
                    LeadId: $scope.users[0].Id,
                    labels: [],
                    priorities: []
                };

                labels.forEach(function (l) {
                    newProject.labels.push({Name: l.trim()})
                });

                priorities.forEach(function (p) {
                    newProject.priorities.push({Name: p.trim()})
                });

                console.log(newProject);

                projects.addProject(newProject)
                    .then(function (response) {
                        console.log(response.data);
                        notify('You have successfully added a new project.');
                        $location.path('/');
                    }, function (error) {
                        console.log(error);
                    })
            }
        }
    ])
    .controller('ProjectPageCtrl', [
        '$scope',
        '$routeParams',
        'projects',
        'identity',
        'issues',
        function ProjectPageCrtl($scope, $routeParams, projects, identity, issues) {
            var projectId = $routeParams.projectId;

            projects.getProjectById(projectId)
                .then(function (response) {
                    $scope.project = response.data;
                    $scope.checkLeader = checkLeader;
                    console.log($scope.project);
                    issues.getIssuesByFilter('Project.Name', $scope.project.Name)
                        .then(function (response) {
                            $scope.issues = response.data.Issues;
                            $scope.totalCount = response.data.TotalCount;
                            $scope.totalPages = response.data.TotalPages;
                            $scope.maxSize = 8;
                            $scope.pagination = {
                                currentPage: 1,
                                pageSize: 3
                            };
                        }, function (error) {

                        });
                });

            $scope.pageChanged = function () {
                issues.getIssuesByFilter('Project.Name', $scope.project.Name, null, $scope.pagination.currentPage)
                    .then(function (response) {
                        $scope.issues = response.data.Issues;
                        console.log(response.data);
                    })
            };

            function checkLeader() {
                return $scope.project.Lead.Id == identity.getCurrentUser().userId || identity.isAdmin();
            }
        }
    ])

    .controller('AllProjectsCtrl', [
        '$scope',
        'projects',
        function AllProjectsCtrl($scope, projects) {

            $scope.pageChanged = function () {
                projects.getAllProjects(null, $scope.pagination.currentPage)
                    .then(function (response) {
                        $scope.projects = response.data.Projects;
                        console.log(response.data);
                    })
            };

            $scope.listAllProjects = projects.getAllProjects()
                .then(function (response) {
                    $scope.projects = response.data.Projects;
                    $scope.totalCount = response.data.TotalCount;
                    $scope.totalPages = response.data.TotalPages;
                    $scope.maxSize = 8;
                    $scope.pagination = {
                        currentPage: 1,
                        pageSize: 8
                    };
                })
        }
    ])

    .controller('EditProjectCtrl', [
        '$scope',
        '$routeParams',
        '$location',
        'projects',
        'users',
        'identity',
        'notify',
        function EditProjectCtrl($scope, $routeParams, $location, projects, users, identity, notify) {
            var projectId = $routeParams.id;

            $scope.useFilter = function () {
                users.getUsersByFilter($scope.projectToEdit.UsernameFilter)
                    .then(function (response) {
                        $scope.users = response.data;
                    })
            };

            projects.getProjectById(projectId)
                .then(function (response) {
                    $scope.labels = "";
                    $scope.priorities = "";

                    response.data.Labels.forEach(function (l) {
                        $scope.labels = $scope.labels + l.Name + ', '
                    });

                    response.data.Priorities.forEach(function (p) {
                        $scope.priorities = $scope.priorities + p.Name + ', '
                    });

                    $scope.project = response.data;
                });

            $scope.editProject = function (project, projectId) {

                //TODO: maybe move to a service
                var labels = project.labels.split(', ');
                var priorities = project.priorities.split(', ');

                var editProject = {
                    Name: project.Name,
                    Description: project.Description,
                    LeadId: $scope.users[0].Id,
                    labels: [],
                    priorities: []
                };

                labels.forEach(function (l) {
                    editProject.labels.push({Name: l})
                });

                priorities.forEach(function (p) {
                    editProject.priorities.push({Name: p})
                });

                projects.editProject(editProject, projectId)
                    .then(function (response) {
                        console.log(response.data);
                        notify('Project successfully edited.');
                        $location.path('/');
                    }, function (error) {

                    })
            };

            $scope.isAdmin = function () {
                return identity.isAdmin();
            }
        }
    ]);