"use strict";

// @doc https://webdesign.tutsplus.com/tutorials/build-a-simple-weather-app-with-vanilla-javascript--cms-33893
var weatherForm = document.getElementById("weatherForm");
var reset_button = document.getElementById("reset-button");
var input = document.querySelector(".header-section input");
var cities = document.querySelector(".ajax-section .cities");
var message = document.getElementById("error-box__msg");
var apiKey = "4d8fb5b93d4af21d66a2948710284366";
var divErrorBox = document.getElementById("error-box");
var app = document.getElementById("app");
var contatore_city = 0;
var viserr = false;
var fareh = false;
var main;
var arrayCitta = [];
weatherForm.addEventListener("submit", function (e) {
  e.preventDefault();
  var listItems = cities.querySelectorAll(".ajax-section .city");
  var listItemsArray = Array.from(listItems);
  var inputVal = input.value;
  var err = false;

  if (listItemsArray.length > 0) {
    arrayCitta.push(inputVal);
    var filteredArray = listItemsArray.filter(function (el) {
      var content = "";

      if (inputVal.includes(",")) {
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el.querySelector(".city__name span").textContent.toLowerCase();
        } else {
          content = el.querySelector(".city__name").dataset.name.toLowerCase();
        }
      } else {
        content = el.querySelector(".city__name span").textContent.toLowerCase();
      }

      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0 || err == true) {
      //città già cercata
      app.style.display = "none";
      reset_button.style.display = "none";
      viserr = true;
      divErrorBox.style.display = "block";
      message.innerHTML = "Hai già cercato questa città!";
      weatherForm.reset();
      input.focus();
      return;
    }
  }

  var url = "https://api.openweathermap.org/data/2.5/weather?q=".concat(inputVal, "&lang=it&appid=").concat(apiKey, "&units=metric");
  fetch(url).then(function (response) {
    return response.json();
  }).then(function (data) {
    var main = data.main,
        name = data.name,
        sys = data.sys,
        weather = data.weather,
        id = data.id;

    if (arrayCitta.includes(id)) {
      app.style.display = "none";
      reset_button.style.display = "none";
      viserr = true;
      divErrorBox.style.display = "block";
      message.innerHTML = "Hai già cercato questa città!";
    } else {
      arrayCitta.push(id);
      contatore_city++;
      var svgIcon = weather[0]["icon"];
      var icon = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/".concat(svgIcon, ".svg");
      var description = weather[0]["description"];
      var li = document.createElement("li");
      li.classList.add("city");
      li.dataset.identity = id;
      var emoji = "https://countryflagsapi.com/png/" + sys.country.toLowerCase() + "/";
      var cardTemplate;

      if (fareh == false) {
        cardTemplate = "\n                    <h2 class=\"city__name\">\n                        <span>".concat(name, "</span>\n                        <img src=\"").concat(emoji, "\" class=\"city__emoji\" alt=\"").concat(sys.country, "\">\n                    </h2>\n                    <div class=\"city__temp\">\n                        <span><tmp id=\"tmpfissa\">").concat(Math.round(main.temp), "</tmp><sup> \xB0</sup><sigla id=\"sigla\">C</sigla></span><br>\n                        \n                        <span>Percepita: <tmp id=\"tmprc\">").concat(Math.round(main.feels_like), "</tmp><sup> \xB0</sup><sigla id=\"sigla\">C</sigla></span>\n                        \n                    </div>\n                    <figure>\n                        <img class=\"icon\" src=\"").concat(icon, "\" alt=\"").concat(description, "\">\n                        <figcaption>").concat(description, "</figcaption>\n                    </figure>\n                ");
      } else {
        cardTemplate = "\n                    <h2 class=\"city__name\">\n                        <span>".concat(name, "</span>\n                        <img src=\"").concat(emoji, "\" class=\"city__emoji\" alt=\"").concat(sys.country, "\">\n                    </h2>\n                    <div class=\"city__temp\">\n                        <span><tmp id=\"tmpfissa\">").concat(Math.round(Math.round(main.temp) * 9 / 5 + 32), "</tmp><sup> \xB0</sup><sigla id=\"sigla\">F</sigla></span><br>\n                        \n                        <span>Percepita: <tmp id=\"tmprc\">").concat(Math.round(Math.round(main.feels_like) * 9 / 5 + 32), "</tmp><sup> \xB0</sup><sigla id=\"sigla\">F</sigla></span>\n                        \n                    </div>\n                    <figure>\n                        <img class=\"icon\" src=\"").concat(icon, "\" alt=\"").concat(description, "\">\n                        <figcaption>").concat(description, "</figcaption>\n                    </figure>\n                ");
      } //città già inserita


      li.innerHTML = cardTemplate;
      cities.prepend(li); //script per visualizzazione del bottone reset

      if (contatore_city == 0) {
        reset_button.style.display = "none";
      } else {
        reset_button.style.display = "block";
      }
    }
  }).catch(function () {
    //città non esistente
    viserr = true;
    contatore_city--;
    app.style.display = "none";
    reset_button.style.display = "none";
    divErrorBox.style.display = "block";
    message.innerHTML = "La città inserita non risulta esistente";
    input.classList.add('error');
  });
  input.classList.remove('error');
  weatherForm.reset();
  return;
}); //script menu

function myFunction() {
  var x = document.getElementById("myLinks");

  if (x.style.display === "block") {
    x.style.display = "none";

    if (viserr == true) {
      app.style.display = "none";
      divErrorBox.style.display = "block";
    } else {
      app.style.display = "block";
      divErrorBox.style.display = "none";
    }

    if (contatore_city == 0 || viserr == true) {
      reset_button.style.display = "none";
    } else {
      reset_button.style.display = "block";
    }
  } else {
    x.style.display = "block";
    app.style.display = "none";
    divErrorBox.style.display = "none";
    reset_button.style.display = "none";
  }
} //script per visualizzazione del bottone reset


if (contatore_city == 0) {
  reset_button.style.display = "none";
} else {
  reset_button.style.display = "block";
} //script per visualizzazione errore a video 


if (viserr == false) {
  divErrorBox.style.display = "none";
} else {
  divErrorBox.style.display = "block";
} //script reset menu


function functionResetButton() {
  contatore_city = 0;
  cities.innerHTML = "";
  reset_button.style.display = "none";
  arrayCitta = [];
} //funzione chiusura messaggio errore


function okFunction() {
  setTimeout(function () {
    divErrorBox.style.display = "none";
    app.style.display = "block";

    if (contatore_city == 0) {
      reset_button.style.display = "none";
    } else {
      reset_button.style.display = "block";
    }
  }, 150);
  viserr = false;
}

function far() {
  if (fareh == false) {
    fareh = true;
    bottoneFar.style.backgroundColor = "green";
    bottoneFar.innerHTML = "On";
  } else {
    fareh = false;
    bottoneFar.style.backgroundColor = "red";
    bottoneFar.innerHTML = "Off";
  }
}
/**
 * 
 * TODO
 * 
 * Permettere all'utente di scegliere se unità di misura in metrico/imperiale
 *      select
 *      chiedendo la lingua impostata sul browser
 *      NB se cambia unità di misura, aggiornare anche le varie particelle di testo es. "C"
 * 
 * Permettere di ottenere il meteo della posizione geografica in cui si trova l'utente
 * 
 * Controllare che non vengano richiesti più volte gli stessi dati
 *  
 * LO STILE, liberi di impostare lo stile che desiderato
 * 
 * Reset di tutti gli elementi aggiunti nella DOM
 * 
 * Se possibile scrivere in linea i file SVG
 * 
 */
"use strict";
"use strict";