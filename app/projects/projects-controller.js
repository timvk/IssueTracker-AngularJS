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
            .when('/projects/:projectId/edit', {
                templateUrl: 'app/projects/edit-project.html',
                controller: 'EditProjectCtrl'
            });
    }])

    .controller('AddProjectCtrl', [
        '$scope',
        function ($scope) {

            $scope.addProject = function(project){
                var labels = project.labels.split(', ');
                var priorities = project.priorities.split(', ');

                console.log(project);
                //projects.addProject(project)
                //    .then(function(response) {
                //        console.log(response);
                //    }, function(error) {
                //        console.log(error);
                //    })
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
                }, function (error) {
                    console.log(error)
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
                }, function(error) {
                    console.log(error);
                })
        }
    ])

    .controller('EditProjectCtrl', [
        '$scope',
        '$routeParams',
        'projects',
        function EditProjectCtrl($scope, $routeParams, projects) {

            projects.getProjectById($routeParams.projectId)
                .then(function(response) {
                    var labels = [];
                    var priorities = [];

                    console.log(response.data);
                    $scope.project = response.data;
                }, function(error) {

                });

            $scope.editProject = function() {

            }
        }
    ]);