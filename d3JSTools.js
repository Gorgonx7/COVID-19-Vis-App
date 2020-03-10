var d3 = require('./d3');
exports.nestData = function(key, rawData, callback){
    callback(d3.nest().key(function(d){
        return d[key];
    }).entries(rawData));
    
}
exports.GetLatestData = function(rawData, callback){
    var output = [];
    
    for( const [key, value] of Object.entries(rawData))
    {
        if(value.key == 'Mainland China'){
            exports.nestData('Province/State', value.values, function(chinaValues){
                for(const [province, pValues] of Object.entries(chinaValues)){
                    output.push(pValues.values[pValues.values.length - 1]);
                }
            });
        }
       
        output.push(value.values[value.values.length - 1])
    }
    callback(output);
}
exports.GetMinMaxValue = function(key, rawData) {
    var currentMax = 0;
    var currentMin = 100000000000;
    for(var x = 0; x < rawData.length; x++){
        dataArray = rawData[x];
        if(parseInt(rawData[x][key]) > currentMax){
            currentMax = parseInt(rawData[x][key]);
            
        } else if(parseInt(rawData[x][key]) < currentMin){
            currentMin = parseInt(rawData[x][key]);
        }
    }
    return [currentMin, currentMax];
}