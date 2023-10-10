const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
// Define function to Create a horizontal bar chart
function createBarChart(sample) {
    // Extract data corresponding to top 10 OTU 
    let sortedSampleValues = sample.sample_values.slice(0, 10).sort((a, b) => b - a).reverse();
    let sortedOtuIds = sample.otu_ids.slice(0, 10).sort((a, b) => b.sample_values - a.sample_values).reverse();
    let sortedOtuLabels = sample.otu_labels.slice(0, 10).sort((a, b) => b.sample_values - a.sample_values).reverse();

    // Create the horizontal bar chart
    let trace = {
        x: sortedSampleValues,
        y: sortedOtuIds.map(id => `OTU ${id}`),
        text: sortedOtuLabels,
        type: "bar",
        orientation: "h"
    };
    
    let plotData = [trace];
    
    let layout = {
        title: " ",
        height: 500,
        margin: {
            l: 100,
            r: 30,
            t: 50,
            b: 100
        }
    };

    Plotly.newPlot("bar", plotData, layout);   
}

//Define function to create a bubble chart that displays each sample
function createBubbleChart(sample) {
    // Extract the necessary data from the sample
    let otuIds = sample.otu_ids;
    let sampleValues = sample.sample_values;
    let otuLabels = sample.otu_labels;

    // Create the bubble chart trace
    let trace = {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
            size: sampleValues, 
            color: otuIds,      
            colorscale: 'Earth' 
        }
    };

    let data = [trace];

    let layout = {
        title: "",
        xaxis: { title: "OTU ID" }
    };

    Plotly.newPlot('bubble', data, layout);
}

// Define function to create the Gauge Chart for plotting the weekly washing frequency of the individual.
const customColorScale = ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529"];

function createGaugeChart(washingFrequency) {
    
    let data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: washingFrequency,
            title: {
                text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
                font: { size: 16 },
                y: 0.5
            },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [0, 9] },
                bar: { color: "red" },
                steps:  [
                    { range: [0, 1], color: customColorScale[0] },
                    { range: [1, 2], color: customColorScale[1] },
                    { range: [2, 3], color: customColorScale[2] },
                    { range: [3, 4], color: customColorScale[3] },
                    { range: [4, 5], color: customColorScale[4] },
                    { range: [5, 6], color: customColorScale[5] },
                    { range: [6, 7], color: customColorScale[6] },
                    { range: [7, 8], color: customColorScale[7] },
                    { range: [8, 9], color: customColorScale[8] }
                 ],
                threshold: {
                    line: { color: "red", width: 4 },
                    thickness: 0.75,
                    value: washingFrequency
                }
            }
        }
    ];

    let layout = {
        width: 400,
        height: 300,
        margin: { t: 0, b: 0 }
    };

    Plotly.newPlot('gauge', data, layout);
}


// Define function to update the sample metadata, i.e., an individual's demographic information.
function displaySampleMetadata(metadata) {
    // Select metadata and clear previous content
    let updateMetadata = d3.select("#sample-metadata").text("");

    for (let [key, value] of Object.entries(metadata)) {
        updateMetadata.append("p").text(`${key}: ${value}`);
    }
}

// Define function to update charts and a metadata when a new sample is selected
function optionChanged(selectedSample) {
    d3.json(url).then(function (data) {
        let samples = data.samples;
        let selectedSampleData = samples.find(sample => sample.id === selectedSample);

        createBarChart(selectedSampleData);
        createBubbleChart(selectedSampleData);

        // Update the sample metadata
        let metadata = data.metadata.find(metadata => metadata.id === parseInt(selectedSample));
        displaySampleMetadata(metadata);

        let washingFrequency = metadata.wfreq;
        createGaugeChart(washingFrequency);

    });
}

// Define function to create the dropdown menu
function createDropdown(data) {
    let names = data.names;
    let dropdown = d3.select("#selDataset");

    for (let name of names) {
        dropdown.append("option").text(name).property("value", name);
    }

    // Event listener for the dropdown menu
    dropdown.on("change", function () {
        let selectedSample = dropdown.property("value");
        optionChanged(selectedSample);
    });
}

// Define function to initialize the page
function init(data){
    let defaultSample = data.samples[0];
    createBarChart(defaultSample);
    createBubbleChart(defaultSample);
    let metadata = data.metadata.find(metadata => metadata.id === parseInt(defaultSample.id));
    displaySampleMetadata(metadata);

    let washingFrequency = metadata.wfreq;
    createGaugeChart(washingFrequency);

}

// Load data and initialize the page
d3.json(url).then(function (data) {

    createDropdown(data);

    init(data);
});

  