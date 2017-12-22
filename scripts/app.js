const url = "https://p2-webapp-server.herokuapp.com/"

document.querySelector('body').innerHTML += 'JS LOADED!';


var mymap = L.map('mapid').setView([51.505, -0.09], 13);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoibGViZWVybWFuIiwiYSI6ImNqYmd1bnUxZzNjZG0ycmxscHozaDFja3MifQ.3RRZRD3bBsMfgNdW5-J8cQ'
}).addTo(mymap);



fetch(url)
.then(response => response.json())
.then(response => {
  console.dir(response);
});
