var width = 800;
var height = 500;

var svgContainer = d3
  .select("chartHolder")
  .append("svg")
  .attr("width", width + 100)
  .attr("height", height + 100);

d3.json(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json",
  function (err, data) {}
);
