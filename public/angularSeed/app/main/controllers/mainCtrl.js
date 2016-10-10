(function (angular) {
    angular
        .module('app')
        .controller('mainCtrl', mainCtrl);

    mainCtrl.$inject = ['authService'];

    function mainCtrl(authService) {
        let main = this;

        authService.auth().then(ldap => console.log(ldap));
    }
})(angular);
