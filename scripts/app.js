const url = "https://p2-webapp-server.herokuapp.com/";
// initiates map instance on element with id = mapid. Requires Leaflet.sleep for mouseover events!!!
let mymap = L.map("mapid", {
  center: [39.74342, -105.07785],
  zoom: 12,
  // false if you want an unruly map
  sleep: true,
  // time(ms) until map sleeps on mouseout
  sleepTime: 2000,
  // time(ms) until map wakes on mouseover
  wakeTime: 2000,
  // should the user receive wake instructions?
  sleepNote: true,
  // should hovering wake the map? (non-touch devices only)
  hoverToWake: true,
  // a message to inform users about waking the map
  wakeMessage: "Click or Hover to Wake",
  // a constructor for a control button
  sleepButton: L.Control.sleepMapControl,
  // opacity for the sleeping map
  sleepOpacity: 0.5
});
// snippet required to use leaflet
L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
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
    .setContent('Add your Title and Note now!')
    .openOn(mymap);
  mymap.addEventListener('mouseout', (e)=> {
    mymap.closePopup();
  })
  document.querySelector("#mapLocation").value = Object.values(e.latlng).toString();
}
//functions that get data1 and data2 and puts them into the map.
function getServerData() {
  fetch(url)
    .then(response => response.json())
    .then(response => {
      let mapData = combineData(response);
      populateMap(mapData);
    })
    .catch(error => console.error("Fetching Error: ", error));
}
// gets server data and combines it.
function combineData(data) {
  let allTheData = [];
  for (var infoItem of data.toolTip) {
    for (var mapItem of data.markerInfo) {
      if (infoItem.id == mapItem.id) {
        allTheData.push(Object.assign(mapItem, infoItem));
      }
    }
  }
  return allTheData;
}
//takes the combined server data and adds them to the Leaflet map.
function populateMap(formatedData) {
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
// adds items to the map!!!
function createMarker(mapItem) {
  var marker = L.marker(mapItem.latLong).addTo(mymap);
  marker.bindPopup(`${mapItem.locationTitle}<br>${mapItem.locationNote}`);
}
function createCircle(mapItem) {
  var circle = L.circle(mapItem.latLong, {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.5,
    radius: 100
  }).addTo(mymap);
  circle.bindPopup(`${mapItem.locationTitle}<br>${mapItem.locationNote}`);
}
//Creates a new map item on submit - posts to server.
let mapItemSubmit = document.querySelector("#newMapItem");
mapItemSubmit.addEventListener("click", event => {
  event.preventDefault();
  postMapItem();
});
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
  fetch(url, postData)
    .then(resp => resp.json())
    .then(resp => {
      showSuccess(resp.message);
      setTimeout(() => (removeMsg()),4000);
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
// playing with geolocation
mymap.locate({ setView: true, maxZoom: 16 });
mymap.on("locationerror", (e) => alert(e.message));
var popup = L.popup();
getServerData();
mymap.on("click", onMapClick);