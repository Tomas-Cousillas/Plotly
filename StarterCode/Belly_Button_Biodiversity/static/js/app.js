function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    
    var url = "/metadata/<sample>";
    d3.json(url).then(function(data) {
      console.log(data);
    });
      // Use d3 to select the panel with id of `#sample-metadata`
  var PANEL = d3.select("#sample-metadata");
  // Use `.html("") to clear any existing metadata
  PANEL.html("");
  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  Object.entries(data).forEach(([key, value]) => {
     PANEL.append("h6").text(`${key}: ${value}`);
    });
  // BONUS: Build the Gauge Chart
 // buildGauge(data.WFREQ);

};


function buildCharts(sample) {
  //Load data from belly_button_data.csv
  d3.json(`/samples/${sample}`).then((data) => {
    console.log(data.otu_ids);    
    const otu_ids = data.otu_ids;
    //const otu_labels = data.otu_labels;
    const sample_values = data.sample_values;
    console.log(sample_values);
  
  // @TODO: Build a Pie Chart
      // map for trace
  var trace1 = {
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    labels: otu_ids.slice(0,10),
    values: sample_values.slice(0,10),
    type: 'pie'
  }
  var layout1 = {
    title: "Pie Chart of Sample Values",
  };

  Plotly.newPlot("pie", [trace1], layout1);
  

  // @TODO: Build a Bubble Chart using the sample data
  var trace2 = {
          x: otu_ids, 
          y: sample_values,
          mode: 'markers',
          marker: {
            color: otu_ids,
            size: sample_values,
            colorscale: "Earth"
          }
        }

  var layout2 = {
          title: "Bubble Chart of Sample Values"
        }
          
      Plotly.newPlot('bubble', [trace2], layout2);

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
