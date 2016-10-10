(function (angular) {
    angular
        .module('app')
        .factory('authService', authService);

    authService.$inject = ['$http', '$q'];

    function authService($http, $q) {
        var ldapLogin,
            ldapPromise;

        function getLdap() {
            return ldapLogin;
        }

        function checkLogin() {
            if (ldapLogin.toUpperCase() === 'DN310770DNL' ||
                ldapLogin.toUpperCase() === 'DN230387TJI' ||
                ldapLogin.toUpperCase() === 'DD160585GIA' ||
                ldapLogin.toUpperCase() === 'DN170678DIA' ||
                ldapLogin.toUpperCase() === 'DN221264KIL' ||
                ldapLogin.toUpperCase() === 'DN280186MSA' ||
                ldapLogin.toUpperCase() === 'DN280884KLA' ||
                ldapLogin.toUpperCase() === 'IT050682GJJ' ||
                ldapLogin.toUpperCase() === 'DN100985TMA') {
                return true;
            } else {
                return false;
            }
        }

        function auth() {
            if (ldapPromise) {
                return ldapPromise;
            }

            ldapPromise = $http({
                method: 'GET',
                url: 'api/getLdap'
            })
                .then(function (resp) {
                    ldapLogin = resp.data;

                    if (!ldapLogin) {
                        alertService.addAlert('danger', 'Не удалось получить лдап логин');
                    }

                    return ldapLogin;
                });

            return ldapPromise;
        }

        return {
            getLdap: getLdap,
            auth: auth,
            checkLogin: checkLogin
        };
    }
})(angular);
