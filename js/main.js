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
                  .attr("width", FRAME_WIDTH)

LEGEND.append("circle").attr("cx",10).attr("cy",50).attr("r", 6).style("fill", "red")
LEGEND.append("circle").attr("cx",10).attr("cy",70).attr("r", 6).style("fill", "orange")
LEGEND.append("circle").attr("cx",10).attr("cy",90).attr("r", 6).style("fill", "gold")
LEGEND.append("circle").attr("cx",10).attr("cy",110).attr("r", 6).style("fill", "green")
LEGEND.append("circle").attr("cx",10).attr("cy",130).attr("r", 6).style("fill", "indigo")
LEGEND.append("circle").attr("cx",10).attr("cy",150).attr("r", 6).style("fill", "#FF00FF")

LEGEND.append("text").attr("x", 20).attr("y", 55).text("Connecticut River").style("font-size", "15px").style("fill", "black")
LEGEND.append("text").attr("x", 20).attr("y", 75).text("Northeast").style("font-size", "15px").style("fill", "black")
LEGEND.append("text").attr("x", 20).attr("y", 95).text("Central").style("font-size", "15px").style("fill", "black")
LEGEND.append("text").attr("x", 20).attr("y", 115).text("Southeast").style("font-size", "15px").style("fill", "black")
LEGEND.append("text").attr("x", 20).attr("y", 135).text("Western").style("font-size", "15px").style("fill", "black")
LEGEND.append("text").attr("x", 20).attr("y", 155).text("Cape Cod and Islands").style("font-size", "15px").style("fill", "black")

// // Parse the standard precipitation index data
// d3.csv("data/Massachusetts_SPI_all.csv").then((spi) => {
//  console.log(spi)});

