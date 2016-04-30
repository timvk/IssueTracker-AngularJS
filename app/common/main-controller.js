angular.module('issueTrackerSystem.common.main', [
    'issueTrackerSystem.services.identity'
])
    .controller('MainCtrl', [
        '$scope',
        'identity',
        function MainCtrl($scope, identity) {

            $scope.isAuthenticated = identity.isAuthenticated();
            $scope.currentUser = JSON.parse(identity.getCurrentUser());

    }]);