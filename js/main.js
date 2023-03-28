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

const FRAME4 = d3.select("#vis4")
                 .append("svg")
                 .attr("height", FRAME_HEIGHT)
                 .attr("width", FRAME_WIDTH)
                 .attr("class", "frame"); 

// Create a legend
const LEGEND1 = d3.select("#legend1")
                  .append("svg")
                  .attr("height", FRAME_HEIGHT)
                  .attr("width", FRAME_WIDTH);

// Points for the legend
LEGEND1.append("circle").attr("cx",10).attr("cy",50).attr("r", 6).style("fill", "red").attr("class", "mark");
LEGEND1.append("circle").attr("cx",10).attr("cy",70).attr("r", 6).style("fill", "orange").attr("class", "mark");
LEGEND1.append("circle").attr("cx",10).attr("cy",90).attr("r", 6).style("fill", "gold").attr("class", "mark");
LEGEND1.append("circle").attr("cx",10).attr("cy",110).attr("r", 6).style("fill", "green").attr("class", "mark");
LEGEND1.append("circle").attr("cx",10).attr("cy",130).attr("r", 6).style("fill", "indigo").attr("class", "mark");
LEGEND1.append("circle").attr("cx",10).attr("cy",150).attr("r", 6).style("fill", "magenta").attr("class", "mark");

// Text for the legend
LEGEND1.append("text").attr("x", 20).attr("y", 55).text("Connecticut River").style("font-size", "15px").style("fill", "black");
LEGEND1.append("text").attr("x", 20).attr("y", 75).text("Northeast").style("font-size", "15px").style("fill", "black");
LEGEND1.append("text").attr("x", 20).attr("y", 95).text("Central").style("font-size", "15px").style("fill", "black");
LEGEND1.append("text").attr("x", 20).attr("y", 115).text("Southeast").style("font-size", "15px").style("fill", "black");
LEGEND1.append("text").attr("x", 20).attr("y", 135).text("Western").style("font-size", "15px").style("fill", "black");
LEGEND1.append("text").attr("x", 20).attr("y", 155).text("Cape Cod and Islands").style("font-size", "15px").style("fill", "black");

