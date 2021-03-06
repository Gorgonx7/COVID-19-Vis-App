const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const currentDataLocation = path.join(__dirname, "./data/COVID-19/csse_covid_19_data/csse_covid_19_daily_reports/");


exports.readInData = function(callback){
    var dataarray = [];
    // Process Current Data Files
    fs.readdirSync(currentDataLocation).forEach(file =>{
        if(file.endsWith('.csv')){
            var event2 = fs.createReadStream(currentDataLocation + file).pipe(csv()).on('data', data => {
                dataarray.push(data);
            });
        }
    });   
        setTimeout(() => {

        dataarray = cleanData(dataarray);
            callback(dataarray);
        }, 300);
};

function cleanData(dataArray){
    // This function is intended to clean the loaded data to ensure it is easy to use. 
    // It will provide a standardisation of the name CHINA instead of mainland china
    // Province/State, Country/Region, Last Update, Confirmed, Deaths, Recovered, Latitude, Longitude
    var outputObject = [];
    var TimeOrientatedOutput = {};
    for(var currentCountry = 0; currentCountry < dataArray.length ; currentCountry++){
        var Output = {};
        
        var dataEntry = dataArray[currentCountry];
        
        Output.State = [dataEntry['Province/State']];
        Output.Country = dataEntry['Country/Region'];
        if(Output.Country != "UK" && Output.Country != "United Kingdom" && !Output.Country.includes("China")){
            continue;
        }
        /*
        US, Korea, South, Serbia, North Macedonia, Guadeloupe, Reunion, Martinique, Congo, Tanzania, Mayotte, Eswatini, Timor-Leste, Cape Verde

        */ 
        if(Output.Country.includes("China")){
            Output.Country = "China";
        } else if(Output.Country.includes("UK")){
            Output.Country = "United Kingdom";
        } else if(Output.Country == "US"){
            Output.Country = "United States";
        } else if(Output.Country.includes("Korea")){
            Output.Country = "South Korea";
        }
        
        // Convert time so that it is only day, month year, no seconds minutes and hours
        Output.Time = dataEntry['Last Update'].replace("T", " ").replace(/\//g, "-");
        
        
        // 2020-02-06T23:23:02 example of a time as seen in the data set, we can split on T 2020-03-20
        
        var [EntryDate, Time] = Output.Time.split(" ");
        [Year, Month, Day] = EntryDate.split("-");
        if(Day.length >= 4){
            var Holder =  Year;
            Year = Day;
            Day = Holder;
        }
        if(parseInt(Month) > 12){
            var Holder = Month;
            Month = Day;
            Day = Holder;
        }
        if(Year != "20" || Year !="2020"){
            if(Day == "2020" || Day == "20"){
                var Holder = Year;
                Year = Day;
                Day = Holder;
            } else if(Month == "2020" || Month == "20"){
                var Holder = Year;
                Year = Month;
                Month = Holder;
            }
        }
        if(Month.length == 1){
            Month = "0" + Month;
        }
        if(Day.length == 1){
            Day = "0" + Day;
        }
        if(Year.length == 2){
            Year = "20" + Year;
        }
        if(Day == "2020"){
            Day = "20";
        }
        Output.Time = Year + "-" + Month + "-" + Day;
        if(dataEntry.Confirmed == ""){
            dataEntry.Confirmed = "0";
        } if(dataEntry.Deaths == ""){
            dataEntry.Deaths = "0";
        } if(dataEntry.Recovered == ""){
            dataEntry.Recovered = "0";
        }
        Output.Confirmed = parseInt(dataEntry.Confirmed);
        
        Output.Deaths = parseInt(dataEntry.Deaths);
        Output.Recovered = parseInt(dataEntry.Recovered);
        Output.Position = [dataEntry.Latitude, dataEntry.Longitude];
        
            outputObject.push(Output);
            if(TimeOrientatedOutput[Output.Time] == null){
                TimeOrientatedOutput[Output.Time] = {};
            } 
            if(TimeOrientatedOutput[Output.Time][Output.Country] != null){
                var Add = true;
                for(var x = 0; x < TimeOrientatedOutput[Output.Time][Output.Country].States.length; x++){
                    var Values = TimeOrientatedOutput[Output.Time][Output.Country].States[x];
                    if(Values.Confirmed == Output.Confirmed && Output.Deaths == Values.Deaths && Output.Recovered == Values.Recovered && Output.Time == Values.Time){
                        Add = false;
                    }
                }
                if(Add){
                TimeOrientatedOutput[Output.Time][Output.Country].Confirmed += Output.Confirmed;
                TimeOrientatedOutput[Output.Time][Output.Country].Deaths += Output.Deaths;
                TimeOrientatedOutput[Output.Time][Output.Country].Recovered += Output.Recovered;
                TimeOrientatedOutput[Output.Time][Output.Country].States.push(Output);
                if(Output.State[0] != undefined){
                TimeOrientatedOutput[Output.Time][Output.Country].StateNames.push(Output.State[0]);
                }
                }
            } else{
                TimeOrientatedOutput[Output.Time][Output.Country] = {};
                TimeOrientatedOutput[Output.Time][Output.Country].Confirmed = Output.Confirmed;
                TimeOrientatedOutput[Output.Time][Output.Country].Deaths = Output.Deaths;
                TimeOrientatedOutput[Output.Time][Output.Country].Recovered = Output.Recovered;
                TimeOrientatedOutput[Output.Time][Output.Country].Country = Output.Country;
                TimeOrientatedOutput[Output.Time][Output.Country].States = [Output];
                if(Output.State[0] != undefined){
                TimeOrientatedOutput[Output.Time][Output.Country].StateNames = [Output.State[0]];
                } else{
                    TimeOrientatedOutput[Output.Time][Output.Country].StateNames = [];
                }
            }   
    }
    // forwards Data Propergation
    for( const [time, CountryData] of Object.entries(TimeOrientatedOutput)){   
        for(const [CountryName, Data] of Object.entries(CountryData)){
            
            var [year, month, day] = time.split('-');
            var searchString = time.substr(0,time.length - 2) + (parseInt(time.substr(time.length - 2, time.length -1)) + 1);
            if(TimeOrientatedOutput[searchString] == null && parseInt(day) >= 30){
                // we try the first of the next month;
                month =  month[0] + (parseInt(month[1]) + 1);
                // will not work after a year, but hopefully this is all over by then
                if(TimeOrientatedOutput[year + "-" + month + "-" + day] != null){
                    if(TimeOrientatedOutput[year + "-" + month + "-" + day][CountryName] == null ){
                        // then we need to use last months data
                        TimeOrientatedOutput[year + "-" + month + "-" + day][CountryName] = Data;
                    } else if(Data.StatesNames.length > 1){
                        for(var x = 0; x < Data.StateNames.length; x++){
                            var names = TimeOrientatedOutput[year + "-" + month + "-" + day][CountryName].StateNames;
                            if(!names.includes(Data.StateNames[x])){
                                TimeOrientatedOutput[year + "-" + month + "-" + day][CountryName].States.push(Data.States[x]);
                                TimeOrientatedOutput[year + "-" + month + "-" + day][CountryName].StateNames.push(Data.StateNames[x])
                            }

                        }
                        
                    }
                }
            } else{
                if(TimeOrientatedOutput[searchString] != null){
                if(TimeOrientatedOutput[searchString][CountryName] == null){
                   
                    TimeOrientatedOutput[searchString][CountryName] = Data;
                }else if(Data.StateNames.length > 1){
                    var Names = TimeOrientatedOutput[searchString][CountryName].StateNames;
                    for(var x = 0; x < Data.StateNames.length; x++){                      
                        
                        if(!Names.includes(Data.StateNames[x])){
                            if(Data.States[x].Time == time){
                            TimeOrientatedOutput[searchString][CountryName].States.push(Data.States[x]);
                            TimeOrientatedOutput[searchString][CountryName].StateNames.push(Data.StateNames[x])
                            }
                        }

                    }
                    
                }
            }
            }
        }
    }
    function ConvertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var ChinaString = 'Date, Confirmed, Deaths, Recovered\n';
        var UKString = 'Date, Confirmed, Deaths, Recovered\n';

        for (const [date, dateData] of Object.entries(array)) {
            let line = date + ',';
            if(dateData['China'] != null){
                let China = dateData['China'];
                ChinaString += line + China.Confirmed + ',' + China.Deaths + ',' + China.Recovered + '\n'

            }
            if(dateData['United Kingdom'] != null){
                UK = dateData['United Kingdom'];
                UKString += line + UK.Confirmed + ',' + UK.Deaths + ',' + UK.Recovered + '\n';
            }
            
        }
        var fs = require('fs');
        var x = fs.writeFileSync('china.csv', ChinaString, (error) => console.log(error));
        
        var x = fs.writeFileSync('uk.csv', UKString, (error) => console.log(error));
        
        return [UKString, ChinaString];
    }
    var out = ConvertToCSV(TimeOrientatedOutput);
    console.log(out);
    return TimeOrientatedOutput;
}
