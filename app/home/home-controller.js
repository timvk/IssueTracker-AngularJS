'use strict';

angular.module('issueTrackerSystem.home', [
    'issueTrackerSystem.services.authentication',
    'issueTrackerSystem.services.identity'
])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/home/home.html',
            controller: 'HomeCtrl'
        });
    }])

    .controller('HomeCtrl', [
        '$scope',
        '$location',
        'userAuthentication',
        'identity',
        'projects',
        function HomeCtrl($scope, $location, userAuthentication, identity, projects) {
            $scope.isAuthenticated = identity.isAuthenticated();

            $scope.login = function (user) {
                userAuthentication.loginUser(user)
                    .then(function (loggedData) {
                        sessionStorage.accessToken = loggedData.data.access_token;
                        $scope.isAuthenticated = true;
                        $location.path('/');
                        userAuthentication.getCurrentUser()
                            .then(function (response) {
                                var currentUser = {
                                    userId: response.data.Id,
                                    username: response.data.Username,
                                    isAdmin: response.data.isAdmin
                                };

                                sessionStorage.currentUser = JSON.stringify(currentUser);
                            });
                    }, function (error) {
                        console.log(error);
                    })
            };

            $scope.register = function (user) {
                userAuthentication.registerUser(user)
                    .then(function (response) {
                        console.log(response);
                        //TODO: test register again
                        $scope.login(user);
                    }, function (error) {
                        console.log(error);
                    })
            };

            if($scope.isAuthenticated) {
                getUsersProjects();
            }

            function getUsersProjects() {
                //.log(identity.getCurrentUser());
                projects.getProjectsByUser(identity.getCurrentUser().userId)
                    .then(function(response) {
                        console.log(response.data.Projects);
                        $scope.projects = response.data.Projects;
                    }, function(error) {

                    })
            }

        }]);