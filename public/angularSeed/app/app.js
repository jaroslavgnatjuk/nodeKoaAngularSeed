(function (angular) {
    angular
        .module('app')
        .config([
            '$routeProvider',
            function ($routeProvider) {
                $routeProvider
                    .when('/', {
                        controller: 'mainCtrl',
                        controllerAs: 'main',
                        templateUrl: 'main/views/main.html'
                    })
                    .otherwise({
                        redirectTo: '/'
                    });
            }
        ]);

    angular
        .module('app')
        .config([
            '$httpProvider',
            function ($httpProvider) {
                $httpProvider.interceptors.push('spinnerInterceptor');
            }
        ]);
})(angular);
