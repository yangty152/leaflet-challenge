// Create an initial map object
// Set the longitude, latitude, and the starting zoom level
var myMap = L.map("map", {
    center: [45.52, -122.67],
    zoom: 13
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

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson").then( data => {
    console.log(data.features);
})

function fillcolor(points){
    if (points >=200) {
      return 'blue';
    } else if (points >=150 && points <199) {
      return 'green';
    } else if (points >=99 && points <150) {
      return 'yellow';
    } else {
      return 'red';
    };
  }
  function markerSize(population){
    return population/10; 
  }
  for (var i = 0; i < countries.length; i++){
    var country = countries[i];
    L.circleMarker(country.location, {
      fillOpacity: 0.75,
      color: "white",
      fillColor: fillcolor(country.points),
      radius: markerSize(country.points)
    }).bindPopup("<h1>" + country.name + "</h1> <hr> <h3>Population: " + country.points + "</h3>").addTo(myMap);
  }
  
