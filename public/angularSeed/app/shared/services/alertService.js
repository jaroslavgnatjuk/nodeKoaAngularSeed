(function (angular) {
    angular
        .module('app')
        .factory('alertService', alertService);

    function alertService() {
        var alerts = [];

        function getAlerts() {
            return alerts;
        }

        function addAlert(type, msg) {
            alerts.push({
                type: type,
                msg: msg
            });
        }

        function closeAlert(index) {
            alerts.splice(index, 1);
        }

        return {
            addAlert: addAlert,
            closeAlert: closeAlert,
            getAlerts: getAlerts
        };
    }
})(angular);
