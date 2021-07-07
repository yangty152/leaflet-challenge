// Create an initial map object
// Set the longitude, latitude, and the starting zoom level
var myMap = L.map("map", {
    center: [40.4901657,-124.3073349],
    zoom: 5
  });

// Add a tile layer (the background map image) to our map
// Use the addTo method to add objects to our map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then( data => {
  var features = data.features;
  function markerSize(mag){
    return 15*Math.log(mag); 
  }
  function fillcolor(depth){
    if (depth>=90) {
          return 'OrangeRed';
        } else if (depth >=70 && depth <90) {
          return 'DarkOrange';
        } else if (depth >=50 && depth <70) {
          return 'Gold';
        } else if (depth >=30 && depth <50) {
          return 'Yellow';
        } else if (depth >=10 && depth <30) {
          return 'GreenYellow';
        }else {
          return 'green';
        }; 
  }
  for (var i=0; i<features.length; i++){
    var coordinates = features[i].geometry.coordinates;
    //console.log([coordinates[0],coordinates[1]]);
    if (coordinates){
    L.circleMarker([coordinates[1],coordinates[0]], {
      fillOpacity: 0.75,
      color: "gray",
      weight: 0.5,
      fillColor: fillcolor(coordinates[2]),
      radius: markerSize(features[i].properties.mag),
      }).bindPopup("<h1>" + features[i].properties.place + "<br/>Mag:"+features[i].properties.mag+"</h1> <hr>").addTo(myMap);
      //coordinates.push(features[i].geometry.coordinates);
      }
    }
})