// Parse the precipitation pattern data
d3.csv("data/precipitation_cleaned.csv").then((precipitation) => {
  // Read into dataset and print data
	console.log(precipitation);

// Parse the combined precipitation and standard precipitation index data
d3.csv("data/combined_prep_spi.csv").then((combined) => {
  // Read into dataset and print data
  console.log(combined);

// Parse the geospatial map data
d3.json("data/massachusetts.geojson").then((massmap) => {
  // Read into dataset and print data
  console.log(massmap);

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
              .attr("class", "x axis")
              .selectAll("text")
                .attr("transform", "translate(10, 0)")
                .style("text-anchor", "end");

  // Add Y axis
  let yAxis = FRAME1.append("g")       
              .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.bottom + ")")
              .call(d3.axisLeft(y).ticks(20))
              .attr("font-size", "10px")
              .attr("class", "y axis");

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

  function updateYear1 () {
    // retrieve the year chosen by the user from the drop down menu
    let yearMenu = document.getElementById("selectYear1");
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
    if (region_display == "inline" && shown_regions2.includes(selected_region) == false){
      shown_regions2.push(selected_region);
    // store the data for regions associated with unchecked boxes
    } else if (region_display == "none" && shown_regions2.includes(selected_region)){
        region_index = shown_regions2.indexOf(selected_region);
        shown_regions2.splice(region_index, 1);
    };
  });

  // List of groups (here I have one group per column)
  let allRegions = precipitation.map((d) => { return d.Region; });

  // retrieve the year selected by the user in the drop down menu for the line chart
  d3.select("#btn1").on("click", function() {
    let selected_year1 = updateYear1();

    // reset the plot so that no points or lines appear
    FRAME1.selectAll(".mark")
          .attr("display", "none");

    FRAME1.selectAll(".line")
          .attr("display", "none");

      // Show data pertaining to regions with checked boxes
      for (let j = 0; j < shown_regions2.length; j++) {
        let lineFilter = precipitation.filter(function(d) {return d.Region == shown_regions2[j]; })
                                      .filter(function(d) { return d.YEAR == selected_year1; });

        // show lines for each checked region
        let line = FRAME1.append("g")
                         .append("path")
                         .datum(lineFilter)
                         .attr("d", d3.line()
                            .x(function(d) { return (x(d.Month) + MARGINS.left); })
                            .y(function(d) { return (y(d.Precipitation) + MARGINS.top); })
                            )
                         .attr("stroke", (d) => { return region_color(shown_regions2[j]); })
                         .attr("transform", "translate(13, 0)")
                         .style("stroke-width", 2)
                         .style("fill", "none")
                         .attr("class", "line")

        FRAME1.selectAll(".mark")
          // Show data pertaining to the selected year from the dropbox menu
          .filter(function(d) { return d.YEAR == selected_year1; })
          .filter(function(d) { return d.Region == shown_regions2[j]; })
          .attr("display", "inline");
    };
  });

  // Tooltip

  // Create tooltip
  const TOOLTIP1 = d3.select("#vis1")
                    .append("div")
                    .attr("class", "tooltip")
                    // Make it nonvisible at first
                    .style("opacity", 0); 

  // Event handler
  function handleMouseover1(event, d) {
    // on mouseover, make opaque 
    TOOLTIP1.style("opacity", 1); 
  }

  // Event handler
  function handleMousemove1(event, d) {
   // position the tooltip and fill in information 
   TOOLTIP1.html("Month: " + d.Month + "<br>Precipitation: "+ d.Precipitation + "<br>Year: " + d.YEAR + "<br>Region: " + d.Region)
           .style("left", (event.pageX + 50) + "px") //add offset
                                                       // from mouse
           .style("top", (event.pageY - 30) + "px"); 
  };

  // Event handler
  function handleMouseleave1(event, d) {
    // on mouseleave, make the tooltip transparent again 
    TOOLTIP1.style("opacity", 0); 
  };

  // Add tooltip event listeners
  FRAME1.selectAll(".mark")
        .on("mouseover", handleMouseover1)
        .on("mousemove", handleMousemove1)
        .on("mouseleave", handleMouseleave1); 

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
   d3.json("data/massachusetts.geojson").then((massmap) => {
     let map = L.map('map');
     map.createPane('labels');

     map.getPane('labels').style.zIndex = 650;
     map.getPane('labels').style.pointerEvents = 'none';

     let positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
         attribution: '©OpenStreetMap, ©CartoDB'
         }).addTo(map);

     let positronLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
         attribution: '©OpenStreetMap, ©CartoDB',
         pane: 'labels'
       }).addTo(map);

   let geojson = L.geoJson(massmap.features).addTo(map);

   geojson.eachLayer(function (layer) {
     layer.bindPopup(layer.feature.properties.name);
     });

     map.fitBounds(geojson.getBounds());
 });
  
  // const WIDTH = window.innerWidth;
  // const HEIGHT = window.innerHeight;

  // const projection = d3.geoEquirectangular()
  //                      .scale(7500)
  //                      .translate([WIDTH * 8.75 + MARGINS.left, HEIGHT * 10 + MARGINS.top]);

  // const path = d3.geoPath().projection(projection);

  //  const color = d3.scaleOrdinal()
  //                  .domain(["BARNSTABLE", "BERKSHIRE", "BRISTOL", "DUKES", "ESSEX", "FRANKLIN", "HAMPDEN", "HAMPSHIRE", "MIDDLESEX", "NANTUCKET", "NORFOLK", "PLYMOUTH", "SUFFOLK", "WORCESTER"])
  //                  .range(["red", "orange", "yellow", "green", "blue", "indigo", "purple", "red", "orange", "yellow", "green", "blue", "indigo", "purple"]);

  //  function renderMap(root) {
  //    // Draw the Massachusetts map 
  //  console.log(root)

  //    FRAME2.append("g")
  //      .selectAll("path")
  //        .data(root.features)
  //        .enter()
  //        .append("path")
  //        .attr("d", path)
  //        .attr("fill", "beige")
  //        .attr("stroke", "black")
  //        .attr("stroke-width", 0.5)

  //    FRAME2.append("g")
  //      .selectAll("text")
  //      .data(root.features)
  //      .enter()
  //      .append("text")
  //      .attr("transform", (d) => `translate(${path.centroid(d)})`)
  //      .attr("text-anchor", "middle")
  //      .attr("font-size", 10)
  //      .attr("dx", (d) => { return (d, "offset[0]", null); })
  //      .attr("dy", (d) => { return (d, "offset[1]", null); })
  // };

