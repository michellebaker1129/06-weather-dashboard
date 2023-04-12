var cityFormEl = document.getElementById("city-form");
var currentDate = dayjs();
var key = "ee58e3e024677f636e675b8a11b6a05c";

// create a function to fetch all data for a city
// hit all apis needed
// save that data to local storage

function getLatLon(city) {
  console.log(city);
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
      getWeather(lat, lon);
    });
}

function getWeather(lat, lon) {
  console.log(lat, lon);
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`
  )
    .then((response) => response.json())
    .then((data) => {
      renderWeather(data);
    });
  get5DayForecast(lat, lon);
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

function get5DayForecast(lat, lon) {
  console.log(lat, lon);
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      render5DayForecast(data);
    });
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
  getLatLon(cityName);
  // save city name to local storage
});
