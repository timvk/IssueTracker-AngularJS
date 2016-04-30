'use strict';

angular.module('issueTrackerSystem', [
    'ngRoute',
    'issueTrackerSystem.common.requester',
    'issueTrackerSystem.common.main',
    'issueTrackerSystem.home',
    'issueTrackerSystem.services.identity',
    'issueTrackerSystem.projects',
    'issueTrackerSystem.services.projects',
    'angular-loading-bar'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
    }])
    .constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/');
