var d3 = require('./d3');
var jsdom = require('jsdom');

exports.createGraph = function(title, data){
  var htmlStub = '<html><head></head><body><div id="dataviz-container"></div><script src="js/d3.v3.min.js"></script></body></html>' // html file skull with a container div for the d3 dataviz
  const { JSDOM } = jsdom;
  const { window } = new JSDOM(htmlStub);
  const { document } = window.document;
  
  var el = window.document.querySelector('#dataviz-container')
	var body = window.document.querySelector('body')
  // append the svg to the container selector
  d3.select(el).append('Strong').html("d3 Test adapt");
    var circleId = 'a2324'  // say, this value was dynamically retrieved from a database

// append the svg to the selector
d3.select(el)
	.append('svg:svg')
		.attr('width', 600).attr('height', 300)
		.append('circle')
			.attr('cx', 300).attr('cy', 150).attr('r', 30).attr('fill', '#26963c')
			.attr('id', circleId); // we assign the circle to an Id here

// write the client-side script manipulating the circle
var clientScript = "d3.select('#" + circleId + "').transition().delay(1000).attr('fill', '#f9af26')"

// append the script to page's body
d3.select(body)
	.append('script')
    .html(clientScript);


var svgsrc = window.document.querySelector('html').innerHTML;
return svgsrc;
}

exports.createBarChart = function(title, data, axisRange){
  var htmlStub = '<html><head></head><body><div id="dataviz-container"></div><script src="js/d3.v3.min.js"></script></body></html>' // html file skull with a container div for the d3 dataviz
  const { JSDOM } = jsdom;
  const { window } = new JSDOM(htmlStub);
  const { document } = window.document;
  var el = window.document.querySelector('#dataviz-container');
  var body = window.document.querySelector('body');
  const margin = 60;
  const width = 1000 - 2 * margin;
  const height = 600 - 2 * margin;

    
  d3.select(el).append('svg').append('g').attr('transform', `translate(${margin}, ${margin})`);
  const chart = d3.select(el).select('svg');
  const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([axisRange[0], axisRange[1]]);
    
  chart.append('g')
    .call(d3.axisLeft(yScale));
  
   const xScale = d3.scaleBand()
    .range([0, width])
    .domain(sample.map((s) => s.language))
    .padding(0.2)

  chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  return window.document.querySelector('html').innerHTML;

}
