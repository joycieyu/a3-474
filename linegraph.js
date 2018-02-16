
var svg = d3.select("svg"),
    margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//var parseTime = d3.timeParse("%Y%m%d");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.count); });

d3.tsv("nameSelection.tsv", function(error, data) {
  if (error) throw error;

  var names = data.columns.slice(1).map(function(id) {
    return {
      id: id,
      values: data.map(function(d) {
        return {year: d.year, count: d[id]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.year; }));

  y.domain([ 
    d3.min(names, function(c) { return d3.min(c.values, function(d) { return d.count; }); }),
    d3.max(names, function(c) { return d3.max(c.values, function(d) { return d.count; }); })
  ]);

  z.domain(names.map(function(c) { return c.id; }));

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Count");

  var name = g.selectAll(".name")
    .data(data)
    .enter().append("g")
      .attr("class", "name");

  name.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.count); })
      .style("stroke", function(d) { return z(d.id); });

  name.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.count) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; });

svg.selectAll("dot")
     .data(data)
    .enter().append("circle")
    .attr("r", 4)
    .attr("cx", function(d) { return x(d.year); })
    .attr("cy", function(d) { return y(d.count); });

});

// function type(d, _, columns) {
//   d.year = d.year;
//   for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
//   return d;
// }
