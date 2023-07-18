// url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it
d3.json(url).then((data) => console.log(data));

// Call Function to intiate
function init() {
  // Select the dropdown menu
  let ddMenu = d3.select("#selDataset");

  // Call the function to get sample names and populate 
  d3.json(url).then((data) => {
    // sample names get from the JSON data
    let names = data.names;

    // Populate the dropdown menu with sample names
    ddMenu.selectAll("option")
      .data(names)
      .enter()
      .append("option")
      .text((id) => id)
      .property("value", (id) => id);

    // the first sample from the list set as default
    let sample_data = names[0];

    // plots graphs with the default sample
    DemogrphicInfo(sample_data);
    HorizontalBarChart(sample_data);
    BubbleChart(sample_data);
  
});
}

// Call Function to get metadata(demographic)info
function DemogrphicInfo(sample) {
  // Fetch the JSON data 
  d3.json(url).then((data) => {
    // Get all metadata
    let metadata = data.metadata;

    // Filter metadata according to sample
    let value = metadata.filter(result => result.id == sample);

    // console meta data
    console.log(value);

    // For  first index
    let valueData = value[0];

    // To clear existing info
    d3.select("#sample-metadata").html("");

    // To add each key and value 
    Object.entries(valueData).forEach(([key, value]) => {
      
      console.log(key, value);

      // Append values
      d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
    });
  });
}

// Call the Function to plot the bar chart
function HorizontalBarChart(sample) {
  
  d3.json(url).then((data) => {
   
    let sampleData = data.samples;

    // Filter based on the value of the sample
    let value = sampleData.filter(result => result.id == sample);

    // Get the first index from the array
    let valueData = value[0];

    // Extract required data for the bar chart
    let otu_ids = valueData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    let sample_values = valueData.sample_values.slice(0, 10).reverse();
    let otu_labels = valueData.otu_labels.slice(0, 10).reverse();

    // Log the data to the console
    console.log(otu_ids, sample_values, otu_labels);

    // Set up the trace for the bar chart
    let trace = {
      x: sample_values,
      y: otu_ids,
      text: otu_labels,
      type: "bar",
      orientation: "h"
    };

    let layout = {
      title: "Top 10 OTUs",
    };

    Plotly.newPlot("bar", [trace], layout);
  });
}

// Call function for bubble chart
function BubbleChart(sample) {
  
  d3.json(url).then((data) => {
    
    let sampleInfo = data.samples;

    let value = sampleInfo.filter(result => result.id == sample);

    
    let valueData = value[0];

    let otu_ids = valueData.otu_ids;
    let sample_values = valueData.sample_values;
    let otu_labels = valueData.otu_labels;

    console.log(otu_ids, sample_values, otu_labels);

    // Set up the trace for the bubble chart
    let trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    };

    // Set up the layout
    let layout = {
      title: "Sample of Bacteria",
      xaxis: { title: "OTU ID" },
    };

    // Call Plotly to plot the bubble chart
    Plotly.newPlot("bubble", [trace], layout);
  });
}

// Call function to updates dashboard 
function optionChanged(value) {
  // Console the new for chosen sample
  console.log(value);

  // Call all the functions to update the dashboard 
  DemogrphicInfo(value);
  HorizontalBarChart(value);
  BubbleChart(value);
 
}

// End the intial function
init();
