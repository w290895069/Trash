var width = 960, height = 650, centered;

   // var projection = d3.geoAlbersUsa()
   //  .scale(1070)
   //  .translate([width / 2, height / 2]);

var path = d3.geoPath();
// .projection(projection);

var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

svg.append("rect")
   .attr("class", "background")
   .attr("width", width)
   .attr("height", height)
   .on("click", clicked);

var g = svg.append("g");

d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
  if (error) throw error;

  g.append("g")
   .attr("id", "states")
   .selectAll("path")
   .data(topojson.feature(us, us.objects.states).features)
   .enter().append("path")
   .attr("d", path)
   .on("click", clicked);

  g.append("path")
   .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
   .attr("id", "state-borders")
   .attr("d", path);
});

function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
   .classed("active", centered && function(d) { return d === centered; });

  g.transition()
   .duration(750)
   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
   .style("stroke-width", 1.5 / k + "px");
}
