function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(sample){
    var metadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metadata.HTML = '';
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    Object.entries(sample).forEach(function([key, value]){
      var row = metadata.append("p");
      row.text(`${key}: ${value}`);
      
    });
    console.log(sample)
}
)};

function buildCharts(sample) {
  var url = `/samples/${sample}`;
  d3.json(url).then(function(data) {
    var xvalue = data.otu_ids;
    var yvalue = data.sample_values;
    var size = data.sample_values;
    var colors = data.otu_ids;
    var values = data.otu_labels;
    console.log(sample)
    var trace1 = {
      x: xvalue,
      y: yvalue,
      text: values,
      mode: 'markers',
      marker: {
        color: colors, 
        size: size
      }
    };

    var d = [trace1];
    var layout = {
      xaxis: { title: "OTU ID"},
    };

    Plotly.newPlot('bubble', d, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  d3.json(url).then(function(data) {
    var pie_values = data.sample_values.slice(0, 10);
    var pie_lables = data.otu_ids.slice(0, 10);
    var pie_hover = data.otu_labels.slice(0, 10);

    var a = [{
      values: pie_values,
      lables: pie_lables,
      hovertext: pie_hover,
      type: 'pie'
    }];

    Plotly.newPlot('pie', a);
  });
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
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// // Initialize the dashboard
init();