// Parse the precipitation pattern data
d3.csv("data/precipitation_cleaned.csv").then((precipitation) => {
	console.log(precipitation);

// Parse the combined precipitation and standard precipitation index data
d3.csv("data/combined_prep_spi.csv").then((combined) => {
  console.log(combined);

  // normalizedPrecipData = {}
  // normalizedPrecipData =
  // Object.keys(precipitation).map(function(Region) {
  //   precipitation[ columnName.toLowerCase().replace(" ", "") ] = precipitation[columnName]
  // })

  //console.log(normalizedPrecipData)

  // Set up precipitation line chart

  // Get a subset of the data based on the month
  // Choosing to show data from June across all the years (just for PM-03 since we will add filters later) 

  // // Find min year (x) value
  // const MIN_YEAR = d3.min(precipitation, (d) => { return parseInt(d.YEAR); });

  // // Find max year (x) value
  // const MAX_YEAR = d3.max(precipitation, (d) => { return parseInt(d.YEAR); });

  // // Find max precipitation (y) value
  // const MAX_PRECIP = d3.max(precipitation, (d) => { return parseFloat(d.Precipitation); });

  // // Scale years for the x-axis
  // const x = d3.scaleLinear() 
  //                    .domain([MIN_YEAR - 10, (MAX_YEAR + 10)]) // add some padding  
  //                    .range([0, VIS_WIDTH]); 

  // // Scale the precipitation values for the y-axis
  // const y = d3.scaleLinear()
  //                    .domain([0, (MAX_PRECIP + 1)]) // add some padding
  //                    .range([VIS_HEIGHT, 0]);

  // // Add X axis  
  // let xAxis = FRAME1.append("g") 
  //             .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")") 
  //             .call(d3.axisBottom(x).ticks(25).tickFormat(d3.format("d"))) 
  //             .attr("font-size", "10px")
  //             .selectAll("text")
  //               .attr("transform", "translate(-12, 10)rotate(-90)")
  //               .style("text-anchor", "end");

  // // Add Y axis
  // let yAxis = FRAME1.append("g")       
  //             .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.bottom + ")")
  //             .call(d3.axisLeft(y).ticks(20))
  //             .attr("font-size", "10px");

  // // Label the x axis
  // FRAME1.append("text")
  //   .attr("x", MARGINS.left + VIS_WIDTH/2)
  //   .attr("y", VIS_HEIGHT + 100)
  //   .text("Year/Month")
  //   .attr("class", "axes");
      
  // // Label the y axis 
  // FRAME1.append("text")
  //   // .attr("text-anchor", "middle")
  //   .attr("x", 0 - VIS_HEIGHT/2 - MARGINS.top)
  //   .attr("y", 15)
  //   .attr("transform", "rotate(-90)")
  //   .text("Precipitation (inches)")
  //   .attr("class", "axes");
  
  // Set color based on region
  const region_color = d3.scaleOrdinal()
    .domain(['Connecticut River', 'Northeast', 'Central', 'Southeast', 'Western', 'Cape Cod and Islands'])
    .range(['red','orange','gold','green','indigo','#FF00FF']);

  // // group the data: I want to draw one line per group
  // // let sumstat = 
  // //   d3.group(precipitation, (d) => { return (d.Region); }); // group function allows to group the calculation per level of a factor

  // // console.log(sumstat);
  // // // color palette
  // // let region_map = sumstat.keys() 
  // // let regions = Array.from(region_map) // list of region names
  // // console.log(regions)
  // // let precip_plot = Object.fromEntries(sumstat)
  // // console.log(precip_plot)


  //  //Draw the line
  //  //FRAME1.selectAll(".line")
  //   //   .data(sumstat)
  //    //  .enter()
  //    //  .append("path")
  //     //   .attr("fill", "none")
  //      //  .attr("stroke", (d) => { return region_color(d.Region); })
  //      //  .attr("stroke-width", 1.5)
  //      //  .attr("d", ((d) => {
  //      //    return d3.line()
  //      //      .x(function(d) { return x(d.YEAR); })
  //       //     .y(function(d) { return y(d.JUN); })
  //      //      
  //      //  }));

  // const bounds = FRAME1
  //   .append("g")
  //   .style(
  //     "transform",
  //     `translate(${MARGINS.left}px, ${MARGINS.top}px)`
  //   );

  // const lineGenerator = d3
  //    .line()
  //    .x(function(d) { 
  //      return x(d.YEAR);
  //    })
  //    .y(function(d) { 
  //      return y(d.JUN);
  //    });

  // pathString = lineGenerator(precipitation);
   
  // const line = bounds
  //   .append("path")
  //   .attr("d", pathString)
  //   .attr("fill", "none")
  //   .attr("stroke", "silver")
  //   // .attr("stroke", (d) => { return region_color(d.Region); })
  //   .attr("stroke-width", 2);



  // // Plot points on scatter plot
  // let myPoint1 = FRAME1.append("g")
  //                      .selectAll("points")  
  //                      .data(precipitation)  
  //                      .enter()       
  //                      .append("circle")  
  //                      .attr("cx", (d) => { return (x(d.YEAR) + MARGINS.left); }) 
  //                      .attr("cy", (d) => { return (y(d.JUN) + MARGINS.top); }) 
  //                      .attr("r", 3)
  //                      .attr("fill", (d) => { return region_color(d.Region); })
  //                      .attr("class", "mark")

  // // Add brushing
  // FRAME1.call( d3.brush()                 // Use d3.brush to initalize a brush feature
  //                .extent( [ [0,0], [FRAME_WIDTH, FRAME_HEIGHT] ] ) // establish the brush area (maximum brush window = entire graph area)
  //                .on("start brush", updateChart1)); // 'updateChart' is triggered every time the brush window gets altered

  // // When points are brushed over in any plot, the aligned points in the other two plots get highlighted with a raised opacity and attain a purple border. 
  // function updateChart1(event) {
  //   selection = event.selection;
  //   myPoint1.classed("selected", (precipitation, (d) => { return isBrushed(selection, x(d.YEAR) + MARGINS.left, y(d.JUN) + MARGINS.top ); }) )
  //   myPoint3.classed("selected", (precipitation, (d) => { return isBrushed(selection, x(d.YEAR) + MARGINS.left, y(d.JUN) + MARGINS.top ); }) )
  // };

  // // Nest the data by type
  // // nested = d3.nest()
  // //  .key(precipitation, (d) => { return d.Region; })
  // //  .entries(data)

  // // // Append line groups
  // // groups = container.selectAll('g.full-line')
  // //   .data(nested, (d) => { return d.key })

  // // // ENTER
  // // groups.enter().append('svg:g')
  // // .attr( 'class', (d,i) => "full-line#{i}" )

  // // // EXIT
  // // d3.transition(groups.exit()).remove()

  // // // TRANSITION
  // // d3.transition(groups)

  // // // Individual Lines
  // // lines = groups.selectAll('.line').data, (d) => { return [d.values] }

  // // // Append chart lines
  // // // ENTER
  // // lines.enter().append("svg:path")
  // //  .attr("class","line")
  // //  .attr("d", d3.svg.line()
  // //   .interpolate(interpolate)
  // //   .defined(defined)
  // //   .x( (d,i) => { return  xScale(d,i) })
  // //   .y( (d,i) => { return yScale(d,i) })

  // // // EXIT
  // // d3.transition( groups.exit().selectAll('.line') )
  // //   .attr("d", 
  // //     d3.svg.line()
  // //       .interpolate(interpolate)
  // //       .defined(defined)
  // //       .x( (d,i) => { return xScale(d,i) })
  // //       .y( (d,i) => { return yScale(d,i) })

  // // // TRANSITION
  // // d3.transition(lines)
  // //   .attr("d", 
  // //  d3.svg.line()
  // //    .interpolate(interpolate)
  // //    .defined(defined)
  // //        .x( (d,i) => { return xScale(d,i) })
  // //        .y( (d,i) => { return yScale(d,i) })


  // Set up precipitation vs drought level scatterplot
  // For PM-03, just focus on precipitation from June across all years (2017, 2018, 2019) and all regions 3-month SPI
  // User will know what years the points represent when we enable the tooltip function

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
  let xAxis3 = FRAME3.append("g") 
              .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")") 
              .call(d3.axisBottom(x3).tickFormat(d3.format("d"))) 
              .attr("font-size", "10px")
              .selectAll("text")
                .attr("transform", "translate(-12, 10)rotate(-90)")
                .style("text-anchor", "end");

  // Add Y axis
  let yAxis3 = FRAME3.append("g")       
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

  // Add brushing
  // FRAME3.call( d3.brush()                 // Use d3.brush to initalize a brush feature
  //                .extent( [ [0,0], [FRAME_WIDTH, FRAME_HEIGHT] ] ) // establish the brush area (maximum brush window = entire graph area)
  //                .on("start brush", updateChart2)); // 'updateChart' is triggered every time the brush window gets altered

  // When points are brushed over in the precipitation vs. drought severity plot, the aligned points in the other two plots get highlighted with a raised opacity and attain 
  // purple border. 
  function updateChart2(event) {
    selection = event.selection;
    myPoint1.classed("selected", (combined, (d) => { return isBrushed(selection, x3(d.x) + MARGINS.left, y3(d.Precipitation) + MARGINS.top ); }) )
    myPoint3.classed("selected", (combined, (d) => { return isBrushed(selection, x3(d.x) + MARGINS.left, y3(d.Precipitation) + MARGINS.top ); }) )
  };

  // Returns TRUE if a point is in the selection window, returns FALSE if it is not
  function isBrushed(brush_coords, cx, cy) {
    let x0 = brush_coords[0][0],
        x1 = brush_coords[1][0],
        y0 = brush_coords[0][1],
        y1 = brush_coords[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // indicates which points are in the selection window via booleans
  };

  // Tooltip

  // Create tooltip
  const TOOLTIP = d3.select("#vis3")
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
   TOOLTIP.html("3-Month SPI: " + d.x + "<br>Precipitation: " + d.Precipitation + "<br>Year: " + d.YEAR)
           .style("left", (event.pageX + 50) + "px") //add offset
                                                       // from mouse
           .style("top", (event.pageY - 30) + "px"); 
  }

  // Event handler
  function handleMouseleave(event, d) {
    // on mouseleave, make the tooltip transparent again 
    TOOLTIP.style("opacity", 0); 
  } 

 // // add event handler to the button 
 //  const btn = document.querySelector('#btn');
 //        btn.addEventListener('click', (event) => {
 //            // select checked boxes
 //            let checkboxes = document.querySelectorAll('input[name="check"]:checked');
 //            let values = [];
 //            checkboxes.forEach((checkbox) => {
 //                // push the values of the selected checkboxes to an array 
 //                values.push(checkbox.value);
 //            });
 //        });    

  let shown_years = [];
  let shown_regions = [];
  let shown_months = [];
        
  // Filter plot by selected year(s)
    d3.selectAll(".year-button").on("change", function () {
      // retrieve the year associated with the checked/unchecked box
      let selected_year = this.value, 
      // determine whether the box is checked or unchecked
      display = this.checked ? year_display = "inline" : year_display = "none";

      // store the data for years associated with checked boxes
      if (year_display == "inline" && shown_years.includes(selected_year) == false){
        shown_years.push(selected_year);
      // store the data for years associated with unchecked boxes
      } else if (year_display == "none" && shown_years.includes(selected_year)){
          year_index = shown_years.indexOf(selected_year);
          shown_years.splice(year_index, 1);
      }
    });

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
      }
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
      // store the data for months associated with unchecked boxes
      } else if (month_display == "none" && shown_months.includes(selected_month)){
          month_index = shown_months.indexOf(selected_month);
          shown_months.splice(month_index, 1);
      }
    });
    
    d3.select("#btn").on('click', function() {
      // reset the graph so that no points appear
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

  // FRAME3.selectAll(".mark")
  //       .filter(function(d) {return d.Region == selected_region; })
  //       .attr("display", region_display);

  // if (year_display == "inline" && region_display == "inline") {
  //   FRAME3.selectAll(".mark")
  //   .filter(function(d) { return d.YEAR == selected_year } && function(d) {return d.Region == selected_region; })
  //   .attr("display", "inline");
  // } else if (year_display == "inline" && region_display == "none"){
  //   FRAME3.selectAll(".mark")
  //   .filter(function(d) { return d.YEAR == selected_year } && function(d) { return d.Region != selected_region })
  //   .attr("display", "inline");
  // } else if (year_display == "none" && region_display == "inline"){
  //   FRAME3.selectAll(".mark")
  //   .filter(function(d) { return d.Region == selected_region } && function(d) { return d.YEAR != selected_year })
  //   .attr("display", "inline");
  // } else {
  //   FRAME3.selectAll(".mark")
  //   .filter(function(d) { return d.YEAR != selected_year } && function(d) {return d.Region != selected_region; })
  //   .attr("display", "inline");
  // }


//   });
// });

  // a function that will be responsible for updating the visibility of the dots
// function update() {
//   // colors will be the array of active colors, i.e. if only the yellow checkbox
//   // is checked, it will be ['yellow']
//   let years = d3.selectAll('.year-button')[0]
//      .filter(function(e) { return e.checked; })
//      .map(function(e) { return e.value; });

//   // same thing for the regions
//   let regions = d3.selectAll('.region-button')[0]
//       .filter(function(e) { return e.checked; })
//       .map(function(e) { return e.value; });

//   // a helper function that will return the correct display value
//   // it will be called for every mark
//   function display(d) {
//     // we check if the year and region a mark represents are present in the
//     // year and region arrays.
//     if (years.indexOf(d.YEAR) !== -1 && regions.indexOf(d.Region) !== -1) {
//       return 'inline';
//     } else {
//       return 'none';
//     }
//   }

//   // we change the display attribute of every dot using the display function just defined
//   FRAME3.selectAll('.mark').attr('display', display);
// }

// // we add a simple handler to all the checkboxes: every time one changes,
// // just call update
// FRAME3.selectAll(".filter_options input").on("change", update);

  // Add tooltip event listeners
  FRAME3.selectAll(".mark")
        .on("mouseover", handleMouseover)
        .on("mousemove", handleMousemove)
        .on("mouseleave", handleMouseleave); 

});
});