var fs = require("fs");
var file = "Indicators.csv";
var out = "out2";
var object = {};
var headers = [];
var array = [];
var array1 = [];
var start = 0;
var end = 55;
var flag = 0;
var count = 0;
var count1 = 0;
var reader = function(start,end,fileName,output) {
  for(var d = start; d <= end ;d++){
    array[d] = {
      year : parseInt(d) + 1960,
      gender: 0,
      values : 0
    };
    array1[d] = {
      year : parseInt(d) + 1960,
      gender: 0,
      values : 0
    };
  }
  //console.log(array);
  var inStream=fs.createReadStream(fileName);
  var writeStream = fs.createWriteStream(output+'.json');
  writeStream.write("[");
  var readLine=require("readline").createInterface({
    input:inStream
  });
  readLine.on("line", function (line) {
    var data = line.toString();
    if(flag==0){
      headers = data.split(",");
      flag=1;
    }
    else{
      var lines;
      if(data.includes("\"")){
        lines=data.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        var str = lines[2].toString();
        lines[2]=str.substring(1,str.length-1);
      }else {
        lines = data.split(",");
      }
      for (var i = 0; i < lines.length; i++) {

        object[headers[i]] = lines[i];
      }
      for (var j = start ; j <= end ; j++){
      if(object["CountryName"].indexOf("Asia") != -1){
          if(array[j].year==object["Year"]){
            if(object["IndicatorName"]=="Life expectancy at birth, female (years)"){
              if(count==0){
                array[j].gender = 'female';
              array[j].values += parseFloat(object["Value"]);
              count=1;
            }else{
              array[j].gender = 'female';
              array[j].values += parseFloat(object["Value"])/2;
            }
          }
          }
        }
      }
      for (var j = start ; j <= end ; j++){
      if(object["CountryName"].indexOf("Asia") != -1){
          if(array[j].year==object["Year"]){
            if(object["IndicatorName"]=="Life expectancy at birth, male (years)"){
              if(count==1){
                array1[j].gender = 'male';
              array1[j].values += parseFloat(object["Value"]);
              count=2;
            }else{
              array1[j].gender = 'male';
              array1[j].values += parseFloat(object["Value"])/2;
            }
          }
          }
        }
      }
      //var last=lines[lines.length-1];
      //object[headers[lines.length-1]]=last.substring(1,last.length-1);
      //writeStream.write(JSON.stringify(object));
      //writeStream.write(",");
    }
  });
  inStream.on("end", function(){
    for (var k=start;k<=end;k++){
      writeStream.write(JSON.stringify(array[k]));
        writeStream.write(",");
      writeStream.write(JSON.stringify(array1[k]));
      console.log(array[k]);
      console.log(array1[k]);
      writeStream.write(",");
    }
    writeStream.write("]");
  });
};
reader(start,end,file,out);
