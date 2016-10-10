(function (angular) {
    angular
        .module('app')
        .factory('httpService', httpService);

    httpService.$inject = ['$http'];

    function httpService($http) {
        return {
            getTable: getTable
        };

        function getTable(procId, tableName, checkId) {
            return $http({
                method: 'GET',
                url: 'api/getTable'
            });
        }
    }
})(angular);
