var cityFormEl = document.getElementById("city-form");
var currentDate = dayjs();
var key = "ee58e3e024677f636e675b8a11b6a05c";
const localStorageCities = JSON.parse(localStorage.getItem("cities")) || [];
const cities = [...localStorageCities];
renderCityButtons(cities);

// create a function to fetch all data for a city
// hit all apis needed
// save that data to local storage
function fetchDataFromApi(city) {
  // fetch from weather geo api with city name
  fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=5&appid=" +
    key
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var lat = data[0].lat;
      var lon = data[0].lon;

      Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`
        )
      ]).then(([weather, forecast]) => {
        return Promise.all([weather.json(), forecast.json()]);
      })
      .then(([weather, forecast]) => {
        // save city name and weather data to local storage
        var cityData = {
          city,
          weather,
          forecast,
        };
        cities.unshift(cityData);
        localStorage.setItem("cities", JSON.stringify(cities));
        renderCityButtons(cities);
        renderInterface(weather, forecast);
      }).catch((err) => {
        console.log(err);
      });
    });
}

// Function to render city buttons on the page
function renderCityButtons(cities) {
  // Create an array of city buttons using map
  const cityButtons = cities.map((city) => {
    // Wrap each button in a div with class "button-container" and set display property to block
    return $(`<div class="button-container"><button class="btn btn-primary" data-city="${city.city}">${city.city}</button></div>`)
  });
  
  console.log(cityButtons);
  // Render the city buttons to the element with id "city-buttons"
  $("#city-buttons").html(cityButtons);
}


function renderCityButtons(cities) {
  const cityButtons = cities.map((city) => {
    return $(`<div class="button-container"><button class="btn btn-primary" data-city="${city.city}">${city.city}</button></div>`)
  })
  console.log(cityButtons);
  $("#city-buttons").html(cityButtons);
}

function renderInterface(weather, forecast) {
  renderWeather(weather);
  render5DayForecast(forecast);
}

function handleUserInput(city) {
  // see if city is in cities array, if so, just render that data
  const foundCity = cities.find((c) => {
    return c.city.toLowerCase() === city.toLowerCase();
  });

  if (foundCity) {
    // render data
    renderInterface(foundCity.weather, foundCity.forecast)
  } else {
    // if not, then fetch data from api
    fetchDataFromApi(city)
  }
}

// create a function to render weather information on the page
function renderWeather(data) {
  var card = $("<div>").addClass("card");
  var cardTitle = $("<h2>").addClass("card-title").text(data.name);
  var cardBody = $("<div>").addClass("card-body");
  var tempEl = $("<h4>")
    .addClass("card-text")
    .text("temperature: " + Math.round(data.main.temp) + " °F");
  var icon = $("<img>").attr(
    "src",
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
  );
  var humidityEl = $("<h4>")
    .addClass("card-text")
    .text("humidity: " + data.main.humidity + "%");
  var windSpeedEl = $("<h4>")
    .addClass("card-text")
    .text("wind speed: " + data.wind.speed + " mph");

  $("#weather").html(
    card.append(
      cardTitle.append(icon),
      cardBody.append(tempEl, humidityEl, windSpeedEl)
    )
  );
}

// create a function to render 5 day forcast on the page
function render5DayForecast(data) {
  const newCards = [];

  for (var i = 0; i < data.list.length; i++) {
    var testTime = data.list[i].dt_txt.split(" ").pop();
    var targetTime = "00:00:00";
    
    if (testTime === targetTime) {
      var forecast = data.list[i];
      var dateDisplay = dayjs.unix(forecast.dt).format("ddd");
      var card = $("<div>")
        .addClass("card")
      var cardTitle = $("<h2>").addClass("card-title").text(dateDisplay);
      var cardBody = $("<div>").addClass("card-body");
      var tempEl = $("<h4>")
        .addClass("card-text")
        .text("temperature: " + Math.round(forecast.main.temp) + " °F");
      var icon = $("<img>").attr(
        "src",
        `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`
      );
      var humidityEl = $("<h4>")
        .addClass("card-text")
        .text("humidity: " + forecast.main.humidity + "%");
      var windSpeedEl = $("<h4>")
        .addClass("card-text")
        .text("wind speed: " + forecast.wind.speed + " mph");

      newCards.push(
        card.append(
          cardTitle.append(icon),
          cardBody.append(tempEl, humidityEl, windSpeedEl)
        )
      )
    }
  }

  $("#forecast").html(newCards);
}

cityFormEl.addEventListener("submit", function (event) {
  event.preventDefault();
  var cityName = document.getElementById("city").value;
  handleUserInput(cityName);
  // save city name to local storage
});

// add event listener to city buttons
$("#city-buttons").on("click", "button", function (event) {
  event.preventDefault();
  const city = $(this).attr("data-city");
  handleUserInput(city);
});