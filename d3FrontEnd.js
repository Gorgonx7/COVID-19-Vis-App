var d3 = require('./d3');
var jsdom = require('jsdom');
var topo = require('topojson');
var d3Tools = require('./d3JSTools');
exports.currentDom;
exports.currentMapData;
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

  const margin = 80;
  const width = 1500 - 2 * margin;
  const height = 600 - 2 * margin;

    
  d3.select(el).append('svg').append('g').attr('transform', `translate(${margin}, ${margin})`);

  const chart = d3.select(el).select('svg');
  
  chart.attr('Height', `${height + 2 * margin}`);
  chart.attr('Width', `${width + 2* margin}`);
//chart.style('padding-left','10px');
  const yData = data.map((s) => s.Confirmed);

  var yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0,axisRange[1]]);

    //var yScale = d3.scaleLinear().range([height, 0]).domain([0,100]);
 //data.map((obj) => console.log(obj.Confirmed));
  chart.append('g').attr('id', 'yAxis').attr("transform", `translate(${margin}, 0)`)
    .call(d3.axisLeft(yScale));
  
   const xScale = d3.scaleBand()
    .range([0, width])
    .domain(data.map((s) =>{ if(s['Country/Region'] != 'Mainland China'){
        return s['Country/Region'];
    } else { return s['Province/State'];
  }
})).padding(0.2)

//Horizontal
chart.append('g')
.attr('class', 'grid').attr('transform', `translate(${margin},0)`)
.call(d3.axisLeft()
    .scale(yScale)
    .tickSize(-width, 0, 0)
    .tickFormat(''));
//end grid lines
// append x axis
  chart.append('g')
    .attr('transform', `translate(${margin}, ${height})`).attr('id', 'xAxis')
    .call(d3.axisBottom(xScale));
 
    d3.select(el).select('#xAxis').selectAll("text")
  .attr("y", 0)
  .attr("x", 10)
  .attr("dy", ".35em")
  .attr("transform", "rotate(90)")
  .style("text-anchor", "start");
  // finish append x axis
  // create bars
  chart.selectAll()
  .data(data)
  .enter()
  .append('rect')
  .attr('y', (s) => {
    var y = s.Confirmed;
    return yScale(y);
  })
  .attr('height', (s) => height - yScale(s.Confirmed))
    .attr('width', xScale.bandwidth())
    .attr('x', (s) => { if(s['Country/Region'] != 'Mainland China'){
      return xScale(s['Country/Region']) + margin;
  } else { return xScale(s['Province/State']) + margin;
  }
  });
 // finish creating bars
 // axis labels
 chart.append('text')
    .attr('x', -(height / 2) - margin)
    .attr('y', margin / 2.5 )
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Confirmed Cases')

    chart.append('text')
    .attr('x',width / 2 ).attr('y', height + margin).attr('text-anchor', 'middle').text('Country');
chart.append('text')
    .attr('x', width / 2 + margin)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text(title);


  
  return window.document.querySelector('html').innerHTML;

}

exports.drawMap = function(rawData, minMax){
  var htmlStub = '<html><head><script src="jquery-3.4.1.min.js"></script> <script src="https://d3js.org/d3.v5.min.js"></script><link rel="stylesheet" href="index.css"></head><body><div id="dataviz-container"></div></body></html>' // html file skull with a container div for the d3 dataviz
  const { JSDOM } = jsdom;
  const { window } = new JSDOM(htmlStub);
  const { document } = window.document;
  var el = window.document.querySelector('#dataviz-container');
  var body = window.document.querySelector('body');
  const Width = 1920;
  const Height = 1080;
  var svg = d3.select(el).append('svg').attr('width',Width).attr('height', Height).attr('id', 'SVG');
  var worldData = require('./world4.json');
  worldData.objects.subunits = worldData.objects.ne_10m_admin_1_states_provinces;

  var projection = d3.geoMercator()
      .scale(400)
      .translate([Width / 2, Height / 2]);
    
  var path = d3.geoPath()
  .projection(projection);

  var colourScale = exports.CreateColourScale(minMax);
var CurrentData;
  svg.selectAll(".subunit")
    .data(topo.feature(worldData, worldData.objects.subunits).features)
    .enter().append("path")
    .attr("class", function(d) {

      return "subunit " + d.properties.adm0_a3; 
   
    }).attr('data-State', function(d){
   
      return d.properties.gn_name;
   
    })
   .attr('stroke', function(d){
        for(const [Country, value] of Object.entries(rawData)){  
          if(d.properties.admin.toLowerCase().includes(rawData[Country].Country.toLowerCase())){
            if(rawData[Country].States.length == 1){
              d.properties.CountryValue = Country;
              d.properties.StateValue = undefined;
              d.properties.DataValues = rawData[Country];
              return colourScale(rawData[Country].Confirmed);
              }
              for(const [State, value] of Object.entries(rawData[Country].States)){
                if(d.properties.name.includes(value.State[0]) || d.properties.gn_name.includes(value.State[0])){
                  d.properties.DataValues = value;
                  d.properties.CountryValue = Country;
                  d.properties.StateValue = value.State[0];
                  return colourScale(value.Confirmed);
                }
              }
            //  return colourScale(rawData[Country].Confirmed);
          }     
        }

    }).attr('style', function(d){
     if(d.properties.DataValues != null){
      return "fill: " + colourScale(d.properties.DataValues.Confirmed);
     }
    }).attr('data-Confirmed', function(d){
      if(d.properties.DataValues != null){
        return d.properties.DataValues.Confirmed;
       }
    }).attr('data-Deaths', function(d){
      if(d.properties.DataValues != null){
        return d.properties.DataValues.Deaths;
       }
    }).attr('data-Recovered', function(d){
      if(d.properties.DataValues != null){
        return d.properties.DataValues.Recovered;
       }
    })
    .attr("d", path);
    exports.currentMapData = worldData;
    exports.currentDom = window.document.querySelector('html').innerHTML;
  return window.document.querySelector('html').innerHTML;
}
exports.HeatMapOfCoronaCases = function(rawData, minMax){
  var htmlStub = "<html>" + exports.drawMap(rawData, minMax) + "</html>";
  const { JSDOM } = jsdom;
  const { window } = new JSDOM(htmlStub);
  const { document } = window.document;
  var el = window.document.querySelector('#dataviz-container');
  var body = window.document.querySelector('body');
 // var svg = d3.select(el).select('svg');
  d3.select(body).append('script').attr('src', 'index.js');
  window.document.querySelector('html').innerHTML = exports.CreateTimeSlider(window.document.querySelector('html').innerHTML);
  exports.currentDom = window.document.querySelector('html').innerHTML;
  return window.document.querySelector('html').innerHTML;
}
// Decide based off spread of data, if we use bins or not.
exports.CreateColourScale = function(minMax){
 return color = d3.scaleLinear().domain(minMax)
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#0AFF43"), d3.rgb('#FF1301')]);
}

exports.CreateTimeSlider = function(HTMLstub){
  const { JSDOM } = jsdom;
  const { window } = new JSDOM(HTMLstub);
  const { document } = window.document;
  var el = window.document.querySelector('#dataviz-container');
  var body = window.document.querySelector('body');
  
  // JSDom slider control, link to function that class back to the server to clear the dom and update the map
  d3.select(body).append("div").attr('id', 'UserController').append('input').attr('type', 'date').attr('id', 'DateSelector');
  var controller = window.document.getElementById('DateSelector');
  d3.select(controller).attr('onchange', 'onDateChange()');
  exports.currentDom = window.document.querySelector('html').innerHTML;
  return window.document.querySelector('html').innerHTML;
}

