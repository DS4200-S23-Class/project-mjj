// Parse the precipitation pattern data
d3.csv("data/precipitation_cleaned.csv", function(precipitation) {
	console.log(precipitation);

// Parse the standard precipitation index data
//d3.csv("data/Massachusetts_SPI_all.csv").then((spi) => {
	console.log(spi);

// Set up precipitation line chart

// Set frame dimensions for visualizations
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 

// Create frame for the line chart 
const FRAME1 = d3.select("#vis1")
                 .append("svg")
                 .attr("height", FRAME_HEIGHT)
                 .attr("width", FRAME_WIDTH)
                 .attr("class", "frame"); 

// Set margins for visualizations
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// Set vis dimensions for visualizations
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

// Get a subset of the data based on the month
// choosing to show data from June

// Find min year (x) value
const MIN_YEAR = d3.min(precipitation, (d) => { return parseInt(d.YEAR); });

// Find max year (x) value
const MAX_YEAR = d3.max(precipitation, (d) => { return parseInt(d.YEAR); });

// Find max precipitation (y) value
const MAX_PRECIP = d3.max(precipitation, (d) => { return parseInt(d.JUN); });

// Scale years for the x-axis
const X_YEARS = d3.scaleLinear() 
                   .domain([MIN_YEAR, (MAX_YEAR + 1)]) // add some padding  
                   .range([0, VIS_WIDTH]); 

// Scale the precipitation values for the y-axis
const PRECIP_SCALE = d3.scaleLinear()
                   .domain([0, (MAX_PRECIP + 1)])
                   .range([VIS_HEIGHT, 0]);

// Add X axis  
let xAxis = FRAME1.append("g") 
            .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")") 
            .call(d3.axisBottom(X_YEARS).ticks(9).tickFormat(d3.format("d"))) 
            .attr("font-size", "10px");

// Add Y axis
let yAxis = FRAME1.append("g")       
            .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.bottom + ")")
            .call(d3.axisLeft(PRECIP_SCALE).ticks(14))
            .attr("font-size", "10px");

// group the data: I want to draw one line per group
let sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
  .key((d) => { return (d.Region); })
  .entries(precipitation);

// color palette
let regions = sumstat.map(precipitation, (d) => { return d.key; }); // list of region names

let color = d3.scaleOrdinal()
  .domain(regions)
  .range(['red','orange','yellow','green','indigo','purple']);

  // Draw the line
  FRAME1.selectAll(".line")
      .data(sumstat)
      .enter()
      .append("path")
        .attr("fill", "none")
        .attr("stroke", (precipitation, (d) => { return color(d.key) }))
        .attr("stroke-width", 1.5)
        .attr("d", precipitation, (d) => {
          return d3.line()
            .x(precipitation, (d) => { return x(d.YEAR); })
            .y(precipitation, (d) => { return y(+d.JUN); })
            (d.values);
        });

// // Add the line
// FRAME1.append("path")
//  .datum(precipitation)
//  .attr("fill", "none")
//  .attr("fill", "none")
//  .attr("stroke", "steelblue")
//  .attr("stroke-width", 1.5)
//  .attr("d", d3.line()
//    .x(precipitation, (d) => { return parseInt(d.YEAR); })
//    .y(precipitation, (d) => { return parseInt(d.JUN); })
//    );

// Nest the data by type
// nested = d3.nest()
//  .key(precipitation, (d) => { return d.Region; })
//  .entries(data)

// // Append line groups
// groups = container.selectAll('g.full-line')
//   .data(nested, (d) => { return d.key })

// // ENTER
// groups.enter().append('svg:g')
// .attr( 'class', (d,i) => "full-line#{i}" )

// // EXIT
// d3.transition(groups.exit()).remove()

// // TRANSITION
// d3.transition(groups)

// // Individual Lines
// lines = groups.selectAll('.line').data, (d) => { return [d.values] }

// // Append chart lines
// // ENTER
// lines.enter().append("svg:path")
//  .attr("class","line")
//  .attr("d", d3.svg.line()
//   .interpolate(interpolate)
//   .defined(defined)
//   .x( (d,i) => { return  xScale(d,i) })
//   .y( (d,i) => { return yScale(d,i) })

// // EXIT
// d3.transition( groups.exit().selectAll('.line') )
//   .attr("d", 
//     d3.svg.line()
//       .interpolate(interpolate)
//       .defined(defined)
//       .x( (d,i) => { return xScale(d,i) })
//       .y( (d,i) => { return yScale(d,i) })

// // TRANSITION
// d3.transition(lines)
//   .attr("d", 
//  d3.svg.line()
//    .interpolate(interpolate)
//    .defined(defined)
//        .x( (d,i) => { return xScale(d,i) })
//        .y( (d,i) => { return yScale(d,i) })

});
});
