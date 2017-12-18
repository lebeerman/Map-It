const url = "https://p2-webapp-server.herokuapp.com/"



document.querySelector('body').innerHTML += 'JS LOADED!';



fetch(url)
.then(response => response.json())
.then(response => {
  document.querySelector('body').innerHTML += response;
});