//   // Render the map on the webpage
    // d3.json("data/massachusetts.geojson").then((massmap) => {
    //    renderMap(massmap);
    // })

   // Add a legend to the plot indicating the SPI value a star's color portrays
//   const LEGEND2 = d3.select("#legend2") 
//                 .append("svg")
//                 .attr("height", FRAME_HEIGHT/3)
//                 .attr("width", FRAME_WIDTH);

//   // Points for the legend
//   LEGEND2.append("polygon").attr("points", "100,10 40,198 190,78 10,78 160,198").attr("transform", "scale(0.15) translate(0, 200)").attr("stroke", "black").attr("stroke-width", 0.5).style("fill", "white");
//   LEGEND2.append("polygon").attr("points", "100,10 40,198 190,78 10,78 160,198").attr("transform", "scale(0.15) translate(0, 350)").attr("stroke", "black").attr("stroke-width", 0.5).style("fill", "deepskyblue");
//   LEGEND2.append("polygon").attr("points", "100,10 40,198 190,78 10,78 160,198").attr("transform", "scale(0.15) translate(0, 500)").attr("stroke", "black").attr("stroke-width", 0.5).style("fill", "#0066FF");
//   LEGEND2.append("polygon").attr("points", "100,10 40,198 190,78 10,78 160,198").attr("transform", "scale(0.15) translate(0, 650)").attr("stroke", "black").attr("stroke-width", 0.5).style("fill", "blue");
//   LEGEND2.append("polygon").attr("points", "100,10 40,198 190,78 10,78 160,198").attr("transform", "scale(0.15) translate(0, 800)").attr("stroke", "black").attr("stroke-width", 0.5).style("fill", "midnightblue");


//   // Text for the legend
//   LEGEND2.append("text").attr("y", 30).text("Drought Severities").style("font-size", "15px").style("font-weight", "bold").style("text-align", "center");
//   LEGEND2.append("text").attr("x", 35).attr("y", 55).text("SPI > 0.52 (None)").style("font-size", "15px").style("fill", "black");
//   LEGEND2.append("text").attr("x", 35).attr("y", 77).text("-0.84 < SPI <= 0.52 (Light)").style("font-size", "15px").style("fill", "black");
//   LEGEND2.append("text").attr("x", 35).attr("y", 99).text("-1.28 < SPI <= -0.84 (Moderate)").style("font-size", "15px").style("fill", "black");
//   LEGEND2.append("text").attr("x", 35).attr("y", 121).text("-2.05 < SPI <= -1.28 (High)").style("font-size", "15px").style("fill", "black");
//   LEGEND2.append("text").attr("x", 35).attr("y", 143).text("SPI <= -2.05 (Very High)").style("font-size", "15px").style("fill", "black");

//   // Add stars on each of Massachusetts' six regions on the map
//   // NEED TO WORK ON ADJUSTING THE COLORS OF THE STARS BASED ON SPI VALUE + THE TOOLTIP
//   // Filter the scatter plot by selected year(s)

//   // initialize empty arrays for the years, regions, and months to be represented in plot 2
//   let shown_regions1 = [];

//   function updateYear2 () {
//     // retrieve the year chosen by the user from the drop down menu
//     let yearMenu = document.getElementById("selectYear2");
//     let selected_year = yearMenu.options[yearMenu.selectedIndex].text;
//     return selected_year;
//   };

//   function updateMonth () {
//     // retrieve the month chosen by the user from the drop down menu
//     let monthMenu = document.getElementById("selectMonth");
//     let selected_month = monthMenu.options[monthMenu.selectedIndex].text;
//     return selected_month;
//   };

