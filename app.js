// @TODO: YOUR CODE HERE!
var svgWidth = 800
var svgHeight = 600
var margin = {
   top: 40,
   right: 40,
   bottom: 40,
   left: 40
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter").append("svg")
   .attr("width", svgWidth)
   .attr("height", svgHeight)

var chartGroup = svg.append("g")
   .attr("transform", `translate(${margin.left}, ${margin.top})`);

var poverty = []
var lacksHealthcare = []


d3.csv("data.csv", function(stateDemo, error) {
    poverty.push(+stateDemo.poverty) 
    lacksHealthcare.push(+stateDemo.healthcare)
});

console.log(lacksHealthcare)

var xLinearScale = scaleLinear()