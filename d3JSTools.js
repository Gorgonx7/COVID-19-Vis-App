var d3 = require('./d3');
var frontEnd = require('./d3FrontEnd');
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

exports.MapMapData = function(MapData, dataToMap){
    outputObject = {};
    confirmedRange = exports.GetMinMaxValue("Confirmed", dataToMap);
    deathRange = exports.GetMinMaxValue("Deaths", dataToMap);
    recoveredRange = exports.GetMinMaxValue("Recovered", dataToMap);
    confirmedColours = frontEnd.CreateColourScale(confirmedRange);
    deathsColour  = frontEnd.CreateColourScale(deathRange);
    recoveredColours = frontEnd.CreateColourScale(recoveredRange);
    for(var x = 0; x < MapData.objects.subunits.geometries.length; x++){
        d = MapData.objects.subunits.geometries[x];
    
        if(d.properties.CountryValue != undefined){
            if(d.properties.StateValue != undefined){
                country = dataToMap[d.properties.CountryValue];
                if(country != null){
                    if(country.States[d.properties.StateValue] != null){
                        stateValues = country.States[d.properties.StateValue];
                        stateValues.ConfirmedColour = confirmedColours(stateValues.Confirmed);
                        stateValues.DeathsColour = confirmedColours(stateValues.Deaths);
                        stateValues.recoveredColour = confirmedColours(stateValues.Recovered);
                        
                if(outputObject[d.properties.CountryValue] == null){
                    outputObject[d.properties.CountryValue] = { };
                    outputObject[d.properties.CountryValue].States = { };
                    outputObject[d.properties.CountryValue].States[d.properties.StateValue] = stateValues;
                    outputObject[d.properties.CountryValue].SearchString = d.properties.adm0_a3;

                }
                else
                {
                    outputObject[d.properties.CountryValue].States[d.properties.StateValue] = stateValues;
                    outputObject[d.properties.CountryValue].SearchString = d.properties.adm0_a3;
                }
            }
        }
        } 
        else
        {
            stateValues = dataToMap[d.properties.CountryValue];
            
            
            if(stateValues != null)
            {
                stateValues.ConfirmedColour = confirmedColours(stateValues.Confirmed);
            stateValues.DeathsColour = confirmedColours(stateValues.Deaths);
            stateValues.recoveredColour = confirmedColours(stateValues.Recovered);
                if(outputObject[d.properties.CountryValue] == null){
                    outputObject[d.properties.CountryValue] = {};
                    outputObject[d.properties.CountryValue].values = stateValues;
                    outputObject[d.properties.CountryValue].SearchString = d.properties.adm0_a3;
            }
        }
        }
    }
}
    return outputObject;
}