//   d3.select("#btn2").on("click", function() {

//     // reset the map so that no stars appear
//     FRAME2.selectAll(".star")
//           .attr("display", "none");

//     let show_northeast = "none";
//     let show_connecticut = "none";
//     let show_central = "none";
//     let show_western = "none";
//     let show_southeast = "none";
//     let show_cape = "none";

//     // Filter the stars by region
//     let regions = document.getElementsByName("check2");
//     // check with region boxes are checked
//     for (var i=0; i<regions.length; i++) {
//        // And stick the regions for the checked ones onto an array...
//        if (regions[i].checked) {
//           shown_regions1.push(regions[i].value);
//        }
//     }

//     let selected_year2 = updateYear2();
//     let selected_month = updateMonth();

//     // Show stars representing the regions with checked boxes 
//     for (let i = 0; i < shown_regions1.length; i++) {
//       if (shown_regions1[i] == "Northeast"){
//         show_northeast = "inline";
//       }else if (shown_regions1[i] == "Connecticut River"){
//         show_connecticut = "inline";
//       }else if (shown_regions1[i] == "Central"){
//         show_central = "inline";
//       }else if (shown_regions1[i] == "Western"){
//         show_western = "inline";
//       }else if (shown_regions1[i] == "Southeast"){
//         show_southeast = "inline";
//       }else if (shown_regions1[i] == "Cape Cod and Islands"){
//         show_cape = "inline";
//       }
//     };

//     function determineStarColor (spi) {
//       if (spi > 0.52){
//         star_color = "white";
//       }else if (spi <= 0.52 && spi > -0.84) {
//         star_color = "deepskyblue";
//       }else if (spi <= -0.84 && spi > -1.28){
//         star_color = "#0066FF";
//       }else if (spi <= -1.28 && spi > -2.05){
//         star_color = "blue";
//       }else{
//         star_color = "midnightblue";
//       }
//       return star_color;
//   };

//     // Retrieve the SPI values of each region for the month and year chosen by the user
//     let western_filter = combined.filter(function (combined) { return combined["Drought Region"] == "Western" && parseInt(combined.Year) == selected_year2 && 
//       combined.Month == selected_month;});
//     let western_spi = western_filter[0].x;
//     let western_star_color = determineStarColor(western_spi);

//     let connecticut_filter = combined.filter(function (combined) { return combined["Drought Region"] == "Connecticut River" && parseInt(combined.Year) ==
//       selected_year2 && combined.Month == selected_month;});
//     let connecticut_spi = connecticut_filter[0].x;
//     let connecticut_star_color = determineStarColor(connecticut_spi);

//     let central_filter = combined.filter(function (combined) { return combined["Drought Region"] == "Central" && parseInt(combined.Year) == selected_year2 && 
//       combined.Month == selected_month;});
//     let central_spi = central_filter[0].x;
//     let central_star_color = determineStarColor(central_spi);

//     let northeast_filter = combined.filter(function (combined) { return combined["Drought Region"] == "Northeast" && parseInt(combined.Year) == selected_year2 && 
//       combined.Month == selected_month;});
//     let northeast_spi = northeast_filter[0].x;
//     let northeast_star_color = determineStarColor(northeast_spi);

//     let southeast_filter = combined.filter(function (combined) { return combined["Drought Region"] == "Southeast" && parseInt(combined.Year) == selected_year2 && 
//       combined.Month == selected_month;});
//     let southeast_spi = southeast_filter[0].x;
//     let southeast_star_color = determineStarColor(southeast_spi);

//     let cape_filter = combined.filter(function (combined) { return combined["Drought Region"] == "Cape Cod and Islands" && parseInt(combined.Year) == selected_year2 && 
//       combined.Month == selected_month;});
//     let cape_spi = cape_filter[0].x;
//     let cape_star_color = determineStarColor(cape_spi);

