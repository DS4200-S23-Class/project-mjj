// Parse the precipitation pattern data
d3.csv("data/precipitation_cleaned.csv").then((rainfall) => {
	console.log(rainfall, (d) => { return (d); })

// Parse the standard precipitation index data
d3.csv("data/Massachusetts_SPI_all.csv").then((spi) => {
	console.log(spi, (d) => { return (d); })

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

// Add X axis  
  FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        //.call(d3.axisBottom(SEP_LEN_SCALE).ticks(9)) 
        .attr("font-size", "10px");

  // Add Y axis
  FRAME1.append("g")       
        .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.bottom + ")")
        //.call(d3.axisLeft(PET_LEN_SCALE).ticks(14))
        .attr("font-size", "10px");

});
});
