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
            });
    }])

    .controller('AddProjectCtrl', [
        '$scope',
        'projects',
        function ($scope, projects) {

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
    ]);