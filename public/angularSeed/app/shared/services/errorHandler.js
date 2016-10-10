(function (angular) {
    angular
        .module('app')
        .factory('errorHandlerService', errorHandlerService);

    function errorHandlerService() {
        function errorHandler(resp) {
            console.log('error', resp);
        }

        return {
            errorHandler: errorHandler
        };
    }
})(angular);
