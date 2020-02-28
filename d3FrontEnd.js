exports.createGraph = function(title, data){
    d3.select("body")
  .append("h3")
  .text(title);
  d3.select("body")
  .selectAll("div")
  .data(data)
  .enter()
  .append("div")
  .style("width", function(d) { return d.amount * 40 + "px"; })
  .style("height", "15px");
}

