//retrieve data and add Marker and pop up to the map
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then( data => {
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(boundaries=>{

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

// Add tile layers (the background map image) to our map
// Use the addTo method to add objects to our map
var Satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});

var Dark = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/dark-v10",
  accessToken: API_KEY
});

var Outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v10",
  accessToken: API_KEY
});

var baseMaps = {
  Satellite: Satellite,
  Dark: Dark,
  Outdoors: Outdoors,
};

var features = data.features;
var tectonicPlates = L.geoJson(boundaries);

//Create overlay map layers
var overlayMaps = {
  Earthquakes: new L.LayerGroup(),
  TectonicPlates: tectonicPlates
};

//draw mark on the map
for (var i=0; i<features.length; i++){
  var coordinates = features[i].geometry.coordinates;
  console.log([coordinates[0],coordinates[1]]);
  if (coordinates){
    var earthquakes = L.circleMarker([coordinates[1],coordinates[0]], {
      fillOpacity: 0.75,
      color: "gray",
      weight: 0.5,
      fillColor: fillcolor(coordinates[2]),
      radius: markerSize(features[i].properties.mag),
    }).bindPopup("<h3>" + features[i].properties.place + "<hr><br/>Magnitude: "+features[i].properties.mag+"<br/>Depth: "+features[i].geometry.coordinates[2]+"</h3>"
    );
    earthquakes.addTo(overlayMaps["Earthquakes"]);
    }
  }

//Create map object
var myMap = L.map("map", {
  center: [37.7043,-97.251],
  zoom: 4,
  layers: [Satellite, overlayMaps.Earthquakes],
});

//Add control layers
L.control.layers(baseMaps, overlayMaps).addTo(myMap);


//Add legend to the map
var info = L.control({
  position: "bottomright"
});

info.onAdd = function(){
var div = L.DomUtil.create("div","legend");
return div;
};

info.addTo(myMap);

//Add legend to the map
document.querySelector(".legend").innerHTML = [
  "<div class = 'columns'><div class='box level1 coloricon'></div><div class = 'legendLabel'> -10-10</div></div>",
  "<div class = 'columns'><div class='box level2 coloricon'></div><div class = 'legendLabel'> -10-30</div></div>",
  "<div class = 'columns'><div class='box level3 coloricon'></div><div class = 'legendLabel'> -30-50</div></div>",
  "<div class = 'columns'><div class='box level4 coloricon'></div><div class = 'legendLabel'> -50-70</div></div>",
  "<div class = 'columns'><div class='box level5 coloricon'></div><div class = 'legendLabel'> -70-90</div></div>",
  "<div class = 'columns'><div class='box level6 coloricon'></div><div class = 'legendLabel'> 90+</div></div>",
].join("");
})
})


