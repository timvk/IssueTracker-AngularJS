'use strict';

angular.module('issueTrackerSystem.home', [
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
        'issues',
        function HomeCtrl($scope, $location, userAuthentication, identity, projects, issues) {
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

            if ($scope.isAuthenticated) {
                getUsersProjects();
                getUsersIssues();
            }

            function getUsersProjects() {
                projects.getProjectsByLead(identity.getCurrentUser().userId)
                    .then(function (response) {
                        $scope.projectsLead = response.data.Projects;
                        //console.log($scope.projectsLead);
                        issues.getIssuesByUser()
                            .then(function (response) {
                                //console.log(response.data.Issues);
                                $scope.projectIssues = [];
                                $scope.issues = response.data.Issues;
                                $scope.issues.forEach(function(i){
                                    $scope.projectIssues.push(i.Project)
                                });
                                //console.log($scope.projectIssues);

                                $scope.projects = projects.getAffiliatedProjects($scope.projectsLead, $scope.projectIssues);

                            }, function (error) {
                                console.log(error);
                            })
                    }, function (error) {
                        console.log(error);
                    })
            }

            function getUsersIssues() {
                issues.getIssuesByUser()
                    .then(function (response) {
                        $scope.issues = response.data.Issues;
                    }, function (error) {

                    })
            }
        }]);