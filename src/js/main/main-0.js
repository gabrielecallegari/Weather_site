// @doc https://webdesign.tutsplus.com/tutorials/build-a-simple-weather-app-with-vanilla-javascript--cms-33893

const weatherForm = document.getElementById("weatherForm");
const reset_button= document.getElementById("reset-button");
const input = document.querySelector(".header-section input");
const cities = document.querySelector(".ajax-section .cities");
const message = document.getElementById("error-box__msg");
const apiKey = "4d8fb5b93d4af21d66a2948710284366";
const divErrorBox=document.getElementById("error-box");
const app=document.getElementById("app");
var contatore_city=0;
var viserr=false;
var fareh=false;
var main;
var arrayCitta=[];
weatherForm.addEventListener("submit", e => {
    e.preventDefault();
    const listItems = cities.querySelectorAll(".ajax-section .city");
    const listItemsArray = Array.from(listItems);
    let inputVal = input.value;
    var err=false;
    if (listItemsArray.length > 0) {
        arrayCitta.push(inputVal);
        const filteredArray = listItemsArray.filter(el => {
            let content = "";

            if (inputVal.includes(",")) {
                
                if (inputVal.split(",")[1].length > 2) {
                    inputVal = inputVal.split(",")[0];
                    content = el
                    .querySelector(".city__name span")
                    .textContent.toLowerCase();
                } else {
                    content = el.querySelector(".city__name").dataset.name.toLowerCase();
                }

            } else {
                content = el.querySelector(".city__name span").textContent.toLowerCase();
                
                  
            }
            return content == inputVal.toLowerCase();
        });
        
        if (filteredArray.length > 0 || err==true) {
            //città già cercata
            app.style.display="none";
            reset_button.style.display="none";
            viserr=true;
            divErrorBox.style.display="block";
            message.innerHTML="Hai già cercato questa città!";
            weatherForm.reset();
            input.focus();
            return;
        }
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&lang=it&appid=${apiKey}&units=metric`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const { main, name, sys, weather, id } = data;
            if(arrayCitta.includes(id)){
              app.style.display="none";
              reset_button.style.display="none";
              viserr=true;
              divErrorBox.style.display="block";
              message.innerHTML="Hai già cercato questa città!";
            }else{
              arrayCitta.push(id);
              contatore_city++;
              const svgIcon = weather[0]["icon"];
              const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${svgIcon}.svg`;
              const description = weather[0]["description"];
              const li = document.createElement("li");
              li.classList.add("city");

              li.dataset.identity = id;
              const emoji="https://countryflagsapi.com/png/"+sys.country.toLowerCase()+"/";
              var cardTemplate;
              if(fareh==false){
                cardTemplate = `
                    <h2 class="city__name">
                        <span>${name}</span>
                        <img src="${emoji}" class="city__emoji" alt="${sys.country}">
                    </h2>
                    <div class="city__temp">
                        <span><tmp id="tmpfissa">${Math.round(main.temp)}</tmp><sup> °</sup><sigla id="sigla">C</sigla></span><br>
                        
                        <span>Percepita: <tmp id="tmprc">${Math.round(main.feels_like)}</tmp><sup> °</sup><sigla id="sigla">C</sigla></span>
                        
                    </div>
                    <figure>
                        <img class="icon" src="${icon}" alt="${description}">
                        <figcaption>${description}</figcaption>
                    </figure>
                `;
                }else{
                  cardTemplate = `
                    <h2 class="city__name">
                        <span>${name}</span>
                        <img src="${emoji}" class="city__emoji" alt="${sys.country}">
                    </h2>
                    <div class="city__temp">
                        <span><tmp id="tmpfissa">${Math.round(Math.round(main.temp)*9/5+32)}</tmp><sup> °</sup><sigla id="sigla">F</sigla></span><br>
                        
                        <span>Percepita: <tmp id="tmprc">${Math.round(Math.round(main.feels_like)*9/5+32)}</tmp><sup> °</sup><sigla id="sigla">F</sigla></span>
                        
                    </div>
                    <figure>
                        <img class="icon" src="${icon}" alt="${description}">
                        <figcaption>${description}</figcaption>
                    </figure>
                `;
                }
              //città già inserita
              
              li.innerHTML = cardTemplate;
              cities.prepend(li);
              //script per visualizzazione del bottone reset
              if(contatore_city==0){
                  reset_button.style.display="none";
              }else{
                  reset_button.style.display="block";
              }
            }
        })
        .catch(() => {
            //città non esistente
            viserr=true;
            contatore_city--;
            app.style.display="none";
            reset_button.style.display="none";
            divErrorBox.style.display="block";
            message.innerHTML="La città inserita non risulta esistente";

            input.classList.add('error');
        })

        input.classList.remove('error');
        weatherForm.reset();
        return;
      });
//script menu
function myFunction() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";  
      if(viserr==true){
        app.style.display="none";
        divErrorBox.style.display="block";
      }else{
        app.style.display="block";
        divErrorBox.style.display="none";
      }
      if(contatore_city==0 || viserr==true){
        reset_button.style.display="none";
      }else{
        reset_button.style.display="block";
      }
    } else {
      x.style.display = "block";
      app.style.display="none";
      divErrorBox.style.display="none";
      reset_button.style.display="none";
    }
  }
  
  //script per visualizzazione del bottone reset
  if(contatore_city==0){
    reset_button.style.display="none";
  }else{
    reset_button.style.display="block";
  }
  //script per visualizzazione errore a video 
  if(viserr==false){
    divErrorBox.style.display="none";
  }else{
    divErrorBox.style.display="block";
  }
  //script reset menu
  function functionResetButton(){
      contatore_city=0; 
      cities.innerHTML="";
      reset_button.style.display="none";
      arrayCitta=[];
  }

  //funzione chiusura messaggio errore
  function okFunction(){
      setTimeout(()=>{
        divErrorBox.style.display="none";
        app.style.display="block";
        if(contatore_city==0){
            reset_button.style.display="none";
          }else{
            reset_button.style.display="block";
          }
      },150);
      
      viserr=false;
  }

  function far(){
    if(fareh==false){
      fareh=true;
      bottoneFar.style.backgroundColor="green";
      bottoneFar.innerHTML="On";
    } 
    else{ 
      fareh=false;
      bottoneFar.style.backgroundColor="red";
      bottoneFar.innerHTML="Off";
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