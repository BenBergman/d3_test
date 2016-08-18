import test from 'ava';

var taxes = require('./taxes.js');


test('subtract basic brackets', t => {
    var a = [
        [10, 0.1],
        [20, 0.2],
        [Infinity, 0.35]
    ];
    var b = [
        [5, 0.05],
        [15, 0.1],
    ];
    var result = taxes.subtract_brackets(a, b);
    var expected = [
        [5, 0.05],
        [10, 0.0],
        [15, 0.1],
        [20, 0.2],
        [Infinity, 0.35]
    ];
    t.deepEqual(result, expected);
})


test('subtract real brackets', t => {
	var mb_brackets = [
		[31000, 0.2580],
		[45282, 0.2775],
		[67000, 0.3325],
		[90563, 0.3790],
		[140388, 0.4340],
		[200000, 0.4640],
		[Infinity, 0.5040]
	];

	var mb_personal_amt = [
		[9134, 0.1080]
	];

	var fed_personal_amt = [
		[11474, 0.1500]
	];

    var result = taxes.subtract_brackets(mb_brackets, mb_personal_amt);
    var result = taxes.subtract_brackets(result, fed_personal_amt);

    var expected = [
		[9134, 0.2580 - 0.1080 - 0.1500],
		[11474, 0.2580 - 0.1500],
		[31000, 0.2580],
		[45282, 0.2775],
		[67000, 0.3325],
		[90563, 0.3790],
		[140388, 0.4340],
		[200000, 0.4640],
		[Infinity, 0.5040]
    ];

    t.deepEqual(result, expected);
})


test('add basic brackets', t => {
    var a = [
        [11, 0.1],
        [20, 0.3],
        [40, 0.5],
        [50, 0.7],
        [Infinity, 0.9]
    ];
    var b = [
        [5, 0.2],
        [15, 0.4],
        [Infinity, 0.6]
    ];
    var result = taxes.add_brackets(a, b);
    var expected = [
        [5, 0.1+0.2],
        [11, 0.5],
        [15, 0.7],
        [20, 0.3+0.6],
        [40, 1.1],
        [50, 0.6+0.7],
        [Infinity, 1.5]
    ];
    t.deepEqual(result, expected);
})


test('get tax in a middle bracket', t => {
    var brackets = [
        [10000, 0.1],
        [20000, 0.2],
        [30000, 0.3],
        [40000, 0.4],
        [Infinity, 0.5]
    ];
    var owed = taxes.taxes_owed(25000, brackets);
    t.is(owed, 4500);
})


test('get tax in a highest bracket', t => {
    var brackets = [
        [10000, 0.1],
        [20000, 0.2],
        [30000, 0.3],
        [40000, 0.4],
        [Infinity, 0.5]
    ];
    var owed = taxes.taxes_owed(50000, brackets);
    t.is(owed, 15000);
})


test('get marginal tax rate', t => {
    var brackets = [
        [10000, 0.1],
        [20000, 0.2],
        [30000, 0.3],
        [40000, 0.4],
        [Infinity, 0.5]
    ];
    t.is(taxes.marginal_rate(35000, brackets), 0.4);
})


test('get effective tax rate', t => {
    var brackets = [
        [10000, 0.1],
        [20000, 0.2],
        [30000, 0.3],
        [40000, 0.4],
        [Infinity, 0.5]
    ];
    t.is(taxes.effective_rate(30000, brackets), 0.2);
})
