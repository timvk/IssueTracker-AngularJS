'use strict';

angular.module('IssueTrackerSystem', [
    'ngRoute',
    'IssueTrackerSystem.home'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
    }])
    .constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/');