//   // Adding the star for the Western region of Massachusetts
//   FRAME2.append("g")
//       .selectAll("stars")  
//       .data(combined)  
//       .enter()      
//       .append("polygon") 
//       .attr("transform", "scale(0.45) translate(0, 500)")
//       .attr("points", "100,10 40,198 190,78 10,78 160,198")
//       .attr("fill", western_star_color)
//       .attr("stroke", "black")
//       .attr("stroke-width", 0.5)
//       .attr("display", show_western)
//       .attr("class", "star")
//       .attr("id", "Region: Western" + "<br>County: Berkshire" + "<br>SPI: " + western_spi)
//       .on("mouseover", handleMouseover2)
//       .on("mousemove", handleMousemove2)
//       .on("mouseleave", handleMouseleave2);


//   // Adding the star for the Connecticut River Valley region of Massachusetts
//   FRAME2.append("g")
//       .selectAll("stars")  
//       .data(combined)  
//       .enter()      
//       .append("polygon") 
//       .attr("transform", "scale(0.45) translate(220, 520)")
//       .attr("points", "100,10 40,198 190,78 10,78 160,198")
//       .attr("fill", connecticut_star_color)
//       .attr("stroke", "black")
//       .attr("stroke-width", 0.5)
//       .attr("display", show_connecticut)
//       .attr("class", "star")
//       .attr("id", "Region: Connecticut River Valley" + "<br>Counties: Franklin, Hampshire, Hampden" + "<br>SPI: " + connecticut_spi)
//       .on("mouseover", handleMouseover2)
//       .on("mousemove", handleMousemove2)
//       .on("mouseleave", handleMouseleave2);;

//   // Adding the star for the Central region of Massachusetts
//   FRAME2.append("g")
//       .selectAll("stars")  
//       .data(combined)  
//       .enter()      
//       .append("polygon") 
//       .attr("transform", "scale(0.45) translate(450, 520)")
//       .attr("points", "100,10 40,198 190,78 10,78 160,198")
//       .attr("fill", central_star_color)
//       .attr("stroke", "black")
//       .attr("stroke-width", 0.5)
//       .attr("display", show_central)
//       .attr("class", "star")
//       .attr("id", "Region: Central" + "<br>County: Worcester" + "<br>SPI: " + central_spi)
//       .on("mouseover", handleMouseover2)
//       .on("mousemove", handleMousemove2)
//       .on("mouseleave", handleMouseleave2);;

//   // Adding the star for the Northeast region of Massachusetts
//   FRAME2.append("g")
//       .selectAll("stars")  
//       .data(combined)  
//       .enter()      
//       .append("polygon") 
//       .attr("transform", "scale(0.45) translate(650, 420)")
//       .attr("points", "100,10 40,198 190,78 10,78 160,198")
//       .attr("fill", northeast_star_color)
//       .attr("stroke", "black")
//       .attr("stroke-width", 0.5)
//       .attr("display", show_northeast)
//       .attr("class", "star")
//       .attr("id", "Region: Northeast" + "<br>Counties: Essex, Middlesex, and Suffolk (plus town of Brookline)" + "<br>SPI: " + northeast_spi)
//       .on("mouseover", handleMouseover2)
//       .on("mousemove", handleMousemove2)
//       .on("mouseleave", handleMouseleave2);;

