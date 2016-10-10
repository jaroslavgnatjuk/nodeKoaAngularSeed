(function (angular) {
    angular
        .module('app')
        .controller('bodyCtrl', bodyCtrl);

    bodyCtrl.$inject = ['alertService'];

    function bodyCtrl(alertService) {
        var self = this;

        self.alerts = alertService.getAlerts();

        self.closeAlert = function (index) {
            alertService.closeAlert(index);
        };
    }
})
(angular);
