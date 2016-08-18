import test from 'ava';

var sliders = require('./sliders.js');


test('all untouched sliders at 0 means split available points evenly', t => {
    t.deepEqual(sliders.rebalance(10, {a: 7, b: 0, c: 0, d: 0}, 'a'), {a: 7, b: 1, c: 1, d: 1});
})


test('all untouched sliders at equal value means new available amounts are distributed equally', t => {
    t.deepEqual(sliders.rebalance(10, [4, 3, 3, 3], 0), [4, 2, 2, 2]);
})


test('uneven sliders means new available amounts are distributed proportionally', t => {
    t.deepEqual(sliders.rebalance(10, [0, 1, 2, 1], 0), [0, 2.5, 5, 2.5]);
})
