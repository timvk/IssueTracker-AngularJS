angular.module('issueTrackerSystem.common.main', [
    'issueTrackerSystem.services.authentication',
    'issueTrackerSystem.services.identity'
])
    .controller('MainCtrl', [
        '$scope',
        'userAuthentication',
        'identity',
        '$location',
        'notify',
        function MainCtrl($scope, userAuthentication, identity, $location, notify) {

            $scope.isAuthenticated = identity.isAuthenticated();

            if($scope.isAuthenticated) {
                $scope.currentUser = identity.getCurrentUser();
                $scope.isAdmin = $scope.currentUser.isAdmin;
            }

            $scope.logout = function () {
                userAuthentication.logoutUser();
                notify('You have successfully logged out.');
                $scope.isAuthenticated = false;
                $location.path('/');
            };
    }]);