
init();

// ================================
function init() {

    var selector = d3.select('#selDataset');
    d3.json('samples.json').then(data => {

        var sampleNames = data.names;
        //console.log(data);

        sampleNames.forEach(sample => {
            selector
                .append('option')
                .text(sample)
                .property('value',sample);
        });

        var firstSample = sampleNames[0];
                
        buildCharts(firstSample);
        buildMetadata(firstSample);
        buildGauge(firstSample);
    });
};


// Function to build the tables with user input

function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
    buildGauge(newSample);
}


// Create function to populate 'Demographic Info' table

function buildMetadata(sample) {

    d3.json('samples.json').then(data => {

        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];        
        var panel = d3.select('#sample-metadata');
        panel.html('');

        Object.entries(result).forEach(([key, value]) => {
            panel.append('h6').text(`${key.toUpperCase()}: ${value}`);
        });
    });
};


// Create function that will build the graphs

function buildCharts(sample) {

    d3.json('samples.json').then(data => {
        
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;
        console.log("sample_values:", sample_values);

        var otu_ids_sliced = otu_ids.slice(0, 10).reverse();
        var otu_labels_sliced = otu_labels.slice(0, 10).reverse();
        var sample_values_sliced = sample_values.slice(0, 10).reverse();
        
        // BAR CHART
        var barData = [
            {
                x: sample_values_sliced,
                y: otu_ids_sliced.map(otuID => `OTU${otuID}`),
                // hover text
                text: otu_labels_sliced,
                type: "bar",
                orientation: "h",
                marker: {
                    color: "#33cca6",
                    opacity: 0.6,
                    line: {
                        color: 'rgb(8,48,107)',
                        width: 1.5
                      }
                    }
            }
        ];
        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 75, l: 100, r: 30}
            
        };
        Plotly.newPlot("bar", barData, barLayout);

        // BUBBLE CHART
        var bubbleLayout = {
            title: 'Bacteria Cultures Per Sample',
            hovermode: 'closest',
            xaxis: { title: 'OTU ID'},
            margin: { t: 30}
        };
        var bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: 'markers',
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: 'Bluered'
                }
            }
        ];
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    });
}


// Function to make the gauge chart
function buildGauge(blah) {
    d3.json('samples.json').then(data => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == blah);
        var result = resultArray[0];
        var washFreq = result.wfreq;
        console.log("GAUGE washFreq:", washFreq);
        var data = [
            {
            domain: { x: [0, 1], y: [0, 1]},
            value: washFreq,
            title: { text: "Hand Washing Frequency", font: { size: 24 } },
            type: "indicator",
            mode: "gauge+number",
            gauge: { 
                axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" }, 
                bar: { color: "darkblue" },
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                    { range: [0, 1], color: "#33cca6"},
                    { range: [1, 2], color: "#33cccc" },
                    { range: [2, 3], color: "#33a6cc" },
                    { range: [3, 4], color: "#3380cc" },
                    { range: [4, 5], color: "#3359cc" },
                    { range: [5, 6], color: "#3333cc" },
                    { range: [6, 7], color: "#5933cc" },
                    { range: [7, 8], color: "#8033cc" },
                    { range: [8, 9], color: "#a633cc" } 
                        ],
                   }
            }
        ];

        var layout = { 
            width: 465, 
            height: 400, 
            margin: { t: 25, r: 25, l: 25, b: 25 },
            font: {
                color: "darkblue",
                family: "Arial"
                }
        };
        Plotly.newPlot("gauge", data, layout);
    });
}