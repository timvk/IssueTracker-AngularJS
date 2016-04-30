'use strict';

angular.module('issueTrackerSystem.home', [
    'issueTracker.services.authentication',
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
        'identity',
        function HomeCtrl($scope, $location, userAuthentication, identity) {
            $scope.isAuthenticated = identity.isAuthenticated();

            $scope.login = function (user) {
                userAuthentication.loginUser(user)
                    .then(function (loggedData) {
                        console.log(loggedData.data.access_token);
                        sessionStorage.accessToken = loggedData.data.access_token;
                        $location.path('/');
                        //console.log($scope.isAuthenticated);
                    }, function (error) {
                        console.log(error);
                    })
            };

            $scope.register = function (user) {
                userAuthentication.registerUser(user)
                    .then(function(registeredData) {
                        console.log(registeredData);
                    },function(error) {
                        console.log(error);
                    })
            };

            $scope.logout = function () {
                userAuthentication.logoutUser()
                    .then(function() {

                    })
            };
        }]);