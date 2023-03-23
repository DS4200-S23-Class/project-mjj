// Set frame dimensions for visualizations
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 

// Set margins for visualizations
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// Set vis dimensions for visualizations
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

// Create frame for the line chart 
const FRAME1 = d3.select("#vis1")
                 .append("svg")
                 .attr("height", FRAME_HEIGHT)
                 .attr("width", FRAME_WIDTH)
                 .attr("class", "frame"); 

// Create frame for map
const FRAME2 = d3.select("#vis2")
                 .append("svg")
                 .attr("height", FRAME_HEIGHT)
                 .attr("width", FRAME_WIDTH)
                 .attr("class", "frame"); 

// Create frame for scatterplot
const FRAME3 = d3.select("#vis3")
                 .append("svg")
                 .attr("height", FRAME_HEIGHT)
                 .attr("width", FRAME_WIDTH)
                 .attr("class", "frame"); 

// Create a legend
const LEGEND = d3.select("#legend")
                  .append("svg")
                  .attr("height", FRAME_HEIGHT)
                  .attr("width", FRAME_WIDTH);

// Points for the legend
LEGEND.append("circle").attr("cx",10).attr("cy",50).attr("r", 6).style("fill", "red").attr("class", "mark");
LEGEND.append("circle").attr("cx",10).attr("cy",70).attr("r", 6).style("fill", "orange").attr("class", "mark");
LEGEND.append("circle").attr("cx",10).attr("cy",90).attr("r", 6).style("fill", "gold").attr("class", "mark");
LEGEND.append("circle").attr("cx",10).attr("cy",110).attr("r", 6).style("fill", "green").attr("class", "mark");
LEGEND.append("circle").attr("cx",10).attr("cy",130).attr("r", 6).style("fill", "indigo").attr("class", "mark");
LEGEND.append("circle").attr("cx",10).attr("cy",150).attr("r", 6).style("fill", "magenta").attr("class", "mark");

// Text for the legend
LEGEND.append("text").attr("x", 20).attr("y", 55).text("Connecticut River").style("font-size", "15px").style("fill", "black");
LEGEND.append("text").attr("x", 20).attr("y", 75).text("Northeast").style("font-size", "15px").style("fill", "black");
LEGEND.append("text").attr("x", 20).attr("y", 95).text("Central").style("font-size", "15px").style("fill", "black");
LEGEND.append("text").attr("x", 20).attr("y", 115).text("Southeast").style("font-size", "15px").style("fill", "black");
LEGEND.append("text").attr("x", 20).attr("y", 135).text("Western").style("font-size", "15px").style("fill", "black");
LEGEND.append("text").attr("x", 20).attr("y", 155).text("Cape Cod and Islands").style("font-size", "15px").style("fill", "black");

