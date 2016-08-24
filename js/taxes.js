if (typeof module != "undefined") {
    module.exports = {
        add_brackets: add_brackets,
        subtract_brackets: subtract_brackets,
        taxes_owed: taxes_owed,
        marginal_rate: marginal_rate,
        effective_rate: effective_rate,
        calculate_complex_taxes_for_income: calculate_complex_taxes_for_income,
        calculate_complex_effective_rate_for_income_and_tax_owed: calculate_complex_effective_rate_for_income_and_tax_owed,
        calculate_complex_marginal_rate_for_income: calculate_complex_marginal_rate_for_income,
    };
}


function add_brackets(a, b) {
    var i = 0;
    var j = 0;

    var result = [];

    while (i < a.length && j < b.length) {
        if (a[i][0] < b[j][0]) {
            if (a[i][0] !== Infinity) {
                result.push([a[i][0], a[i][1] + b[j][1]]);
            }
            i++;
        } else {
            if (b[j][0] !== Infinity) {
                result.push([b[j][0], a[i][1] + b[j][1]]);
            }
            j++;
        }
    }

    for (; i < a.length; i++) {
        result.push([a[i][0], a[i][1]]);
        if (b[b.length - 1][0] === Infinity) {
            result[result.length - 1][1] += b[b.length - 1][1];
        }
    }

    for (; j < b.length; j++) {
        result.push([b[j][0], b[j][1]]);
        if (a[a.length - 1][0] === Infinity) {
            result[result.length - 1][1] += a[a.length - 1][1];
        }
    }

    return result;
}


function subtract_brackets(a, b) {
    var i = 0;
    var j = 0;

    var result = [];

    while (i < a.length && j < b.length) {
        if (a[i][0] < b[j][0]) {
            result.push([a[i][0], a[i][1] - b[j][1]]);
            i++;
        } else {
            result.push([b[j][0], a[i][1] - b[j][1]]);
            j++;
        }
    }

    for (; i < a.length; i++) {
        result.push([a[i][0], a[i][1]]);
    }

    for (; j < b.length; j++) {
        result.push([b[j][0], b[j][1]]);
    }

    return result;
}


function bracket_mult(brackets, x) {
    var result = [];
    for (var i in brackets) {
        result.push([brackets[i][0], brackets[i][1] * x]);
    }
    return result;
}


function bracket_floor(brackets) {
    var result = [];
    for (var i in brackets) {
        result.push([brackets[i][0], max(0, brackets[i][1])]);
    }
    return result;
}


function taxes_owed(income, brackets) {
    var owed = 0;
    var lower_end = 0;

    for (var i in brackets) {
        if (income > brackets[i][0]) {
            owed += (brackets[i][0] - lower_end) * brackets[i][1];
            lower_end = brackets[i][0];
        } else {
            owed += (income - lower_end) * brackets[i][1];
            break;
        }
    }

    return owed < 0 ? 0 : owed;
}


function marginal_rate(income, brackets) {
    for (var i in brackets) {
        if (income < brackets[i][0]) {
            var rate = brackets[i][1];
            return rate < 0 ? 0 : rate;
        }
    }

    return 0;
}


function effective_rate(income, brackets) {
    if (income === 0) {
        return 0;
    }
    var rate = taxes_owed(income, brackets) / income;
    return rate < 0 ? 0 : rate;
}


function max(a, b) {
    if (a > b) {
        return a;
    } else {
        return b;
    }
}


function calculate_complex_taxes_for_income(income, income_weighting, general_deduction, general_refundable_credits, general_non_refundable_credits, federal_bracket, regional_bracket, cpp_bracket, ei_bracket) {
    var effective_income = calculate_effective_income(income, income_weighting);

    var eligible_dividends_grossed_up = calculate_eligible_dividend_income(income, income_weighting);
    var other_dividends_grossed_up = calculate_other_dividend_income(income, income_weighting);

    var federal_dividend_tax_credits = eligible_dividends_grossed_up * 0.1502 + other_dividends_grossed_up * 0.105;
    var regional_dividend_tax_credits = eligible_dividends_grossed_up * 0.08 + other_dividends_grossed_up * 0.0083;

    var federal_tax_owed = max(0, taxes_owed(effective_income - general_deduction, federal_bracket) - federal_dividend_tax_credits);
    var regional_tax_owed = max(0, taxes_owed(effective_income - general_deduction, regional_bracket) - regional_dividend_tax_credits);
    var cpp_contribution_owed = taxes_owed(effective_income, cpp_bracket);
    var ei_contribution_owed = taxes_owed(effective_income, ei_bracket);

    var tax_owed = federal_tax_owed + regional_tax_owed + cpp_contribution_owed + ei_contribution_owed - general_refundable_credits;
    if (tax_owed > 0) {
        tax_owed -= general_non_refundable_credits;
        if (tax_owed < 0) {
            tax_owed = 0;
        }
    }
    return tax_owed;
}


function calculate_complex_effective_rate_for_income_and_tax_owed(income, tax_owed) {
    var eff_rate = 0;
    if (income > 0) {
        eff_rate = tax_owed / income;
    }
    return eff_rate;
}


function calculate_complex_marginal_rate_for_income(income, income_weighting, general_deduction, tax_owed, brackets) {
    // TODO: marginal rate is tricky here because, since marginal rate is tax owed on next dollar, we need to know what the next dollar is...? Maybe assuming regular income is fine?
    // TODO: marginal rate should be adjusted to reflect dividend tax credit...?
    var effective_income = calculate_effective_income(income, income_weighting);
    var marg_rate = marginal_rate(effective_income - general_deduction, brackets);
    if (tax_owed == 0) {
        marg_rate = 0;
    }
    return marg_rate;
}


function calculate_effective_income(income, income_weighting) {
    var eligible_dividends_grossed_up = calculate_eligible_dividend_income(income, income_weighting);
    var other_dividends_grossed_up = calculate_other_dividend_income(income, income_weighting);
    var effective_income = income * (income_weighting.regular + income_weighting.capital_gains / 2) + eligible_dividends_grossed_up + other_dividends_grossed_up;

    return effective_income;
}


function calculate_eligible_dividend_income(income, income_weighting) {
    return income * income_weighting.eligible_dividends * 1.38;
}


function calculate_other_dividend_income(income, income_weighting) {
    return income * income_weighting.other_dividends * 1.17;
}
