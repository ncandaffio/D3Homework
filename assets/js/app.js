// // @TODO: YOUR CODE HERE!
var svgWidth = 800;
var svgHeight = 800;

var margin = {
  top: 40,
  right: 40,
  bottom: 100,
  left: 120
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "income";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
      d3.max(data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
   // create scales
   var yLinearScale = d3.scaleLinear()
     .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
       d3.max(data, d => d[chosenYAxis]) * 1.2
     ])
     .range([0, width]);
 
   return yLinearScale;
 
 }

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
   var leftAxis = d3.axisLeft(newYScale);
 
   yAxis.transition()
     .duration(1000)
     .call(leftAxis);
 
   return yAxis;
 }

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var xlabel = "In Poverty (%):";
  }
  else if (chosenXAxis === "age") {
    var xlabel = "Age (Median)";
  }
  else {
    var xlabel = "Household Income (Median):";
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if (chosenXAxis === "poverty") {
    var ylabel = "In Poverty (%):";
  }
  else if (chosenXAxis === "age") {
    var ylabel = "Age (Median)";
  }
  else {
    var ylabel = "Household Income (Median):";
  }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////











  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<b>${ylabel} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data.csv").then(function(data) {
  //if (err) throw err;

  // parse data
  data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
  });

  console.log(data)

  // xLinearScale function above csv import
  var xLinearScale = xScale(data, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(data, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .attr("transform", `translate(${width}), 0`)
    .call(leftAxis);

  //append state text within the circles
  var textGroup = chartGroup.selectAll("states")
    .data(data)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]) - 7)
    .attr("y", d => yLinearScale(d[chosenYAxis]) + 4)
    .text(d => d["abbr"])
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("fill", "black");

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("fill", "#80ccff")
    .attr("opacity", ".75")
    .attr("stroke", "black")

    console.log(chartGroup.selectAll("text"))


  // Create group for  3 x- axis labels
  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty")
    .classed("active", true)
    .text("In Poverty (%)");


  var ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age")
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = xLabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("value", "income")
  .classed("inactive", true)
  .text("Income (Median)");

  // Create group for  3 y- axis labels
  var yLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(-50, ${height / 2})`);

  var obeseLabel = yLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("value", "obesity")
    .attr("transform", "rotate(-90)")
    .classed("active", true)
    .text("Obesity (%)");

  var smokeLabel = yLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", -20)
    .attr("transform", "rotate(-90)")
    .attr("value", "smokes") 
    .classed("inactive", true)
    .text("Smokes (%)");

  var healthLabel = yLabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", -40)
  .attr("transform", "rotate(-90)")
  .attr("value", "healthcare")
  .classed("inactive", true)
  .text("Lacks Healthcare (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  xLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var xValue = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(data, chosenXAxis);

        // updates y scale for new data
        yLinearScale = yScale(data, chosenYAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "income") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        else {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }});


      // y axis labels event listener
  yLabelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var yValue = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      // replaces chosenXAxis with value
      chosenYAxis = value;

      // console.log(chosenXAxis)

      // functions here found above csv import
      // updates x scale for new data
      yLinearScale = yScale(data, chosenYAxis);

      // updates x axis with transition
      yAxis = renderAxes(yLinearScale, yAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenYAxis === "smokes") {
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
        smokeLabel
          .classed("active", true)
          .classed("inactive", false);
        healthLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenYAxis === "healthcare") {
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
        smokeLabel
          .classed("active", false)
          .classed("inactive", true);
        healthLabel
          .classed("active", true)
          .classed("inactive", false);
      }
      else {
        obeseLabel
          .classed("active", true)
          .classed("inactive", false);
        smokeLabel
          .classed("active", false)
          .classed("inactive", true);
        healthLabel
          .classed("active", false)
          .classed("inactive", true);
      }
    }
    })
});
