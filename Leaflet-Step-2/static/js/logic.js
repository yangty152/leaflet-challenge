// Create an initial map object
// Set the longitude, latitude, and the starting zoom level
var myMap = L.map("map", {
    center: [37.7043,-97.251],
    zoom: 4
  });

  var info = L.control({
    position: "bottomright"
  });

info.onAdd = function(){
  var div = L.DomUtil.create("div","legend");
  return div;
};

info.addTo(myMap);

//function to change marker size based on the mag
function markerSize(mag){
  if (mag == 0){
    return 1;
  } else {
    return 5*mag;
  } 
}

//function to fill color based on the earthquick depth
function fillcolor(depth){
  if (depth>=90){
    return 'Red'; 
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

//retrieve data and add Marker and pop up to the map
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then( data => {
  var features = data.features;

  
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
      }).bindPopup("<h3>" + features[i].properties.place + "<hr><br/>Mag:"+features[i].properties.mag+"<br/>Coordindates:"+features[i].geometry.coordinates+"</h3>"
      ).addTo(myMap);
      }
    }
})

//Add legend to the map
document.querySelector(".legend").innerHTML = [
    "<div><div class='box level1'></div>-10-10</div><br>",
    "<div><div class='box level2'></div>-10-30</div><br>",
    "<div><div class='box level3'></div>-30-50</div><br>",
    "<div><div class='box level4'></div>-50-70</div><br>",
    "<div><div class='box level5'></div>-70-90</div><br>",
    "<div><div class='box level6'></div>90+</div>",
  ].join("");
