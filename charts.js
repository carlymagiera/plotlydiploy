function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

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

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

//  Create the buildCharts function.
function buildCharts(sample) {
  //  Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    //  Create a variable that holds the samples array. 
    var samples = data.samples;

    //  Create a variable that filters the samples for the object with the desired sample number.
    var sampleResultArray = samples.filter(sampleObj => sampleObj.id == sample);

    //   Create a variable that holds the first sample in the array.
    var sampleResult = sampleResultArray[0];

    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    //  Create variables that hold the otu_ids, otu_labels, and sample_values.

    var otuId = sampleResult.otu_ids;
    var otuLabel = sampleResult.otu_labels;
    var sampleValue = sampleResult.sample_values;

    var washFreq = result.wfreq;

    //  Create the yticks for the bar chart
    var yticks = otuId.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();

    //  Create the trace for the bar chart. 
    var barData = [{
      type: 'bar',
      x: sampleValue.slice(0,10).reverse(),
      y: yticks,
      orientation: 'h', 
      text: otuLabel.slice(0,10).reverse(),
    }];

    //  Create the layout for the bar chart. 
    
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      height:400
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.

    var bubbleData = [{
      x: otuId,
      y: sampleValue,
      text: otuLabel,
      mode: 'markers',
      marker: {
         size: sampleValue,
         color: otuId
       }
   
    }];
   
    //  Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      hovermode:'closest',
      text: otuLabel,
      xaxis: {
        title: {
          text: "OTU ID"
        }
      }
          
    };
    console.log(bubbleLayout)
    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    
    var gaugeData = [{
        //domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: { text: "<b>Belly Button Washing Frequency<\/b><br>Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 3], color: "red" },
            { range: [2, 5], color: "orange" },
            { range: [4, 7], color: "yellow" },
            { range: [6, 9], color: "lightgreen" },
            { range: [8, 11], color: "green" }],
          bar: { color: "black" }
        }
    }];
    
    // Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 457, height:400, margin: { t: 0, b: 0 }
    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
