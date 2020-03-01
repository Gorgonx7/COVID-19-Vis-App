
/// <Summary>
/// Entry point for the application, handles hostinig of the server 
/// and direction of traffic through the routes
/// </Summary>

const express = require("express");
const path = require("path");
const router = express.Router();
const platform = "laptop";
//const platform = "uni";
//const platform = "desktop";
const test = require('./d3FrontEnd');
test.createGraph();
//DotEnv config, change per system
require('dotenv').config({path: __dirname + '/config/' + platform + '.env'});

const app = express();
const port = process.env.port || "8000";



router.get('/', (req,res) =>{
    res.sendFile('index.html');
});

//add the router
app.use(express.static(__dirname + '/public/views'));
app.use(express.static(__dirname + '/public/js'));
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname, '/public/img'));
app.set('views', path.join(__dirname, '/views'));
// Define router
app.use('/', router);
// Server Activation
app.listen(port, () => {
    console.log("Listening on port: " + port);
});

