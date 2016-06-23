var fs = require("fs");
var file = "Indicators.csv";
var out = "out3";
var object = {};
var headers = [];
var array = [];
var array1=[];
var array2=[];
var flag = 0;
var k=0;
var reader = function(fileName,output) {
  console.log(array);
  var inStream=fs.createReadStream(fileName);   //createReadStream
  var writeStream = fs.createWriteStream(output+'.json');  //createWriteStream
  writeStream.write("[");
  //createInterface
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
      if(data.includes('\"')){
        lines=data.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        var str = lines[2].toString();
        lines[2]=str.substring(1,str.length-1);
      }else {
        lines = data.split(",");
      }
      if(lines[0].includes('"')){
        var str = lines[0].toString();
        lines[0]=str.substring(1,str.length-1);
      }
      for (var i = 0; i < lines.length; i++) {
        object[headers[i]] = lines[i];
      }
      if(array.indexOf(lines[0])==-1){
        array.push(lines[0]);
        array1[k]={
          countryName:lines[0],
          total:0
        };
        k++;
      }
      for(var j=0;j<array1.length;j++){
        if(array1[j].countryName==object.CountryName){
          if(object.IndicatorName=="Life expectancy at birth, total (years)"){
            array1[j].total=parseFloat(array1[j].total)+parseFloat(object.Value);
          }
        }
      }
    }
  });
  //end stream
  inStream.on("end", function(){
    //console.log("muni");

      array1.sort(function(a,b){
        return b.total - a.total;
      });
    for (var s=0;s<5;s++){
      writeStream.write(JSON.stringify(array1[s]));
        writeStream.write(",");
    }
    writeStream.write("]");
    //console.log(array1);
  });
};
reader(file,out);
