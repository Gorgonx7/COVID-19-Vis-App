const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const currentDataLocation = path.join(__dirname, "/data/csse_covid_19_data/csse_covid_19_daily_reports/");
const archivedDataLocation = path.join(__dirname, "/data/archived_data/archived_daily_case_updates/");

exports.readInData = function(callback){
    var dataarray = [];
    // Process Current Data Files
    var files = fs.readdirSync(currentDataLocation).forEach(file =>{
        if(file.endsWith('.csv')){
            var event2 = fs.createReadStream(currentDataLocation + file).pipe(csv()).on('data', data => {
                dataarray.push(data);
            });
        }
        var archivedFiles = fs.readdirSync(archivedDataLocation).forEach(file2 =>{
            
                fs.createReadStream(archivedDataLocation + file2)
                .pipe(csv())
                .on('data', data => {
                dataarray.push(data);
                 });    
        });
    });   
        setTimeout(() => {
            callback(dataarray);
        }, 300);
};

