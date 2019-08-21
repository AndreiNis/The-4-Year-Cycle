
import * as d3 from 'd3';



var margin = { top: 20, right: 40, bottom: 30, left: 20 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    barWidth = Math.floor(width / 19) - 1;

var x = d3.scaleLinear()
    .range([barWidth / 2, width - barWidth / 2]);

var y = d3.scaleLinear()
    .range([height, 0]);

var yAxis = d3.axisLeft(y)
    .tickSize(-width)
    .tickFormat(function (d) { return Math.round(d / 1e6) + "M"; });

// An SVG element with a bottom-right origin.
const svg = d3.select('#root-svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// A sliding container to hold the bars by birthyear.
// var birthyears = svg.append("g")
//     .attr("class", "birthyears");

// A label for the current year.
var title = svg.append("text")
    .attr("class", "title")
    .attr("dy", ".71em")
    .text(2000);

// d3.csv('./data/btc-usd-max.csv').then(data => {
//     data.forEach(d => {
//         d.price = +d.price;
//         d.market_cap = +d.market_cap;
//         d.total_volume = +d.total_volume;
//     });
//     render(data);
// });
let parseTime = d3.timeParse("%B %d, %Y");

d3.csv('./data/btc-usd-max.csv').then(data => {
    data.forEach(d => {
        d.price = +d.price;
        d.market_cap = +d.market_cap;
        d.total_volume = +d.total_volume;
        d.snapped_at = parseTime(d.snapped_at);
    });
    // });

    // Compute the extent of the data set in age and years.
    // var age1 = d3.max(data, function (d) { return d.age; }),
    //     year0 = d3.min(data, function (d) { return d.year; }),
    //     year1 = d3.max(data, function (d) { return d.year; }),
    //     year = year1;
    let formatYear = d3.timeFormat("%Y");

    let yearMax = d3.max(data, function (d) {return formatYear(d.snapped_at)}),
        yearMin = d3.min(data, function (d) {return formatYear(d.snapped_at)})
               

    // Update the scale domains.
    x.domain([yearMin, yearMax]);
    y.domain([0, d3.max(data, function (d) { return d.price; })]);

    // // Produce a map from year and birthyear to [male, female].
    // data = d3.nest()
    //     .key(function (d) { return d.year; })
    //     .key(function (d) { return d.year - d.age; })
    //     .rollup(function (v) { return v.map(function (d) { return d.people; }); })
    //     .map(data);

    // // Add an axis to show the population values.
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxis)
        .selectAll("g")
        .filter(function (value) { return !value; })
        .classed("zero", true);

    // // Add labeled rects for each birthyear (so that no enter or exit is required).
    var year = years.selectAll(".snapped_at")
        .data(d3.range(yearMin, yearMax + 1, 5))
        .enter().append("g")
        .attr("class", "year")
        .attr("transform", function (year) { return "translate(" + x(year) + ",0)"; });

    birthyear.selectAll("rect")
        .data(function (year) { return data[year] || [0, 0]; })
        .enter().append("rect")
        .attr("x", -barWidth / 2)
        .attr("width", barWidth)
        .attr("y", y)
        .attr("height", function (value) { return height - y(value); });

    // // Add labels to show birthyear.
    // birthyear.append("text")
    //     .attr("y", height - 4)
    //     .text(function (birthyear) { return birthyear; });

    // // Add labels to show age (separate; not animated).
    // svg.selectAll(".age")
    //     .data(d3.range(0, age1 + 1, 5))
    //     .enter().append("text")
    //     .attr("class", "age")
    //     .attr("x", function (age) { return x(year - age); })
    //     .attr("y", height + 4)
    //     .attr("dy", ".71em")
    //     .text(function (age) { return age; });

    // // Allow the arrow keys to change the displayed year.
    // window.focus();
    // d3.select(window).on("keydown", function () {
    //     switch (d3.event.keyCode) {
    //         case 37: year = Math.max(year0, year - 10); break;
    //         case 39: year = Math.min(year1, year + 10); break;
    //     }
    //     update();
    // });

    // function update() {
    //     if (!(year in data)) return;
    //     title.text(year);

    //     birthyears.transition()
    //         .duration(750)
    //         .attr("transform", "translate(" + (x(year1) - x(year)) + ",0)");

    //     birthyear.selectAll("rect")
    //         .data(function (birthyear) { return data[year][birthyear] || [0, 0]; })
    //         .transition()
    //         .duration(750)
    //         .attr("y", y)
    //         .attr("height", function (value) { return height - y(value); });
    // }
});



