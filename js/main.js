// Parse the precipitation pattern data
d3.csv("data/precipitation_cleaned.csv").then((precipitation) => {
	console.log(precipitation);

// Parse the standard precipitation index data
d3.csv("data/Massachusetts_SPI_all.csv").then((spi) => {
	console.log(spi);

normalizedPrecipData = {}
Object.keys(precipitation).map(function(columnName) {
  precipitation[ columnName.toLowerCase().replace(" ", "") ] = precipitation[columnName]
})

console.log(precipitation)

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
// Choosing to show data from June across all the years (just for PM-03 since we will add filters later) 

// Find min year (x) value
const MIN_YEAR = d3.min(precipitation, (d) => { return parseInt(d.YEAR); });

// Find max year (x) value
const MAX_YEAR = d3.max(precipitation, (d) => { return parseInt(d.YEAR); });

// Find max precipitation (y) value
const MAX_PRECIP = d3.max(precipitation, (d) => { return parseFloat(d.JUN); });

// Scale years for the x-axis
const YEAR_SCALE = d3.scaleLinear() 
                   .domain([MIN_YEAR - 10, (MAX_YEAR + 10)]) // add some padding  
                   .range([0, VIS_WIDTH]); 

// Scale the precipitation values for the y-axis
const PRECIP_SCALE = d3.scaleLinear()
                   .domain([0, (MAX_PRECIP + 1)]) // add some padding
                   .range([VIS_HEIGHT, 0]);

// Add X axis  
let xAxis = FRAME1.append("g") 
            .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")") 
            .call(d3.axisBottom(YEAR_SCALE).ticks(25).tickFormat(d3.format("d"))) 
            .attr("font-size", "10px")
            .selectAll("text")
              .attr("transform", "translate(-12, 10)rotate(-90)")
              .style("text-anchor", "end");

// Add Y axis
let yAxis = FRAME1.append("g")       
            .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.bottom + ")")
            .call(d3.axisLeft(PRECIP_SCALE).ticks(20))
            .attr("font-size", "10px");

// group the data: I want to draw one line per group
let sumstat = 
  d3.group(precipitation, (d) => { return (d.Region); }); // group function allows to group the calculation per level of a factor

// console.log(sumstat);
// // color palette
// let region_map = sumstat.keys() 
// let regions = Array.from(region_map) // list of region names
// console.log(regions)
// let precip_plot = Object.fromEntries(sumstat)
// console.log(precip_plot)

let color = d3.scaleOrdinal()
  .domain(['Connecticut River', 'Northeast', 'Central', 'Southeast', 'Western', 'Cape Cod and Islands'])
  .range(['red','orange','yellow','green','indigo','purple']);
// console.log(color)
console.log(sumstat.values)
//Draw the line
// FRAME1.selectAll(".line")
//     .data(sumstat)
//     .enter()
//     .append("path")
//       .attr("fill", "none")
//       .attr("stroke", (d) => { return color(d.Region); })
//       .attr("stroke-width", 1.5)
//       .attr("d", ((d) => {
//         return d3.line()
//           .YEAR_SCALE(function(d) { return YEAR_SCALE(d.YEAR); })
//           .PRECIP_SCALE(function(d) { return PRECIP_SCALE(d.JUN); })
//           (d.values);
//       }));

// Plot points on scatter plot
  let myPoint1 = FRAME1.append("g")
                       .selectAll("points")  
                       .data(precipitation)  
                       .enter()       
                       .append("circle")  
                       .attr("cx", (d) => { return (YEAR_SCALE(d.YEAR) + MARGINS.left); }) 
                       .attr("cy", (d) => { return (PRECIP_SCALE(d.JUN) + MARGINS.top); }) 
                       .attr("r", 3)
                       .attr("class", (d) => { return d.Region; });

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
