'use strict';

angular.module('issueTrackerSystem.home', [
    'issueTrackerSystem.services.authentication',
    'issueTrackerSystem.services.identity'
])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/views/home.html',
            controller: 'HomeCtrl'
        });
    }])

    .controller('HomeCtrl', [
        '$scope',
        '$location',
        'userAuthentication',
        function HomeCtrl($scope, $location, userAuthentication) {

            $scope.login = function (user) {
                userAuthentication.loginUser(user)
                    .then(function (loggedData) {

                        sessionStorage.accessToken = loggedData.data.access_token;
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
                    .then(function (registeredData) {
                        console.log(registeredData);
                    }, function (error) {
                        console.log(error);
                    })
            };

            $scope.logout = function () {
                userAuthentication.logoutUser();
            };
        }]);