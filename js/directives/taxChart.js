app.directive('taxChart', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            var svg = d3.select(element[0])
                .append("svg")
                .attr("id", "directive")
                .style({
                    "width": "100%",
                    "height": 500
                });

            var brackets = add_brackets(scope.rawBrackets.Manitoba.income, scope.rawBrackets.Federal.income);
            brackets = subtract_brackets(brackets, scope.rawBrackets.Manitoba.personalAmount);
            brackets = subtract_brackets(brackets, scope.rawBrackets.Federal.personalAmount);

            scope.data = [];

            for (var i = 0; i <= 250000; i += 100) {
                scope.data.push({
                    "Income": i,
                    "Tax": taxes_owed(i, brackets),
                    "Effective Rate": effective_rate(i, brackets),
                    "Marginal Rate": marginal_rate(i, brackets)
                });
            }

            console.log('first data');
                console.log(scope.data[1000]);
            scope.$watch('data', function(newData, oldData) {
                return scope.render(newData);
            });

            scope.render = function(data) {
                console.log('rendering');
                console.log(data[1000]);
                /*
                scope.xScale
                    .domain([0, d3.max(scope.data, function(d) { return d["Income"]; })]);
                scope.yScale
                    .domain([0, d3.max(scope.data, function(d) { return d["Tax"]; })]),
                scope.yScale2
                    .domain([0, d3.max(scope.data, function(d) { return d["Marginal Rate"]; })]);
                    */

                var lineGenTax = d3.svg.line()
                    .x(function(d) { return scope.xScale(d.Income); })
                    .y(function(d) { return scope.yScale(d["Tax"]); })
                    .interpolate("basis");
                var lineGenEff = d3.svg.line()
                    .x(function(d) { return scope.xScale(d.Income); })
                    .y(function(d) { return scope.yScale2(d["Effective Rate"]); })
                    .interpolate("basis");
                var lineGenMarg = d3.svg.line()
                    .x(function(d) { return scope.xScale(d.Income); })
                    .y(function(d) { return scope.yScale2(d["Marginal Rate"]); })
                    .interpolate("basis");

                d3.select('#tax')
                    .transition()
                    .duration(2000)
                    .attr('d', lineGenTax(scope.data));
                d3.select('#effective')
                    .transition()
                    .duration(2000)
                    .attr('d', lineGenEff(scope.data));
                d3.select('#marginal')
                    .transition()
                    .duration(2000)
                    .attr('d', lineGenMarg(scope.data));

                yAxis.scale(scope.xScale);
                d3.select('#y')
                    .transition()
                    .duration(2000)
                    .call(yAxis)
            };

            scope.xScale
                .domain([0, d3.max(scope.data, function(d) { return d["Income"]; })]);
            scope.yScale
                .domain([0, d3.max(scope.data, function(d) { return d["Tax"]; })]);
            scope.yScale2
                .domain([0, d3.max(scope.data, function(d) { return d["Marginal Rate"]; })]);

            var xAxis = d3.svg.axis()
                    .scale(scope.xScale)
                    .orient("bottom"),
                yAxis = d3.svg.axis()
                    .scale(scope.yScale)
                    .orient("right"),
                yAxis2 = d3.svg.axis()
                    .scale(scope.yScale2)
                    .orient("left");

            var lineGenTax = d3.svg.line()
                .x(function(d) { return scope.xScale(d.Income); })
                .y(function(d) { return scope.yScale(d["Tax"]); })
                .interpolate("basis");
            var lineGenEff = d3.svg.line()
                .x(function(d) { return scope.xScale(d.Income); })
                .y(function(d) { return scope.yScale2(d["Effective Rate"]); })
                .interpolate("basis");
            var lineGenMarg = d3.svg.line()
                .x(function(d) { return scope.xScale(d.Income); })
                .y(function(d) { return scope.yScale2(d["Marginal Rate"]); })
                .interpolate("basis");


            svg.append("svg:g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (scope.height - scope.margins.bottom) + ")")
                .call(xAxis);
            svg.append("svg:g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + (scope.width - scope.margins.right) + ",0)")
                .call(yAxis);
            svg.append("svg:g")
                .attr("class", "y2 axis")
                .attr("transform", "translate(" + (scope.margins.left) + ",0)")
                .call(yAxis2);

            svg.selectAll("line.horizontalGrid").data(scope.yScale2.ticks(4)).enter()
                .append("line")
                .attr({
                    "class": "horizontalGrid",
                    "x1": scope.margins.right,
                    "x2": scope.width - scope.margins.right,
                    "y1": function(d) { return scope.yScale2(d); },
                    "y2": function(d) { return scope.yScale2(d); },
                    "fill": "none",
                    "shape-rendering": "crispEdges",
                    "stroke": "grey",
                    "stroke-width": "1px"
                });

            var color = d3.scale.category10()
                .domain(["Tax", "Effective Rate", "Marginal Rate"]);




            svg.append('svg:path')
                .attr('id', 'tax')
                .attr('d', lineGenTax(scope.data))
                .attr('stroke', color("Tax"))
                .attr('stroke-width', 2)
                .attr('fill', 'none');
            svg.append('svg:path')
                .attr('id', 'effective')
                .attr('d', lineGenEff(scope.data))
                .attr('stroke', color("Effective Rate"))
                .attr('stroke-width', 2)
                .attr('fill', 'none');
            svg.append('svg:path')
                .attr('id', 'marginal')
                .attr('d', lineGenMarg(scope.data))
                .attr('stroke', color("Marginal Rate"))
                .attr('stroke-width', 2)
                .attr('fill', 'none');
        }
    }
})
