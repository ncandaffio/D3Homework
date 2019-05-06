// @TODO: YOUR CODE HERE!
d3.csv("assets/data/data.csv", function(error, data){
    if (error) return console.warn(error);
    var abbr = data.mod(value => value.abbr)
    console.log(abbr);
});