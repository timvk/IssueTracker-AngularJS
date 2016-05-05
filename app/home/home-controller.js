'use strict';

angular.module('issueTrackerSystem.home', [])
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
        'notify',
        function HomeCtrl($scope, $location, userAuthentication, identity, projects, issues, notify) {
            $scope.isAuthenticated = identity.isAuthenticated();

            $scope.login = function (user) {
                userAuthentication.loginUser(user)
                    .then(function (loggedData) {
                        notify('You have successfully logged in.');
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
                                //location.reload();
                            });



                    }, function (error) {
                        console.log(error);
                    })
            };

            $scope.register = function (user) {
                userAuthentication.registerUser(user)
                    .then(function (response) {
                        notify('You have successfully registered.');
                        console.log(response);
                        //TODO: test register again
                        $scope.login(user);
                    }, function (error) {
                        console.log(error);
                    })
            };

            $scope.pageChanged = function() {
                issues.getIssuesByUser(null, $scope.pagination.currentPage)
                    .then(function (response) {
                        $scope.issues = response.data.Issues;
                    });
            };

            if ($scope.isAuthenticated) {
                getUsersProjects();
                getUsersIssues();
            }

            function getUsersProjects() {
                projects.getProjectsByLead(identity.getCurrentUser().userId)
                    .then(function (response) {
                        var projectsLead = response.data.Projects;
                        issues.getIssuesByUser()
                            .then(function (response) {
                                var projectIssues = [];
                                $scope.issues = response.data.Issues;
                                $scope.issues.forEach(function (i) {
                                    projectIssues.push(i.Project)
                                });
                                //console.log($scope.projectIssues);

                                $scope.projects = projects.getAffiliatedProjects(projectsLead, projectIssues);

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
                        console.log(response.data);
                        $scope.issues = response.data.Issues;
                        $scope.totalCount = response.data.Issues.length;
                        $scope.pagination = {
                            currentPage: 1,
                            pageSize: 2
                        };
                    }, function (error) {

                    })
            }
        }]);