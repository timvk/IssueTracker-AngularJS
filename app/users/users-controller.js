angular.module('issueTrackerSystem.users', [])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/profile/password', {
                templateUrl: 'app/users/change-password.html',
                controller: 'ChangePasswordCtrl',
                resolve: {
                    access: ['$location', 'identity', 'notify', function($location, identity, notify){
                        if(!identity.isAuthenticated()){
                            $location.path('/');
                            notify({message: 'Only logged users can access this page.', classes: 'red-message'});
                        }
                    }]
                }
            })
    }])
    .controller('ChangePasswordCtrl', [
        '$scope',
        '$location',
        'users',
        'notify',
        function ChangePasswordCtrl($scope, $location, users, notify) {
            $scope.changePassword = function(password) {
                users.changePassword(password)
                    .then(function(response) {
                        console.log(response.data);
                        notify('Password changed!');
                        $location.path('/');
                    })
            }
        }
    ]);