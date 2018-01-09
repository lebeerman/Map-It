const url = "https://p2-webapp-server.herokuapp.com/";
const testUrl = "http://localhost:3000/";

//Creates a new map item on submit - posts to server.
let mapItemSubmit = document.querySelector("#newMapItem");
mapItemSubmit.addEventListener("click", event => {
  event.preventDefault();
  postMapItem();
});

// initiates map instance on element with id = mapid.
let mymap = L.map("mapid", {
  center: [39.7563276, -105.0070511],
  zoom: 15
});

// snippet required to use leaflet
L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 16,
    id: "mapbox.streets",
    accessToken:
      "pk.eyJ1IjoibGViZWVybWFuIiwiYSI6ImNqYmd1bnUxZzNjZG0ycmxscHozaDFja3MifQ.3RRZRD3bBsMfgNdW5-J8cQ"
  }
).addTo(mymap);

// adds click listener on map to show lat long
function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent(e.latlng.toString())
    .openOn(mymap);
}
var popup = L.popup();
mymap.on("click", onMapClick);

//functions that get data1 and data2 and puts them into the map.
function getServerData() {
  fetch(testUrl)
    .then(response => response.json())
    .then(response => {
      console.log("Got the goods.");
      let mapData = combineData(response);
      populateMap(mapData);
    })
    .catch(error => console.error("Fetching Error: ", error));
}

//gets server data and combines it.
function combineData(data) {
  let allTheData = [];
  console.log("Combining Data!");
  for (var infoItem of data.toolTip) {
    for (var mapItem of data.markerInfo) {
      // console.dir(mapItem);
      // console.dir(infoItem);
      if (infoItem.id == mapItem.id) {
        // console.log(JSON.stringify(infoItem)+" !!! "+JSON.stringify(mapItem));
        allTheData.push(Object.assign(mapItem, infoItem));
      }
    }
  }
  console.log("Data Processing Complete: " + JSON.stringify(allTheData));
  return allTheData;
}
//takes the combined server data and adds them to the Leaflet map.
function populateMap(formatedData) {
  //NOTES
  /* adds a marker
  var marker = L.marker([39.75616, -105.00913]).addTo(mymap);

  // adds a circle!
  var circle = L.circle([39.7563276,-105.0070511], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 100
  }).addTo(mymap);

  // adds a polygon!
  var polygon = L.polygon([
      [39.75851, -105.01584],
      [39.762, -105.01582],
      [39.76189, -105.01164],
      [39.75879, -105.01215]
  ]).addTo(mymap);

  // creates popups on click!
  X.bindPopup("<b>My Brothers Bar!</b><br>A gSchool grad owns this place. Pretty affordable burgers, too.");
  */
  formatedData.forEach(item => {
    switch (item.markerType) {
      case "marker":
        createMarker(item);
        break;
      case "circle":
        createCircle(item);
        break;
      default:
        break;
    }
  });
}

//adds items to the map!!!
function createMarker(mapItem) {
  console.log("Making Markers!");
  console.log(mapItem.latLong);
  var marker = L.marker(mapItem.latLong).addTo(mymap);
  marker.bindPopup(`${mapItem.locationTitle}<br>${mapItem.locationNote}`);
}
function createCircle(mapItem) {
  console.log("Making Circles!");
  var circle = L.circle(mapItem.latLong, {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.5,
    radius: 100
  }).addTo(mymap);
  circle.bindPopup(`${mapItem.locationTitle}<br>${mapItem.locationNote}`);
}
//On click of Submit button - functions that take the formData and sends them to data1 and data2 on submit. updates the map with the new user-provided data!!!
function postMapItem() {
  const newMapItem = new FormData(document.querySelector("#create-location"));
  const postData = {
    method: "POST",
    body: JSON.stringify({
      data: {
        locationTitle: newMapItem.get("location-title"),
        locationNote: newMapItem.get("location-note"),
        latLong: newMapItem.get("location"),
        markerType: "marker"
      }
    }),
    headers: new Headers({ "Content-Type": "application/json" })
  };
  console.dir(postData);
  fetch(testUrl, postData)
    .then(resp => resp.json())
    .then(resp => {
      console.log("posting!");
      // showSuccess(resp.message);
      // setTimeout(() => (removeMsg()),4000);
      getServerData();
    })
    .catch(error => console.error("Posting Error: ", error, postData));
}
function showSuccess(resMessage) {
  document.querySelector(".save-message").innerHTML = resMessage;
}
function removeMsg() {
  document.querySelector(".save-message").innerHTML = "";
}
// create popup layers!
// var popup = L.popup()
//     .setLatLng([39.7563276,-105.0070511])
//     .setContent("I am a standalone popup.")
//     .openOn(mymap);

getServerData();
