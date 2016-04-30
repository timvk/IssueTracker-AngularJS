angular.module('issueTrackerSystem.common.main', [
    'issueTrackerSystem.services.authentication',
    'issueTrackerSystem.services.identity'
])
    .controller('MainCtrl', [
        '$scope',
        'userAuthentication',
        'identity',
        '$location',
        function MainCtrl($scope, userAuthentication, identity, $location) {

            $scope.isAuthenticated = identity.isAuthenticated();

            if($scope.isAuthenticated) {
                $scope.currentUser = identity.getCurrentUser();
                $scope.isAdmin = $scope.currentUser.isAdmin;
                //console.log($scope.isAdmin);
            }

            //TODO: create actual route #/logout
            $scope.logout = function () {
                userAuthentication.logoutUser();
                $scope.isAuthenticated = false;
                $location.path('/');
            };
    }]);