//   // Adding the star for the Southeast region of Massachusetts
//   FRAME2.append("g")
//       .selectAll("stars")  
//       .data(combined)  
//       .enter()      
//       .append("polygon") 
//       .attr("transform", "scale(0.45) translate(650, 630)")
//       .attr("points", "100,10 40,198 190,78 10,78 160,198")
//       .attr("fill-opacity", 0.5)
//       .attr("fill", southeast_star_color)
//       .attr("stroke", "black")
//       .attr("stroke-width", 0.5)
//       .attr("display", show_southeast)
//       .attr("class", "star")
//       .attr("id", "Region: Southeast" + "<br>Counties: Bristol, Plymouth, and Norfolk (minus town of Brookline)" + "<br>SPI: " + southeast_spi)
//       .on("mouseover", handleMouseover2)
//       .on("mousemove", handleMousemove2)
//       .on("mouseleave", handleMouseleave2);;

  // // Adding the star for the Cape Cod and Islands region of Massachusetts
  // FRAME2.append("g")
  //     .selectAll("stars")  
  //     .data(combined)  
  //     .enter()      
  //     .append("polygon") 
  //     .attr("transform", "scale(0.45) translate(850, 730)")
  //     .attr("points", "100,10 40,198 190,78 10,78 160,198")
  //     .attr("fill", cape_star_color)
  //     .attr("stroke", "black")
  //     .attr("stroke-width", 0.5)
  //     .attr("display", show_cape)
  //     .attr("class", "star")
  //     .attr("id", "Region: Cape Cod and Islands" + "<br>Counties: Barnstable, Nantucket, and Dukes (includes Elizabeth Islands)" + "<br>SPI: " + cape_spi)
  //     .on("mouseover", handleMouseover2)
  //     .on("mousemove", handleMousemove2)
  //     .on("mouseleave", handleMouseleave2);
  // });


  // Tooltip

  // Create tooltip
  const TOOLTIP2= d3.select("#vis2")
                    .append("div")
                    .attr("class", "tooltip")
                    // Make it nonvisible at first
                    .style("opacity", 0); 

  // Event handler
  function handleMouseover2(event) {
    // on mouseover, make opaque 
    TOOLTIP2.style("opacity", 1); 
  }

  // Event handler
  function handleMousemove2(event, name) {
   // position the tooltip and fill in information 
   TOOLTIP2.html(this.id)
           .style("left", (event.pageX + 50) + "px") //add offset
                                                       // from mouse
           .style("top", (event.pageY - 30) + "px"); 
  };

  // Event handler
  function handleMouseleave2(event) {
    // on mouseleave, make the tooltip transparent again 
    TOOLTIP2.style("opacity", 0); 
  };

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
  const TOOLTIP3 = d3.select("#vis3")
                    .append("div")
                    .attr("class", "tooltip")
                    // Make it nonvisible at first
                    .style("opacity", 0); 

  // Event handler
  function handleMouseover3(event, d) {
    // on mouseover, make opaque 
    TOOLTIP3.style("opacity", 1); 
  }

  // Event handler
  function handleMousemove3(event, d) {
   // position the tooltip and fill in information 
   TOOLTIP3.html("3-Month SPI: " + d.x + "<br>Precipitation: " + d.Precipitation + "<br>Year: " + d.Year + "<br>Region: " + d["Drought Region"] + "<br>Month: " + d.Month)
           .style("left", (event.pageX + 50) + "px") //add offset
                                                       // from mouse
           .style("top", (event.pageY - 30) + "px"); 
  };

  // Event handler
  function handleMouseleave3(event, d) {
    // on mouseleave, make the tooltip transparent again 
    TOOLTIP3.style("opacity", 0); 
  };

  // Add tooltip event listeners
  FRAME3.selectAll(".mark")
        .on("mouseover", handleMouseover3)
        .on("mousemove", handleMousemove3)
        .on("mouseleave", handleMouseleave3); 

  // initialize empty arrays for the years to be represented in plot 3 as well as the regions and months to be represented in all 3 plots
  let shown_years = [];
  let shown_regions2 = [];
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
    if (region_display == "inline" && shown_regions2.includes(selected_region) == false){
      shown_regions2.push(selected_region);
    // store the data for regions associated with unchecked boxes
    } else if (region_display == "none" && shown_regions2.includes(selected_region)){
        region_index = shown_regions2.indexOf(selected_region);
        shown_regions2.splice(region_index, 1);
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
    selected_year = updateYear1();

    // reset the scatter plot so that no points appear
    FRAME3.selectAll(".mark")
          .attr("display", "none");

    // Show data pertaining to years with checked boxes
    for (let i = 0; i < shown_years.length; i++) {
      // Show data pertaining to regions with checked boxes
      for (let j = 0; j < shown_regions2.length; j++) {
        // Show data pertaining to months with checked boxes
        for (let k = 0; k < shown_months.length; k++)
      FRAME3.selectAll(".mark")
          // show all the points that should be shown
          .filter(function(d) { return d.Year == shown_years[i]; })
          .filter(function(d) { return d["Drought Region"] == shown_regions2[j]; })
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
});