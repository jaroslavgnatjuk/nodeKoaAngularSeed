(function (angular) {
    angular
        .module('app')
        .factory('spinnerInterceptor', spinnerInterceptor);

    spinnerInterceptor.$inject = ['$q', 'spinnerService', '$timeout'];

    function spinnerInterceptor($q, spinnerService, $timeout) {
        return {
            request: function (config) {
                spinnerService.start();

                return config || $q.when(config);
            },
            response: function (response) {
                return $timeout(
                    function () {
                        spinnerService.stop();

                        return response || $q.when(response);
                    }, 0);
            },
            requestError: function (rejection) {
                spinnerService.stop();

                return $q.reject(rejection);
            },
            responseError: function (rejection) {
                spinnerService.stop();

                return $q.reject(rejection);
            }
        };
    }
})(angular);
