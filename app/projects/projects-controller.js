angular.module('issueTrackerSystem.projects', [])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/projects/add', {
                templateUrl: 'app/projects/add-project.html',
                controller: 'AddProjectCtrl',
                resolve: {
                    access: ['$location', 'identity', 'notify', function ($location, identity, notify) {
                        if (!identity.isAuthenticated() || !identity.getCurrentUser().isAdmin) {
                            notify({message: 'Only admins can access this page.', classes: 'red-message'});
                            $location.path('/');
                        }
                    }]
                }
            })
            .when('/projects/:projectId', {
                templateUrl: 'app/projects/project-page.html',
                controller: 'ProjectPageCtrl',
                resolve: {
                    access: ['$location', 'identity', 'notify', function ($location, identity, notify) {
                        if (!identity.isAuthenticated()) {
                            notify({message: 'Only logged users can access this page.', classes: 'red-message'});
                            $location.path('/');
                        }
                    }]
                }
            })
            .when('/projects/', {
                templateUrl: 'app/projects/list-projects.html',
                controller: 'AllProjectsCtrl',
                resolve: {
                    access: ['$location', 'identity', 'notify', function ($location, identity, notify) {
                        if (!identity.isAuthenticated() || !identity.getCurrentUser().isAdmin) {
                            notify({message: 'Only admins can access this page.', classes: 'red-message'});
                            $location.path('/');
                        }
                    }]
                }
            })
            .when('/projects/:id/edit', {
                templateUrl: 'app/projects/edit-project.html',
                controller: 'EditProjectCtrl',
                resolve: {
                    access: ['$location', 'identity', 'notify','$route', 'projects',
                        function ($location, identity, notify, $route, projects) {
                            if (!identity.isAuthenticated()) {
                                notify({message: 'Only logged users can access this page.', classes: 'red-message'});
                                $location.path('/');
                            }

                            var project = projects.getProjectById($route.current.params.id)
                                .then(function(project){
                                    var currentUser = identity.getCurrentUser();
                                    if(currentUser.userId != project.data.Lead.Id && !identity.isAdmin()){
                                        notify({message: 'Only project lead or an administrator allowed', classes: 'red-message'});
                                        $location.path('/');
                                    }
                                });
                        }]
                }
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

            $scope.setLead = function (leadUsername) {
                $scope.project.UsernameFilter = leadUsername;
                $scope.isVisible = false;
            };

            $scope.addProject = function (project) {
                users.getUsersByFilter($scope.project.UsernameFilter)
                    .then(function (response) {
                        $scope.user = response.data;
                        var labels = project.labels.split(',');
                        var priorities = project.priorities.split(',');

                        var newProject = {
                            Name: project.Name,
                            ProjectKey: project.ProjectKey,
                            Description: project.Description,
                            LeadId: $scope.user[0].Id,
                            labels: [],
                            priorities: []
                        };

                        labels.forEach(function (l) {
                            newProject.labels.push({Name: l.trim()})
                        });

                        priorities.forEach(function (p) {
                            newProject.priorities.push({Name: p.trim()})
                        });

                        projects.addProject(newProject)
                            .then(function (response) {
                                notify('You have successfully added a new project.');
                                $location.path('/');
                            }, function (error) {
                                notify({message: 'Cannot add project.', classes: 'red-message'});
                            })
                    });
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

            projects.getProjectById(projectId)
                .then(function (response) {
                    var labels = "";
                    var priorities = "";

                    response.data.Labels.forEach(function (l) {
                        labels = labels + l.Name + ', '
                    });
                    response.data.Priorities.forEach(function (p) {
                        priorities = priorities + p.Name + ', '
                    });

                    $scope.project = response.data;
                    $scope.project.labels = labels;
                    $scope.project.priorities = priorities;
                });

            $scope.editProject = function (project, projectId) {

                //TODO: maybe move to a service
                var labels = project.labels.split(', ');
                var priorities = project.priorities.split(', ');

                var editProject = {
                    Name: project.Name,
                    Description: project.Description,
                    LeadId: $scope.project.Lead.Id,
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
                        notify({message: 'Cannot edit project.', classes: 'red-message'});
                    })
            };

            $scope.isAdmin = function () {
                return identity.isAdmin();
            }
        }
    ]);