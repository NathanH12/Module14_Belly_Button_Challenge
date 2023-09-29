// Function to initialize the dashboard with default data
function init() {

    d3.json("samples.json").then(data => {
        console.log(data)


        const namesData = data.names;

        let dropdown = d3.select("#selDataset");

        //namesData.forEach(name => {
        //     dropdown.append("option").attr("value", name).text(name);
        // });

        for (let i = 0; i < namesData.length; i++) {
            dropdown
                .append("option")
                .text(namesData[i])
                .property("value", namesData[i]);
        };

        const initialNameID = namesData[0];

        buildmetadata(initialNameID)

        BuildDashboard(initialNameID)

    });
}
init();

function BuildDashboard(sampleID) {
    d3.json("samples.json").then(data => {
        console.log(data)

        // Extract relevant data
        const sampleData = data.samples;
        // Find the selected sample by ID
        const selectedSample = sampleData.filter(sample => sample.id == sampleID);

        console.log('selectedSample')
        console.log(selectedSample)

        const top10OTUs = selectedSample[0].otu_ids.slice(0, 10).reverse();
        const top10Values = selectedSample[0].sample_values.slice(0, 10).reverse();
        const top10Labels = selectedSample[0].otu_labels.slice(0, 10).reverse();

        const barData = [{
            x: top10Values,
            y: top10OTUs.map(otuID => `OTU ${otuID}`),
            text: top10Labels,
            type: "bar",
            orientation: "h",
        }];

        const barLayout = {
            title: "Top 10 OTUs",
            xaxis: { title: "Sample Values" },
        };

        Plotly.newPlot("bar", barData, barLayout);

        let bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30 }
        };

        let bubbleData = [
            {
                x: top10OTUs,
                y: top10Values,
                text: top10Labels,
                mode: "markers",
                marker: {
                    size: top10Values,
                    color: top10OTUs,
                    colorscale: "Earth"
                }
            }
        ];

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    })
}


function optionChanged(ID) {

    buildmetadata(ID)

    BuildDashboard(ID)
}

function buildmetadata(ID) {

    d3.json("samples.json").then(data => {
        console.log(data)

        const metadata = data.metadata;
        
        const selectedmetadata = metadata.filter(sample => sample.id == ID);
        
        const metadataPanel = d3.select("#sample-metadata");
        
        metadataPanel.html(""); 
        
        for (const [key, value] of Object.entries(selectedmetadata[0])) {
            metadataPanel.append("p").text(`${key}: ${value}`);
        }
    })
}
function buildmetadata(ID) {
    d3.json("samples.json").then(data => {
        
        const metadata = data.metadata;
        
        const selectedmetadata = metadata.find(sample => sample.id == ID);

        const metadataPanel = d3.select("#sample-metadata");
        metadataPanel.html(""); 
        
        for (const [key, value] of Object.entries(selectedmetadata)) {
            metadataPanel.append("p").text(`${key}: ${value}`);
        }
    })
}

function optionChanged(ID) {

    BuildDashboard(ID);
    buildmetadata(ID);
}
