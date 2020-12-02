/******************************************************************************
**  Description:  GRAPHIC PAGE - client side javascript file that handles
**                the dynamic behavior for the page
**
**  Contains:     goBack
**                buildPieGraphic
**                buildHistogramGraphic
******************************************************************************/

/* GO BACK - Function to go back to last page ------------------------------ */
function goBack() {
    window.history.back();
}


/* BUILD GRAPHICS - Function to build graphics from job posting responses -- ******************
** 
**  JSON object details where the value of the property for times is the time in minutes
**  and the value of the property for scores is just the property score
**  corresponding to their respective value, <frequency> for times
**  and <percent> for scores.
**
**  ... indicates more unique properties in the below example.
**  e.g.
**  data: { times: { 0: <frequency>, 2: <frequency>, ... },
**         scores: { score: <percent>, score: <percent>, ... },
**         total_responses: 5 }
**********************************************************************************************/
function buildPieGraphic(data) {
    var data_length = data.total_responses;
    // set the dimensions and margins of the graph
    var width = 320
        height = 320
        margin = 40

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'time_viz'
    var svg = d3.select("#time_viz")
    .append("svg")
        .attr("width", width)
        .attr("height", height)
    .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.append("g")
        .attr("class", "labels");
    svg.append("g")
        .attr("class", "lines");

    // Get data
    var data = data.times

    // Set the color scale
    var color = d3.scaleOrdinal()
    .range(d3.schemeSet2);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
    .value(function(d) {return d.value; })
    var data_ready = pie(d3.entries(data))

    // shape helper to build arcs:
    var arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(radius)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
    .selectAll('mySlices')
    .data(data_ready)
    .enter()
    .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d){ return color( ( (parseInt(d.data.key)>0) ? (parseInt(d.data.key)+1) : d.data.key) ) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

    // Now add the annotation. Use the centroid method to get the best coordinates
    svg
    .selectAll('mySlices')
    .data(data_ready)
    .enter()
    .append('text')
    .text(function(d){ return d.data.key + " min "})
    .attr("font-weight", "bold")
    .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
    .style("text-anchor", "middle")
    .style("font-size", 17)

    // select the svg area
    var legend = d3.select("#legend_viz")
    
    let keys = []; 
    for (prop in data) {
        let percent_val = (data[prop] / data_length);
        keys.push(prop + " minutes: " + parseInt(percent_val * 100).toFixed(0) + "%");
    }

    // Set legend height
    legend.attr('height', 25 * keys.length)

    // Reset the color scale
    var color2 = d3.scaleOrdinal()
    .range(d3.schemeSet2);

    // Add one dot in the legend for each name.
    legend.selectAll("mydots")
    .data(keys)
    .enter()
    .append("circle")
    .attr("cx", 100)
    .attr("cy", function(d,i){ return 5 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 4)
    .style("fill", function(d){ return color2(d)})

    // Add one dot in the legend for each name.
    legend.selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
    .attr("x", 115)
    .attr("y", function(d,i){ return 10 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d){ return color2(d)})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    // .style("alignment-baseline", "middle")

};


function buildHistogramGraphic(data) {
    // Set the dimensions and margins of the graph
    var margin = {top: 35, right: 30, bottom: 30, left: 40},
        width = 360 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    var svg = d3.select("#score_viz")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container", true) 
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    var data = data.scores
    
    // X axis: scale and draw:
    var x = d3.scaleLinear()
        .domain([0, 110])     
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
  
    // set the parameters for the histogram
    var histogram = d3.histogram()
        .value(function(d) { return d.score; })   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(70)); // then the numbers of bins
  
    // And apply this function to data to get the bins
    var bins = histogram(data);

    // Y axis: scale and draw:
    var y = d3.scaleLinear()
        .range([height, 0]);
        y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
    svg.append("g")
        .call(d3.axisLeft(y));

    // append the bar rectangles to the svg element
    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
            .attr("height", function(d) { return height - y(d.length); })
            .style("fill", "#69b3a2")
}


/* =================== GRAPHIC DATA FETCH FUNCTION ======================== */

window.onload = function() {
    // Capture the id from the url
    const params = new URL(location.href).searchParams;
    const job_id_param = params.get('id');
    let rankings_check = document.getElementById("posting-txt");

    // String that holds the form data
    let data = {job_id: job_id_param}
    
    // submit a POST request
    fetch('/quiz_soft/graphic', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(data => {
        // Use d3 to build the time taken pie chart based on responses
        buildPieGraphic(data.graphic_data);

        // Use d3 to build the score histogram based on responses
        buildHistogramGraphic(data.graphic_data);
    });
}
