
/// <Summary>
/// Entry point for the application, handles hostinig of the server 
/// and direction of traffic through the routes
/// </Summary>

const express = require("express");
const path = require("path");
const router = express.Router();
const platform = "laptop";
const d3 = require('./d3');
const _ = require('underscore');
//const platform = "uni";
//const platform = "desktop";

//DotEnv config, change per system
require('dotenv').config({path: __dirname + '/config/' + platform + '.env'});

const app = express();
const port = process.env.port || "8000";

var dataArray; 
var d3Tools = require('./d3JSTools');
var frontEnd = require('./d3FrontEnd');
require('./Load_data').readInData(function(dataArray){
    //console.log(dataArray);
    var organisedData;
    require('./d3JSTools').nestData('Country/Region', dataArray, function(output){
        organisedData = output;
        require('./d3JSTools').GetLatestData(organisedData, function(latestData){
            var minMax = d3Tools.GetMinMaxValue("Confirmed", latestData);
            var WindowToDisplay = frontEnd.createBarChart("Latest Statistics For Corona Virus Rate", organisedData, minMax);
        });
    });

});

router.get('/', (req,res) =>{
    
    res.send(require('./d3FrontEnd').createBarChart());
    //res.sendFile('index.html');
});

//add the router
app.use(express.static(__dirname + '/public/views'));
app.use(express.static(__dirname + '/public/js'));
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public/img'));
app.set('views', path.join(__dirname, '/views'));
// Define router
app.use('/', router);
// Server Activation
app.listen(port, () => {
    console.log("Listening on port: " + port);
});

