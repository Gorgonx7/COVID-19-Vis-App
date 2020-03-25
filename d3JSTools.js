var d3 = require('./d3');
exports.nestData = function(key, rawData, callback){
    callback(d3.nest().key(function(d){
        return d[key];
    }).entries(rawData));
    
}
exports.GetLatestData = function(rawData, callback){
    var output = [];
    var outputKey = "";
    var LatestTime = null;
    for( const [Key, value] of Object.entries(rawData))
    {
       
        if(LatestTime == null){
            LatestTime = new Date(Key);
            outputKey = Key;
        }
        if(LatestTime < new Date(Key)){
            LatestTime = new Date(Key);
            outputKey = Key;
        }
    }
    
    callback(rawData[outputKey]);
}
exports.GetMinMaxValue = function(key, rawData) {
    var currentMax = 0;
    var currentMin = 100000000000;
    for(const [Country, value] of Object.entries(rawData)){
        dataArray = rawData[Country];
        if(parseInt(dataArray[key]) > currentMax){
            currentMax = parseInt(dataArray[key]);
            
        } else if(parseInt(dataArray[key]) < currentMin){
            currentMin = parseInt(dataArray[key]);
        }
    }
    return [currentMin, currentMax];
}

exports.GetDataOnDate = function(data, Date, callback){
    exports.nestData("Last Update",data, function(OrganisedData){
        DateArray = OrganisedData.map((s) => {
            return s["Last Update"];
        });
        console.log(DateArray);
    })
}



