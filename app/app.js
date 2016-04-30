'use strict';

angular.module('issueTrackerSystem', [
    'ngRoute',
    'issueTrackerSystem.home'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
    }])
    .constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/');