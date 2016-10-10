(function (angular) {
    angular.module('app')
        .service('spinnerService', spinnerService);

    spinnerService.$inject = ['usSpinnerService', '$timeout'];

    function spinnerService(usSpinnerService, $timeout) {
        var spinnerStatus = 0,
            spinnerName = 'spinner-1',
            recentTap = false;

        function start() {
            $timeout(function () {
                if (!spinnerStatus) {
                    usSpinnerService.spin(spinnerName);
                }

                spinnerStatus++;
            });
        }

        function stop() {
            spinnerStatus--;

            if (spinnerStatus === 0) {
                usSpinnerService.stop(spinnerName);
            }
        }

        function execWithDelay(callback, delay) {
            if (!recentTap) {
                recentTap = true;
                start();
                $timeout(function () {
                    callback();

                    recentTap = false;
                    stop();
                }, delay);
            }
        }

        return {
            start: start,
            stop: stop,
            execWithDelay: execWithDelay
        };
    }
})(angular);
