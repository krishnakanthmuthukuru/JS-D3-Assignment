//margins
var margin = {top:20 , right:10, bottom :100, left: 70},
    width = 900 - margin.right -margin.left,
    height = 500 - margin.top - margin.bottom;

//SVG
var svg = d3.select('body')
    .append('svg')
    .attr({
      "width" : width + margin.right+margin.left,
      "height" : height + margin.top + margin.bottom
    })
    .append('g')
        .attr("transform","translate(" + margin.left + ',' + margin.right + ')');

//Scale and Axis
var xScale = d3.scale.ordinal()
   .rangeRoundBands([0,width], 0.2, 0.2);

var yScale = d3.scale.linear()
    .range([height,0]);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");


//Import .json file

d3.json("out3.json", function(error, data){
  if(error){
    console.log("Error: data not loaded.");
  }
  data.forEach(function(d){
    d.countryName = d.countryName;
    d.total = +d.total;
  });
  //specify domains of x-scale and yScale.
  xScale.domain(data.map(function(d){ return d.countryName;}));
  yScale.domain([0,d3.max(data, function(d){return d.total+d.total;})]);

  //draw bars
  svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('height', 0)
      .attr('y', height)
      .transition().duration(3000)
      .delay(function(d,i){return i * 200;})
      //.append('svg')
      .attr({
          'x' : function(d){  return xScale(d.countryName);  },
          'y' : function(d){  return yScale(d.total);  },
          'width' : xScale.rangeBand(),
          'height' : function(d){  return height - yScale(d.total);}
      })
      .style("fill",function(d,i){ return 'rgb(30,30,' + ((i * 30) + 200) +')'});

// label the bars
  svg.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .text(function(d){return Math.round(d.total);})
    .attr('x', function(d){return xScale(d.countryName) + xScale.rangeBand()/2;})
    .attr('y', function(d){ return yScale(d.total);})
    //.attr("transform","rotate(90)")
    .style("fill","white")
    .style("text-anchor","middle");
// draw axis
    svg.append("g")
        .attr("class","x axis")
        .attr("transform","translate(0," + height +")")
        .call(xAxis)
        .append("text")
        .text("Countries")
        .attr("dx","50em")
        .attr("dy","3em")
        .style("font-weight","bold")
        .style("text-anchor","end")
        .style("fill","steelblue");
    svg.append("g")
        .attr("class","y axis")
        .call(yAxis)
        .append("text")
        .text("values")
        .attr("transform","rotate(-90)")
        .attr("dx","-2em")
        .attr("dy","1.4em")
          .style("font-weight","bold")
          .style("fill","steelblue");
});
