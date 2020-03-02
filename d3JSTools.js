exports.nestData = function(d3, key, rawData, callback){
    callback(d3.nest().key(function(d){
        return d[key];
    }).entries(rawData));
    
}