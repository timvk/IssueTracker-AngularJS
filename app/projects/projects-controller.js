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
        function ($scope, projects, $location) {

            $scope.addProject = function(project){

                //TODO: think of a better way to do it
                var labels = project.labels.split(', ');
                var priorities = project.priorities.split(', ');

                var newProject = {
                    Name: project.Name,
                    ProjectKey: project.ProjectKey,
                    Description: project.Description,
                    LeadId: project.LeadId,
                    labels: [],
                    priorities: []
                };

                labels.forEach(function(l) {
                    newProject.labels.push({Name: l})
                });

                priorities.forEach(function(p) {
                    newProject.priorities.push({Name: p})
                });

                console.log(newProject);

                projects.addProject(newProject)
                    .then(function(response) {
                        console.log(response.data);
                        $location.path('/');
                    }, function(error) {
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
        function ProjectPageCrtl($scope, $routeParams, projects, identity) {
            var projectId = $routeParams.projectId;

            projects.getProjectById(projectId)
                .then(function (response) {
                    $scope.project = response.data;
                    $scope.checkLeader = checkLeader;
                    console.log($scope.project);
                    projects.getProjectsIssues($scope.project.Id)
                        .then(function(response) {
                            $scope.issues = response.data;
                            console.log(response.data);
                        }, function(error) {

                        });
                    //console.log(response.data);
                });

            function checkLeader() {
                return $scope.project.Lead.Id == identity.getCurrentUser().userId;
            }
        }
    ])

    .controller('AllProjectsCtrl', [
        '$scope',
        'projects',
        function AllProjectsCtrl($scope, projects) {

            $scope.listAllProjects = projects.getAllProjects()
                .then(function(response) {
                    $scope.projects = response.data.Projects;
                    console.log(response.data);
                })
        }
    ])

    .controller('EditProjectCtrl', [
        '$scope',
        '$routeParams',
        '$location',
        'projects',
        function EditProjectCtrl($scope, $routeParams, $location, projects) {
            var projectId = $routeParams.id;

            projects.getProjectById(projectId)
                .then(function(response) {
                    $scope.labels = "";
                    $scope.priorities = "";

                    response.data.Labels.forEach(function(l) {
                        $scope.labels = $scope.labels + l.Name + ', '
                    });

                    response.data.Priorities.forEach(function(p) {
                        $scope.priorities = $scope.priorities + p.Name + ', '
                    });

                    $scope.project = response.data;
                });

            $scope.editProject = function(project, projectId) {

                //TODO: maybe move to a service
                var labels = project.labels.split(', ');
                var priorities = project.priorities.split(', ');

                var editProject = {
                    Name: project.Name,
                    Description: project.Description,
                    LeadId: project.LeadId,
                    labels: [],
                    priorities: []
                };

                labels.forEach(function(l) {
                    editProject.labels.push({Name: l})
                });

                priorities.forEach(function(p) {
                    editProject.priorities.push({Name: p})
                });

                projects.editProject(editProject, projectId)
                    .then(function (response){
                        console.log(response.data);
                        $location.path('/');
                    },function(error) {

                    })
            }
        }
    ]);