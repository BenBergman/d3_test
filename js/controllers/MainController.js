app.controller("MainController", ["$scope", "$uibModal", "$filter", "$http", function($scope, $uibModal, $filter, $http) {
    $http.jsonp("http://www.geoplugin.net/json.gp?jsoncallback=JSON_CALLBACK")
        .success(function(data, status, headers, config) {
            $scope.usersRegion = data.geoplugin_regionName;
            if ($scope.regions.indexOf($scope.usersRegion) >= 0) {
                $scope.currentRegion = $scope.usersRegion;
            } else {
                $scope.usersRegion = "no_region_match";
                $scope.currentRegion = $scope.defaultRegion;
            }
        })
        .error(function() {
            $scope.usersRegion = "geoip_error";
            if ($scope.defaultRegion != null) {
                $scope.currentRegion = $scope.defaultRegion;
            }
        });

    /* Alternate GeoIP providers with more up-to-date data, but as of this writing missing parts of Canada
    $http.jsonp("https://freegeoip.net/json/?callback=JSON_CALLBACK")
        .success(function(data, status, headers, config) {
            $scope.usersRegion = data.region_name;
            if ($scope.regions.indexOf($scope.usersRegion) >= 0) {
                $scope.currentRegion = $scope.usersRegion;
            } else {
                $scope.usersRegion = "no_region_match";
                $scope.currentRegion = $scope.defaultRegion;
            }
        })
        .error(function() {
            $scope.usersRegion = "geoip_error";
            if ($scope.defaultRegion != null) {
                $scope.currentRegion = $scope.defaultRegion;
            }
        });

    $http.jsonp("http://ipinfo.io/?callback=JSON_CALLBACK")
        .success(function(data, status, headers, config) {
            $scope.usersRegion = data.region;
            if ($scope.regions.indexOf($scope.usersRegion) >= 0) {
                $scope.currentRegion = $scope.usersRegion;
            } else {
                $scope.usersRegion = "no_region_match";
                $scope.currentRegion = $scope.defaultRegion;
            }
        })
        .error(function() {
            $scope.usersRegion = "geoip_error";
            if ($scope.defaultRegion != null) {
                $scope.currentRegion = $scope.defaultRegion;
            }
        });
    */

    $http.get('data/canada_2016.json')
        .then(function(res) {
            for (var key in res.data) {
                $scope[key] = res.data[key];
            }
            if (["geoip_error", "geocode_error", "no_region_match"].indexOf($scope.usersRegion) >= 0) {
                $scope.currentRegion = $scope.defaultRegion;
            } else if ($scope.usersRegion == null) {
                // Give geoip a chance to match the user's region
            } else {
                $scope.currentRegion = $scope.usersRegion;
            }
        });

    $scope.min = 0;
    $scope.max = 50000;
    $scope.accordions = {
        earn: true,
        credits: false,
        breakdown: false,
        types: false,
    };
    $scope.$watch('accordions.credits', function() {
        $scope.calculateData();
        $scope.renderCreditsSlow();
    });
    $scope.$watch('accordions.types', function() {
        $scope.calculateData();
        $scope.renderCreditsSlow();
    });
    $scope.$watch('accordions.breakdown', function() {
        $scope.toggleAreas($scope.accordions.breakdown);
    });
    $scope.sliders = {
        "creditRefundable": 0,
        "creditNonRefundable": 0,
        "deduction": 0,
        "types": {
            "regular": 1,
            "capital_gains": 0,
            "eligible_dividends": 0,
            "other_dividends": 0,
            "tax_free": 0,
        },
    };

    $scope.currentIncome = 0;
    $scope.currentTax = 0;
    $scope.currentEff = 0;
    $scope.currentMarg = 0;

    $scope.currentFederalTax = 0;
    $scope.currentProvincialTax = 0;

    $scope.currentFederalMarg = 0;
    $scope.currentProvincialMarg = 0;

    $scope.currentFederalEff = 0;
    $scope.currentProvincialEff = 0;

    $scope.doneFirstRender = false;
    $scope.currentRegion = "Province";
    $scope.rawBrackets = {
        "Federal": {
            "income": [
                [Infinity, 0.0]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Province": {
            "abatement": 0.0,
            "income": [
                [Infinity, 0.0]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
    };
    $scope.data = [];
    $scope.changeRegion = function(region) {
        $scope.currentRegion = region;
    };
    $scope.renderRegion = function() {
        $scope.calculateData();
        $scope.render();
    };
    $scope.changeCreditsAndDeductions = function() {
        $scope.calculateData();
        $scope.renderCredits();
    };
    $scope.$watch('currentRegion', $scope.renderRegion);
    $scope.$watch('sliders.creditRefundable', $scope.changeCreditsAndDeductions);
    $scope.$watch('sliders.creditNonRefundable', $scope.changeCreditsAndDeductions);
    $scope.$watch('sliders.deduction', $scope.changeCreditsAndDeductions);
    $scope.sliderFormat = function(value) {
        return $filter('currency')(value, '$', 0);
    };
    $scope.balanceIncomeSliders = {
        'regular': function() { rebalance(1, $scope.sliders.types, 'regular'); $scope.calculateData(); $scope.renderCredits(); },
        'capital_gains': function() { rebalance(1, $scope.sliders.types, 'capital_gains'); $scope.calculateData(); $scope.renderCredits(); },
        'eligible_dividends': function() { rebalance(1, $scope.sliders.types, 'eligible_dividends'); $scope.calculateData(); $scope.renderCredits(); },
        'other_dividends': function() { rebalance(1, $scope.sliders.types, 'other_dividends'); $scope.calculateData(); $scope.renderCredits(); },
        'tax_free': function() { rebalance(1, $scope.sliders.types, 'tax_free'); $scope.calculateData(); $scope.renderCredits(); },
    };
    $scope.$watch('sliders.types.regular', $scope.balanceIncomeSliders.regular);
    $scope.$watch('sliders.types.capital_gains', $scope.balanceIncomeSliders.capital_gains);
    $scope.$watch('sliders.types.eligible_dividends', $scope.balanceIncomeSliders.eligible_dividends);
    $scope.$watch('sliders.types.other_dividends', $scope.balanceIncomeSliders.other_dividends);
    $scope.$watch('sliders.types.tax_free', $scope.balanceIncomeSliders.tax_free);
    $scope.typesSliderFormat = function(value) {
        return $filter('percentage')(value, 0);
    };
    $scope.openDonate = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'templates/donate-modal.html',
            controller: 'ModalInstanceCtrl',
        });

        modalInstance.result.then(function(returnValue) {
            console.log('Returned: ' + returnValue);
        }, function() {
            console.log('Cancelled');
        })
    };
}]);
