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
            });
    }])

    .controller('AddProjectCtrl', [
        '$scope',
        function ($scope) {
            $scope.seeProject = function (project) {
                console.log(project);
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
    ]);