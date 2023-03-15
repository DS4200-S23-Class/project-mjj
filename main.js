// Parse the precipitation pattern data
d3.csv("data/precipitation_cleaned.csv").then((rainfall) => {
	console.log(rainfall, (d) => { return (d); })

// Parse the standard precipitation index data
d3.csv("data/Massachusetts_SPI_all.csv").then((spi) => {
	console.log(spi, (d) => { return (d); })

});
});
