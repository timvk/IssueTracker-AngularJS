angular.module('issueTrackerSystem.projects.addProject', [])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/projects/add', {
            templateUrl: 'app/projects/add-project.html',
            controller: 'AddProjectCtrl'
        });
    }])

    .controller('AddProjectCtrl', [
        '$scope',
        function ($scope) {
            $scope.seeProject = function(project) {
                console.log(project);
            }
        }


    ]);