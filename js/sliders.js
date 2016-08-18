if (typeof module != "undefined") {
    module.exports = {
        rebalance: rebalance,
    };
}


function rebalance(total, slider_values, changed_index) {
    var unchanged_total = 0;

    for (var k in slider_values) {
        if (k != changed_index) {
            unchanged_total += slider_values[k];
        }
    }

    var weight_of_unchanged = {};
    for (var k in slider_values) {
        var weight = 0;
        if (unchanged_total == 0) {
            weight = 1 / (Object.keys(slider_values).length - 1);
        } else {
            weight = slider_values[k] / unchanged_total;
        }
        weight_of_unchanged[k] = weight;
    }

    var new_weight = slider_values;

    for (var k in slider_values) {
        if (k != changed_index) {
            new_weight[k] = (total - slider_values[changed_index]) * weight_of_unchanged[k];
        }
    }

    return new_weight;
}
