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
        '$route',
        function HomeCtrl($scope, $location, userAuthentication, identity, projects, issues, notify, $route) {
            $scope.isAuthenticated = identity.isAuthenticated();
            $scope.identity = identity;

            $scope.login = function (user) {
                userAuthentication.loginUser(user)
                    .then(function (loggedData) {
                        notify('You have successfully logged in.');
                        sessionStorage.accessToken = loggedData.data.access_token;

                        userAuthentication.getCurrentUser()
                            .then(function (response) {
                                var currentUser = {
                                    userId: response.data.Id,
                                    username: response.data.Username,
                                    isAdmin: response.data.isAdmin
                                };
                                sessionStorage.currentUser = JSON.stringify(currentUser);
                                $location.path('/');
                                //$route.reload();
                                location.reload();
                            });
                    }, function (error) {
                        notify({message: 'Invalid credentials.', classes: 'red-message'});
                    })
            };

            $scope.register = function (user) {
                userAuthentication.registerUser(user)
                    .then(function (response) {
                        notify('You have successfully registered.');
                        $scope.login(user);
                    }, function (error) {
                        notify({message: 'Invalid credentials.', classes: 'red-message'});
                    })
            };

            $scope.pageChanged = function () {
                issues.getIssuesByUser(null, $scope.pagination.currentPage)
                    .then(function (response) {
                        $scope.issues = response.data.Issues;
                    });
            };

            if ($scope.identity.isAuthenticated()) {
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
                                $scope.projects = projects.getAffiliatedProjects(projectsLead, projectIssues);

                            }, function (error) {
                            })
                    }, function (error) {
                        console.log(error);
                    })
            }

            function getUsersIssues() {
                issues.getIssuesByUser()
                    .then(function (response) {
                        $scope.issues = response.data.Issues;
                        $scope.totalCount = response.data.TotalCount;
                        $scope.totalPages = response.data.TotalPages;
                        $scope.pagination = {
                            currentPage: 1,
                            pageSize: 4
                        };
                    }, function (error) {

                    })
            }
        }]);