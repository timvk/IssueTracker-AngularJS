'use strict';

angular.module('issueTrackerSystem', [
    'ngRoute',
    'issueTrackerSystem.common.requester',
    'issueTrackerSystem.common.main',
    'issueTrackerSystem.home',
    'issueTrackerSystem.projects.addProject',
    'issueTrackerSystem.services.projects',
    'angular-loading-bar'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
    }])
    .constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/');
