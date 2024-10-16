let query = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"; // GeoJson of Earthquakes in last week
// Sends the data.features to the features function.
d3.json(query).then(data => {
    features(data.features);
  });
// function for color coding by depth
function getColor(d) { 
    return d > 90 ? '#800026' :
           d > 70  ? '#BD0026' :
           d > 50  ? '#E31A1C' :
           d > 30  ? '#FC4E2A' :
           d > 10   ? '#FD8D3C' :
                      '#FFEDA0';
}
function features(earthquakeData) {

  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) { //latlng reads in geometry of feature
        return L.circleMarker(latlng, {
            radius: feature.properties.mag * 4, // Sets radius to magnitude, 4 multiplier is arbitrary to make features more visible
            fillColor: getColor(feature.geometry.coordinates[2]), // Uses color function for depth of earthquake feature
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup("<h1>" + feature.properties.place + "</h1> <hr> <h2> Magnitude:" + feature.properties.mag + "</h2>"); // Displays location and magnitude on click
    }
  });

  // Send our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

    // Create the base layer.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });

      // Set up the legend.
      var legend = L.control({position: 'bottomright'});

      legend.onAdd = function (myMap) {
      
          var div = L.DomUtil.create('div', 'info legend'),
              grades = [-10, 10, 30, 50, 70, 90],
              labels = [];
      
          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < grades.length; i++) {
              div.innerHTML +=
                  '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                  grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
          }
      
          return div;
      };
      
      legend.addTo(myMap); // Adds Legend, see CSS for additional styling
  }