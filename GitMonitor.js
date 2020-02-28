const Git = require('nodegit');
const fs = require('fs');
if(!fs.existsSync('./data/COVID-19.git')){
// Clone a given repository into the `./tmp` folder.
Git.Clone("https://github.com/CSSEGISandData/COVID-19.git", "./data")
  // Look up this known commit.
  
 
  .catch(function(err) { console.log(err); });
} 