// Parse the precipitation pattern data
d3.csv("data/precipitation_cleaned.csv").then((precipitation) => {
  // Read into dataset and print data
	console.log(precipitation);

// Parse the combined precipitation and standard precipitation index data
d3.csv("data/combined_prep_spi.csv").then((combined) => {
  // Read into dataset and print data
  console.log(combined);

  // Set up precipitation line chart - NOT FULLY IMPLEMENTED 

  // Find max precipitation (y) value
  const MAX_PRECIP = d3.max(precipitation, (d) => { return parseFloat(d.Precipitation); });

  // Set x axis labels
  const x = d3.scaleBand()
              .range([0, VIS_WIDTH])
              .domain(precipitation.map((d) => { return d.Month; }))
              .padding(0.2);

  // Scale the precipitation values for the y-axis
  const y = d3.scaleLinear()
                .domain([0, (MAX_PRECIP + 1)]) // add some padding
                .range([VIS_HEIGHT, 0]);

  // Add X axis  
  let xAxis = FRAME1.append("g") 
              .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")") 
              .call(d3.axisBottom(x)) 
              .attr("font-size", "10px")
              .selectAll("text")
                .attr("transform", "translate(10, 0)")
                .style("text-anchor", "end");

  // Add Y axis
  let yAxis = FRAME1.append("g")       
              .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.bottom + ")")
              .call(d3.axisLeft(y).ticks(20))
              .attr("font-size", "10px");

  // Label the x axis
  FRAME1.append("text")
    .attr("x", MARGINS.left + VIS_WIDTH/2)
    .attr("y", VIS_HEIGHT + 90)
    .text("Month")
    .attr("class", "axes");
      
  // Label the y axis 
  FRAME1.append("text")
    // .attr("text-anchor", "middle")
    .attr("x", 0 - VIS_HEIGHT/2 - MARGINS.top)
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .text("Precipitation (inches)")
    .attr("class", "axes");
  
  // Set color of the points based on region
  const region_color = d3.scaleOrdinal()
    .domain(["Connecticut River", "Northeast", "Central", "Southeast", "Western", "Cape Cod and Islands"])
    .range(["red", "orange", "gold", "green", "indigo", "magenta"]);

  // Plot points on plot
  let myPoint1 = FRAME1.append("g")
                       .selectAll("points")  
                       .data(precipitation)  
                       .enter()       
                       .append("circle")  
                       .attr("cx", (d) => { return (x(d.Month) + MARGINS.left); }) 
                       .attr("cy", (d) => { return (y(d.Precipitation) + MARGINS.top); }) 
                       .attr("r", 3)
                       .attr("fill", (d) => { return region_color(d.Region); })
                       .attr("transform", "translate(13, 0)")
                        // Make all the points non-visible first
                       .attr("display", "none")
                       .attr("class", "mark");
    
  // Filter plot by selected year(s)
  // Drop down menu by year for users 
  let yearOptions = "";
  for(let i=1838; i<=2019 ; i++) yearOptions += `<option>${i}</option>`;
  document.querySelector("[name=check]").innerHTML = yearOptions;

  function updateYear () {
    // retrieve the year chosen by the user from the drop down menu
    let yearMenu = document.getElementById("selectYear");
    let selected_year = yearMenu.options[yearMenu.selectedIndex].text;
    return selected_year;
  };

  // Filter plot by selected region(s)
  d3.selectAll(".region-button").on("change", function () {
    // retrieve the region associated with the checked/unchecked box
    let selected_region = this.value, 
    // determine whether the box is checked or unchecked
    display2 = this.checked ? region_display = "inline" : region_display = "none";

    // store the data for regions associated with checked boxes
    if (region_display == "inline" && shown_regions.includes(selected_region) == false){
      shown_regions.push(selected_region);
    // store the data for regions associated with unchecked boxes
    } else if (region_display == "none" && shown_regions.includes(selected_region)){
        region_index = shown_regions.indexOf(selected_region);
        shown_regions.splice(region_index, 1);
    };
  });

  // List of groups (here I have one group per column)
  let allRegions = precipitation.map((d) => { return d.Region; });

  // retrieve the year selected by the user in the drop down menu for the line chart
  d3.select("#btn1").on("click", function() {
    selected_year = updateYear();

    // reset the plot so that no points or lines appear
    FRAME1.selectAll(".mark")
          .attr("display", "none");

    FRAME1.selectAll(".line")
          .attr("display", "none");

      // Show data pertaining to regions with checked boxes
      for (let j = 0; j < shown_regions.length; j++) {
        let lineFilter = precipitation.filter(function(d) {return d.Region == shown_regions[j]; })
                                      .filter(function(d) { return d.YEAR == selected_year; });

        // show lines for each checked region
        let line = FRAME1.append("g")
                         .append("path")
                         .datum(lineFilter)
                         .attr("d", d3.line()
                            .x(function(d) { return (x(d.Month) + MARGINS.left); })
                            .y(function(d) { return (y(d.Precipitation) + MARGINS.top); })
                            )
                         .attr("stroke", (d) => { return region_color(shown_regions[j]); })
                         .attr("transform", "translate(13, 0)")
                         .style("stroke-width", 2)
                         .style("fill", "none")
                         .attr("class", "line")

        FRAME1.selectAll(".mark")
          // Show data pertaining to the selected year from the dropbox menu
          .filter(function(d) { return d.YEAR == selected_year; })
          .filter(function(d) { return d.Region == shown_regions[j]; })
          .attr("display", "inline");
    };
  });

  // Tooltip

  // Create tooltip
  const TOOLTIP = d3.select("#vis1")
                    .append("div")
                    .attr("class", "tooltip")
                    // Make it nonvisible at first
                    .style("opacity", 0); 

  // Event handler
  function handleMouseover(event, d) {
    // on mouseover, make opaque 
    TOOLTIP.style("opacity", 1); 
  }

  // Event handler
  function handleMousemove(event, d) {
   // position the tooltip and fill in information 
   TOOLTIP.html("Month: " + d.Month + "<br>Precipitation: "+ d.Precipitation + "<br>Year: " + d.YEAR + "<br>Region: " + d.Region)
           .style("left", (event.pageX + 50) + "px") //add offset
                                                       // from mouse
           .style("top", (event.pageY - 30) + "px"); 
  };

  // Event handler
  function handleMouseleave(event, d) {
    // on mouseleave, make the tooltip transparent again 
    TOOLTIP.style("opacity", 0); 
  };

  // Add tooltip event listeners
  FRAME1.selectAll(".mark")
        .on("mouseover", handleMouseover)
        .on("mousemove", handleMousemove)
        .on("mouseleave", handleMouseleave); 



  // Add brushing
  // FRAME1.call( d3.brush()                 // Use d3.brush to initalize a brush feature
  //                .extent( [ [0,0], [FRAME_WIDTH, FRAME_HEIGHT] ] ) // establish the brush area (maximum brush window = entire graph area)
  //                .on("start brush", updateChart1)); // 'updateChart' is triggered every time the brush window gets altered

  // // When points are brushed over in any plot, the aligned points in the other two plots get highlighted with a raised opacity and attain a black border. 
  // function updateChart1(event) {
  //   selection = event.selection;
  //   myPoint1.classed("selected", (precipitation, (d) => { return isBrushed(selection, x(d.x) + MARGINS.left, y(d.Precipitation) + MARGINS.top ); }) );
  //   myPoint3.classed("selected", (precipitation, (d) => { return isBrushed(selection, x(d.x) + MARGINS.left, y(d.Precipitation) + MARGINS.top ); }) );
  // };

  // Set up map showing drought severities across regions in Massachusetts (IN-PROGRESS)
  
  // Prepare the SVG container for placing the map so it has all the necessary features
  // const g = svg.call(zoom).append("g");
  // g.append("rect")
  //   .attr("width", WIDTH * OVERLAY_MULTIPLIER)
  //   .attr("height", HEIGHT * OVERLAY_MULTIPLIER)
  //   .attr(
  //     "transform",
  //     `translate(-${WIDTH * OVERLAY_OFFSET},-${HEIGHT * OVERLAY_OFFSET})`
  //   )
  //   .style("fill", "none")
  //   .style("pointer-events", "all");

  // const projection = d3
  // .geoMercator()
  // .center([114.1095, 22.3964])
  // .scale(80000)
  // .translate([WIDTH / 2, HEIGHT / 2]);

  // const path = d3.geoPath().projection(projection);
  // const color = d3.scaleOrdinal(d3.schemeCategory20c.slice(1, 4));

  // Set up precipitation vs. drought level scatterplot - FULLY IMPLEMENTED ASIDE FROM LINKING

  // Find min SPI (x) value
  const MIN_DROUGHT = d3.min(combined, (d) => { return parseFloat(d.x); });

  // Find max SPI (x) value
  const MAX_DROUGHT = d3.max(combined, (d) => { return parseFloat(d.x); });

  // Find max precipitation (y) value
  const MAX_PRECIP3 = d3.max(combined, (d) => { return parseFloat(d.Precipitation); });

  // Scale SPI for the x-axis
  const x3 = d3.scaleLinear() 
                     .domain([MIN_DROUGHT - 1, (MAX_DROUGHT + 1)]) // add some padding  
                     .range([0, VIS_WIDTH]); 

  // Scale the precipitation values for the y-axis
  const y3 = d3.scaleLinear()
                     .domain([0, (MAX_PRECIP3 + 1)]) // add some padding
                     .range([VIS_HEIGHT, 0]);

  // Add X axis  
  const xAxis3 = FRAME3.append("g") 
              .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")") 
              .call(d3.axisBottom(x3).tickFormat(d3.format("d"))) 
              .attr("font-size", "10px")
              .selectAll("text")
                .attr("transform", "translate(2, 0)")
                .style("text-anchor", "end");

  // Add Y axis
  const yAxis3 = FRAME3.append("g")       
              .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.bottom + ")")
              .call(d3.axisLeft(y3).ticks(20))
              .attr("font-size", "10px");

  // Label the x axis
  FRAME3.append("text")
    .attr("x", MARGINS.left + VIS_WIDTH/2)
    .attr("y", VIS_HEIGHT + 90)
    .text("Drought Severity (SPI)")
    .attr("class", "axes");
      
  // Label the y axis 
  FRAME3.append("text")
    .attr("x", MARGINS.left - 50)
    .attr("y", VIS_HEIGHT - 100)
    .attr("transform", "translate(-290, 250)rotate(-90)")
    .text("Precipitation (inches)")
    .attr("class", "axes");

  // Plot points on scatter plot
  let myPoint3 = FRAME3.append("g")
                       .selectAll("points")  
                       .data(combined)  
                       .enter()       
                       .append("circle")  
                       .attr("cx", (d) => { return (x3(d.x) + MARGINS.left); }) 
                       .attr("cy", (d) => { return (y3(d.Precipitation) + MARGINS.top); }) 
                       .attr("r", 5)
                       .attr("fill", (d) => { return region_color(d["Drought Region"]); })
                       .attr("class", "mark")
                       // Make all the points non-visible first
                       .attr("display", "none");

  // Tooltip

  // Create tooltip
  const TOOLTIP2 = d3.select("#vis3")
                    .append("div")
                    .attr("class", "tooltip")
                    // Make it nonvisible at first
                    .style("opacity", 0); 

  // Event handler
  function handleMouseover2(event, d) {
    // on mouseover, make opaque 
    TOOLTIP2.style("opacity", 1); 
  }

  // Event handler
  function handleMousemove2(event, d) {
   // position the tooltip and fill in information 
   TOOLTIP2.html("3-Month SPI: " + d.x + "<br>Precipitation: " + d.Precipitation + "<br>Year: " + d.Year + "<br>Region: " + d["Drought Region"] + "<br>Month: " + d.Month)
           .style("left", (event.pageX + 50) + "px") //add offset
                                                       // from mouse
           .style("top", (event.pageY - 30) + "px"); 
  };

  // Event handler
  function handleMouseleave2(event, d) {
    // on mouseleave, make the tooltip transparent again 
    TOOLTIP2.style("opacity", 0); 
  };

  // Add tooltip event listeners
  FRAME3.selectAll(".mark")
        .on("mouseover", handleMouseover2)
        .on("mousemove", handleMousemove2)
        .on("mouseleave", handleMouseleave2); 

  // initialize empty arrays for the years to be represented in plot 3 as well as the regions and months to be represented in all 3 plots
  let shown_years = [];
  let shown_regions = [];
  let shown_months = [];
        
  // Filter the scatter plot by selected year(s)
  d3.selectAll(".year-button").on("change", function () {
    // retrieve the year associated with the checked/unchecked box
    let selected_year = this.value, 
    // determine whether the box is checked or unchecked
    display = this.checked ? year_display = "inline" : year_display = "none";

    // store the data for years associated with checked boxes
    if (year_display == "inline" && shown_years.includes(selected_year) == false){
      shown_years.push(selected_year);
    // omitting to plot data for years associated with unchecked boxes
    } else if (year_display == "none" && shown_years.includes(selected_year)){
        year_index = shown_year.indexOf(selected_year);
        shown_years.splice(year_index, 1);
    };
  });

  // Filter plot by selected region(s)
  d3.selectAll(".region-button3").on("change", function () {
    // retrieve the region associated with the checked/unchecked box
    let selected_region = this.value, 
    // determine whether the box is checked or unchecked
    display2 = this.checked ? region_display = "inline" : region_display = "none";

    // store the data for regions associated with checked boxes
    if (region_display == "inline" && shown_regions.includes(selected_region) == false){
      shown_regions.push(selected_region);
    // store the data for regions associated with unchecked boxes
    } else if (region_display == "none" && shown_regions.includes(selected_region)){
        region_index = shown_regions.indexOf(selected_region);
        shown_regions.splice(region_index, 1);
    };
  });

  // Filter plot by selected month(s)
  d3.selectAll(".month-button").on("change", function () {
    // retrieve the month associated with the checked/unchecked box
    let selected_month = this.value, 
    // determine whether the box is checked or unchecked
    display3 = this.checked ? month_display = "inline" : month_display = "none";

    // store the data for months associated with checked boxes
    if (month_display == "inline" && shown_months.includes(selected_month) == false){
      shown_months.push(selected_month);
    // omitting to plot the data for months associated with unchecked boxes
    } else if (month_display == "none" && shown_months.includes(selected_month)){
        month_index = shown_months.indexOf(selected_month);
        shown_months.splice(month_index, 1);
    };
  });
    
  d3.select("#btn3").on("click", function() {
    selected_year = updateYear();

    // reset the scatter plot so that no points appear
    FRAME3.selectAll(".mark")
          .attr("display", "none");

    // Show data pertaining to years with checked boxes
    for (let i = 0; i < shown_years.length; i++) {
      // Show data pertaining to regions with checked boxes
      for (let j = 0; j < shown_regions.length; j++) {
        // Show data pertaining to months with checked boxes
        for (let k = 0; k < shown_months.length; k++)
      FRAME3.selectAll(".mark")
          // show all the points that should be shown
          .filter(function(d) { return d.Year == shown_years[i]; })
          .filter(function(d) { return d["Drought Region"] == shown_regions[j]; })
          .filter(function(d) { return d.Month == shown_months[k]; })
          .attr("display", "inline");
      };
    };
    });


  // When points are brushed over in the precipitation vs. drought severity plot, the aligned points in the other two plots get highlighted with a raised opacity and attain 
  // purple border. 
  function updateChart2(event) {
    selection = event.selection;
    myPoint1.classed("selected", (combined, (d) => { return isBrushed(selection, x3(d.x) + MARGINS.left, y3(d.Precipitation) + MARGINS.top ); }) );
    myPoint3.classed("selected", (combined, (d) => { return isBrushed(selection, x3(d.x) + MARGINS.left, y3(d.Precipitation) + MARGINS.top ); }) );
  };

  // Returns TRUE if a point is in the selection window, returns FALSE if it is not
  function isBrushed(brush_coords, cx, cy) {
    let x0 = brush_coords[0][0],
        x1 = brush_coords[1][0],
        y0 = brush_coords[0][1],
        y1 = brush_coords[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // indicates which points are in the selection window via booleans
  };
});
});