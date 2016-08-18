if (typeof module != "undefined") {
    module.exports = {
        rebalance: rebalance,
    };
}


function rebalance(total, slider_values, changed_index) {
    var unchanged_total = 0;
    var weight_of_unchanged = [];

    for (var i = 0; i < slider_values.length; i++) {
        if (i != changed_index) {
            unchanged_total += slider_values[i];
        }
    }

    for (var i = 0; i < slider_values.length; i++) {
        var weight = 0;
        if (unchanged_total == 0) {
            weight = 1 / (slider_values.length - 1);
        } else {
            weight = slider_values[i] / unchanged_total;
        }
        weight_of_unchanged[i] = weight;
    }

    var new_weight = slider_values;

    for (var i = 0; i < slider_values.length; i++) {
        if (i != changed_index) {
            new_weight[i] = (total - slider_values[changed_index]) * weight_of_unchanged[i];
        }
    }

    return new_weight;
}
