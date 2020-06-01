var width = 800;
var height = 400;

var svgContainer = d3
  .select(".chartHolder")
  .append("svg")
  .attr("width", width + 100)
  .attr("height", height + 60);

var tooltip = d3
  .select(".chartHolder")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

var info = d3
  .select(".chartHolder")
  .append("div")
  .attr("id", "info")
  .html(
    "More Information: <a href='http://www.bea.gov/national/pdf/nipaguid.pdf' target='blank'>http://www.bea.gov/national/pdf/nipaguid.pdf</a>"
  );

d3.json(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json",
  function (err, data) {
    // bar width based on number of items in the array
    var barWidth = width / data.data.length;

    // convert the date to an array, then to numbers and then modify the
    // month number to -1 in order to Date.UTC to convert it to miliseconds (months start from 0 not from 1)
    var dates = data.data.map(function (d) {
      let temp = d[0].split("-").map((i) => parseInt(i, 10));
      temp[1] -= 1;
      return Date.UTC(...temp);
    });

    // tooltip date will show as year+quarter example:"1995 Q4"
    var tooltipDate = data.data.map(function (d) {
      let month = d[0].substring(5, 7);
      let quarter;
      switch (month) {
        case "01":
          quarter = "Q1";
          break;
        case "04":
          quarter = "Q2";
          break;
        case "07":
          quarter = "Q3";
          break;
        case "10":
          quarter = "Q4";
          break;
        default:
          null;
          break;
      }
      return d[0].substring(0, 4) + " " + quarter;
    });

    // x axis

    var xScale = d3
      .scaleTime()
      .domain([d3.min(dates), d3.max(dates) + 7776000000]) //added 3 months worth of miliseconds to fix the last bar
      .range([0, width]);

    var xAxis = d3.axisBottom(xScale);

    var xAxisGroup = svgContainer
      .append("g")
      .call(xAxis)
      .attr("id", "x-axis")
      .attr("transform", "translate(60,410)");

    //y axis
    var GDP = data.data.map((d) => d[1]);

    var yScale = d3
      .scaleLinear()
      .domain([0, d3.max(GDP)])
      .range([height, 0]);

    var yAxis = d3.axisLeft(yScale);

    var yAxisGroup = svgContainer
      .append("g")
      .call(yAxis)
      .attr("id", "y-axis")
      .attr("transform", "translate(60,10)");

    var linearScale = d3
      .scaleLinear()
      .domain([0, d3.max(GDP)])
      .range([0, height]);

    var scaledGDP = GDP.map((d) => linearScale(d));

    // chart
    d3.select("svg")
      .selectAll("rect")
      .data(scaledGDP)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("data-date", (d, i) => data.data[i][0])
      .attr("data-gdp", (d, i) => data.data[i][1])
      .attr("x", (d, i) => xScale(dates[i]))
      .attr("y", (d, i) => height - d)
      .attr("width", barWidth)
      .attr("height", (d) => d)
      .style("fill", "green")
      .attr("transform", "translate(60, 10)")
      .on("mouseover", function (d, i) {
        tooltip.transition().duration(0).style("opacity", 0.9);
        tooltip
          .html(tooltipDate[i] + "<br>" + "U$S " + GDP[i] + " Billions")
          .style("left", 150 + "px")
          .style("top", 100 + "px")
          .attr("data-date", data.data[i][0]);
      })
      .on("mouseout", function (d, i) {
        tooltip.transition().duration(1000).style("opacity", 0);
      });
  }
);
