'use strict';

angular.module('IssueTrackerSystem.home', ['IssueTracker.services.authentication'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/views/home.html',
            controller: 'HomeCtrl'
        });
    }])

    .controller('HomeCtrl', [
        '$scope',
        'userAuthentication'
        , function ($scope, userAuthentication) {
            $scope.login = function (user) {

                userAuthentication.loginUser(user)
                    .then(function (loggedData) {
                        console.log(loggedData);
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
        }]);