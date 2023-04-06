var cityFormEl = document.getElementById("city-form")
var key = "ee58e3e024677f636e675b8a11b6a05c"
function getLatLon(city){
    console.log(city)
    fetch("http://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=5&appid="+key).then(response => {
        return response.json()
    }) .then(data => {
        var lat = data[0].lat
        var lon = data[0].lon
        getWeather(lat,lon)
    })
}

function getWeather(lat,lon){
    console.log(lat, lon)
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`).then(response => response.json()).then(data => {
        console.log(data)
        var card = $("<div>").addClass("card")
        var cardTitle = $("<h2>").addClass("card-title").text(data.name)
        var cardBody = $("<div>").addClass("card-body")
        var tempEl = $("<h4>").addClass("card-text").text(data.main.temp)
        var icon = $("<img>").attr("src",`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
//add humidity, windspeed 
        $("#weather").append(card.append(cardTitle.append(icon), cardBody.append(tempEl)))   
    })
}

function get5DayForecast(lat, lon){
    console.log(lat, lon)
}

cityFormEl.addEventListener("submit", function(event){
    event.preventDefault()
    var cityName = document.getElementById("city").value
    getLatLon(cityName)
})

