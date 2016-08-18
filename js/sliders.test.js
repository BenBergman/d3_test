import test from 'ava';

var sliders = require('./sliders.js');


test('gree', t => {
    t.deepEqual(sliders.rebalance(10, [7, 0, 0, 0], 0), [7, 1, 1, 1]);
})
