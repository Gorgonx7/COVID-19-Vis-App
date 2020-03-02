
var jsdom = require('jsdom');
var htmlStub = '<html><head></head><body><div id="dataviz-container"></div><script src="js/d3.v3.min.js"></script></body></html>' // html file skull with a container div for the d3 dataviz
const { JSDOM } = jsdom;
const { window } = new JSDOM(htmlStub);
const { document } = (new JSDOM('')).window;


exports.createGraph = function(d3, title, data){
  
  var el = window.document.querySelector('#dataviz-container')
	var body = window.document.querySelector('body')
  // append the svg to the container selector
d3.select(el)
.append('svg:svg')
  .attr('width', 600).attr('height', 300)
  .append('circle')
    .attr('cx', 300).attr('cy', 150).attr('r', 30).attr('fill', '#26963c');
    var circleId = 'a2324'  // say, this value was dynamically retrieved from a database

// append the svg to the selector
d3.select(el)
	.append('svg:svg')
		.attr('width', 600).attr('height', 300)
		.append('circle')
			.attr('cx', 300).attr('cy', 150).attr('r', 30).attr('fill', '#26963c')
			.attr('id', circleId) // we assign the circle to an Id here

// write the client-side script manipulating the circle
var clientScript = "d3.select('#" + circleId + "').transition().delay(1000).attr('fill', '#f9af26')"

// append the script to page's body
d3.select(body)
	.append('script')
    .html(clientScript);

var svgsrc = window.document.querySelector('body').innerHTML;
}

