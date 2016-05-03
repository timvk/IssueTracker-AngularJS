'use strict';

angular.module('issueTrackerSystem', [
    'ngRoute',
    'issueTrackerSystem.common.requester',
    'issueTrackerSystem.common.main',
    'issueTrackerSystem.home',
    'issueTrackerSystem.services.authentication',
    'issueTrackerSystem.services.identity',
    'issueTrackerSystem.services.labels',
    'issueTrackerSystem.projects',
    'issueTrackerSystem.issues',
    'issueTrackerSystem.services.projects',
    'issueTrackerSystem.services.issues',
    'issueTrackerSystem.services.users',
    'angular-loading-bar'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
    }])
    .constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/');
