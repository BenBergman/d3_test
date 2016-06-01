app.controller("MainController", ["$scope", "$uibModal", "$filter", function($scope, $uibModal, $filter) {
    $scope.min = 0;
    $scope.max = 50000;
    $scope.accordions = {
        earn: true,
        credits: false,
        breakdown: false,
    };
    $scope.$watch('accordions.credits', function() {
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

    $scope.currentProvince = "California";
    $scope.provinces = [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "District of Columbia",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming",
    ];
    $scope.rawBrackets = {
        "Federal": {
            "income": [
                [9225, 0.10],
                [37450, 0.15],
                [90750, 0.25],
                [189300, 0.28],
                [411500, 0.33],
                [413200, 0.35],
                [Infinity, 0.396]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Alabama": {
            "abatement": 0.0,
            "income": [
                [500, 0.02],
                [3000, 0.04],
                [Infinity, 0.05]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Alaska": {
            "abatement": 0.0,
            "income": [
                [Infinity, 0.0]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Arizona": {
            "abatement": 0.0,
            "income": [
                [10000, 0.0259],
                [25000, 0.0288],
                [50000, 0.0336],
                [150000, 0.0424],
                [Infinity, 0.0454]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Arkansas": {
            "abatement": 0.0,
            "income": [
                [4199, 0.01],
                [8299, 0.025],
                [12399, 0.035],
                [20699, 0.045],
                [35599, 0.06],
                [Infinity, 0.07]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "California": {
            "abatement": 0.0,
            "income": [
                [7582, 0.01],
                [17976, 0.02],
                [28371, 0.04],
                [39384, 0.06],
                [49774, 0.08],
                [254250, 0.093],
                [305100, 0.103],
                [508500, 0.113],
                [1000000, 0.123],
                [Infinity, 0.133]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Colorado": {
            "abatement": 0.0,
            "income": [
                [Infinity, 0.0463]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Connecticut": {
            "abatement": 0.0,
            "income": [
                [10000, 0.03],
                [50000, 0.05],
                [100000, 0.055],
                [200000, 0.06],
                [250000, 0.065],
                [Infinity, 0.067]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Delaware": {
            "abatement": 0.0,
            "income": [
                [2000, 0.0],
                [5000, 0.022],
                [10000, 0.039],
                [20000, 0.048],
                [25000, 0.052],
                [60000, 0.0555],
                [Infinity, 0.066]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "District of Columbia": {
            "abatement": 0.0,
            "income": [
                [10000, 0.04],
                [40000, 0.06],
                [350000, 0.085],
                [Infinity, 0.0895]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Florida": {
            "abatement": 0.0,
            "income": [
                [Infinity, 0.0]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Georgia": {
            "abatement": 0.0,
            "income": [
                [750, 0.01],
                [2250, 0.02],
                [3750, 0.03],
                [5250, 0.04],
                [7000, 0.05],
                [Infinity, 0.06]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Hawaii": {
            "abatement": 0.0,
            "income": [
                [2400, 0.014],
                [4800, 0.032],
                [9600, 0.055],
                [14400, 0.064],
                [19200, 0.068],
                [24000, 0.072],
                [36000, 0.076],
                [48000, 0.079],
                [150000, 0.0825],
                [175000, 0.09],
                [200000, 0.10],
                [Infinity, 0.11]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Idaho": {
            "abatement": 0.0,
            "income": [
                [1408, 0.016],
                [2817, 0.036],
                [4226, 0.041],
                [5635, 0.051],
                [7044, 0.061],
                [10567, 0.071],
                [Infinity, 0.074]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Illinois": {
            "abatement": 0.0,
            "income": [
                [Infinity, 0.05]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Indiana": {
            "abatement": 0.0,
            "income": [
                [Infinity, 0.034]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Iowa": {
            "abatement": 0.0,
            "income": [
                [1515, 0.0036],
                [3030, 0.0072],
                [6060, 0.0243],
                [13635, 0.0450],
                [22725, 0.0612],
                [30300, 0.0648],
                [45450, 0.0680],
                [68175, 0.0792],
                [Infinity, 0.0898],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Kansas": {
            "abatement": 0.0,
            "income": [
                [15000, 0.0270],
                [Infinity, 0.0490],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Kentucky": {
            "abatement": 0.0,
            "income": [
                [3000, 0.0200],
                [4000, 0.0300],
                [5000, 0.0400],
                [8000, 0.0500],
                [75000, 0.0580],
                [Infinity, 0.0600],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Louisiana": {
            "abatement": 0.0,
            "income": [
                [12500, 0.0200],
                [50000, 0.0400],
                [Infinity, 0.0600],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Maine": {
            "abatement": 0.0,
            "income": [
                [5200, 0.0],
                [20900, 0.0650],
                [Infinity, 0.0795],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Maryland": {
            "abatement": 0.0,
            "income": [
                [1000, 0.0200],
                [2000, 0.0300],
                [3000, 0.0400],
                [100000, 0.0475],
                [125000, 0.0500],
                [150000, 0.0525],
                [250000, 0.0550],
                [Infinity, 0.0575],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Massachusetts": {
            "abatement": 0.0,
            "income": [
                [Infinity, 0.0525]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Michigan": {
            "abatement": 0.0,
            "income": [
                [Infinity, 0.0425]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Minnesota": {
            "abatement": 0.0,
            "income": [
                [24680, 0.0535],
                [81080, 0.0705],
                [152540, 0.0785],
                [Infinity, 0.0985],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Mississippi": {
            "abatement": 0.0,
            "income": [
                [5000, 0.0300],
                [10000, 0.0400],
                [Infinity, 0.0500],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Missouri": {
            "abatement": 0.0,
            "income": [
                [1000, 0.0150],
                [2000, 0.0200],
                [3000, 0.0250],
                [4000, 0.0300],
                [5000, 0.0350],
                [6000, 0.0400],
                [7000, 0.0450],
                [8000, 0.0500],
                [9000, 0.0550],
                [Infinity, 0.0600],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Montana": {
            "abatement": 0.0,
            "income": [
                [2800, 0.0100],
                [4900, 0.0200],
                [7400, 0.0300],
                [10100, 0.0400],
                [13000, 0.0500],
                [16700, 0.0600],
                [Infinity, 0.0690],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Nebraska": {
            "abatement": 0.0,
            "income": [
                [3000, 0.0246],
                [18000, 0.0351],
                [29000, 0.0501],
                [Infinity, 0.0684],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Nevada": {
            "abatement": 0.0,
            "income": [
                [Infinity, 0.0]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "New Hampshire": {
            "abatement": 0.0,
            "income": [
                [Infinity, 0.05]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "New Jersey": {
            "abatement": 0.0,
            "income": [
                [20000, 0.0140],
                [35000, 0.0175],
                [40000, 0.0350],
                [75000, 0.0553],
                [500000, 0.0637],
                [Infinity, 0.0897],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "New Mexico": {
            "abatement": 0.0,
            "income": [
                [5500, 0.0170],
                [11000, 0.0320],
                [16000, 0.0470],
                [Infinity, 0.0490],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "New York": {
            "abatement": 0.0,
            "income": [
                [8200, 0.0400],
                [11300, 0.0450],
                [13350, 0.0525],
                [20550, 0.0590],
                [77150, 0.0645],
                [205850, 0.0665],
                [1029250, 0.0685],
                [Infinity, 0.0882],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "North Carolina": {
            "abatement": 0.0,
            "income": [
                [Infinity, 0.058]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "North Dakota": {
            "abatement": 0.0,
            "income": [
                [36900, 0.0151],
                [89350, 0.0282],
                [186350, 0.0313],
                [405100, 0.0363],
                [Infinity, 0.0399],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Ohio": {
            "abatement": 0.0,
            "income": [
                [5200, 0.0054],
                [10400, 0.0107],
                [15650, 0.0215],
                [20900, 0.0269],
                [41700, 0.0322],
                [83350, 0.0376],
                [104250, 0.0430],
                [208500, 0.0499],
                [Infinity, 0.0539],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Oklahoma": {
            "abatement": 0.0,
            "income": [
                [1000, 0.0050],
                [2500, 0.0100],
                [3750, 0.0200],
                [4900, 0.0300],
                [7200, 0.0400],
                [8700, 0.0500],
                [Infinity, 0.0525],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Oregon": {
            "abatement": 0.0,
            "income": [
                [3300, 0.0500],
                [8250, 0.0700],
                [125000, 0.0900],
                [Infinity, 0.0990],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Pennsylvania": {
            "abatement": 0.0,
            "income": [
                [Infinity, 0.0307],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Rhode Island": {
            "abatement": 0.0,
            "income": [
                [59600, 0.0375],
                [135500, 0.0475],
                [Infinity, 0.0599],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "South Carolina": {
            "abatement": 0.0,
            "income": [
                [2880, 0.0000],
                [5760, 0.0300],
                [8640, 0.0400],
                [11520, 0.0500],
                [14400, 0.0600],
                [Infinity, 0.0700],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "South Dakota": {
            "abatement": 0.0,
            "income": [
                [Infinity, 0.0]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Tennessee": {
            "abatement": 0.0,
            "income": [
                [Infinity, 0.0600],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Texas": {
            "abatement": 0.0,
            "income": [
                [Infinity, 0.0]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Utah": {
            "abatement": 0.0,
            "income": [
                [Infinity, 0.0500],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Vermont": {
            "abatement": 0.0,
            "income": [
                [36900, 0.0355],
                [89350, 0.0680],
                [186350, 0.0780],
                [405100, 0.0880],
                [Infinity, 0.0895],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Virginia": {
            "abatement": 0.0,
            "income": [
                [3000, 0.0200],
                [5000, 0.0300],
                [17000, 0.0500],
                [Infinity, 0.0575],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Washington": {
            "abatement": 0.0,
            "income": [
                [Infinity, 0.0]
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "West Virginia": {
            "abatement": 0.0,
            "income": [
                [10000, 0.0300],
                [25000, 0.0400],
                [40000, 0.0450],
                [60000, 0.0600],
                [Infinity, 0.0650],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Wisconsin": {
            "abatement": 0.0,
            "income": [
                [10910, 0.0400],
                [21820, 0.0584],
                [240190, 0.0627],
                [Infinity, 0.0765],
            ],
            "personalAmount": [
                [Infinity, 0.0]
            ]
        },
        "Wyoming": {
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
    $scope.changeProvince = function(province) {
        $scope.currentProvince = province;
        $scope.calculateData();
        $scope.render();
    };
    $scope.changeCreditsAndDeductions = function() {
        $scope.calculateData();
        $scope.renderCredits();
    };
    $scope.$watch('sliders.creditRefundable', $scope.changeCreditsAndDeductions);
    $scope.$watch('sliders.creditNonRefundable', $scope.changeCreditsAndDeductions);
    $scope.$watch('sliders.deduction', $scope.changeCreditsAndDeductions);
    $scope.sliderFormat = function(value) {
        return $filter('currency')(value, '$', 0);
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
