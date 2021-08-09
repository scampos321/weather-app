var historyEl = $("#history");
var cities = [];
var appId = "20fab4ae5f8c4fb464b174833f4800e4";



function storageCities() {

    var storedCities = JSON.parse(localStorage.getItem("cities"));


    if (storedCities !== null) {
        cities = storedCities;
    }

    displayLocation();

}


function storeCities() {

    localStorage.setItem("cities", JSON.stringify(cities));
    console.log(localStorage);
}


function displayLocation() {

    historyEl.empty();


    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];

        var li = $("<li>").text(city);
        li.attr("id", "location-list");
        li.attr("data-location", city);
        li.attr("class", "btn btn-info");
        console.log(li);
        historyEl.prepend(li);
    }

    if (!city) {
        return
    } else {
        setWeather(city)
    };
}

$("#search-btn").on("click", function(event) {
    event.preventDefault();


    var city = $("#search-input").val().trim();


    if (city === "") {
        return;
    }

    cities.push(city);

    storeCities();
    displayLocation();
});


function setWeather(cityName) {
    var getWeatherApi = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + appId;


    $("current-city-weather").empty();
    $.ajax({
        url: getWeatherApi,
        method: "GET"
    }).then(function(response) {


        locationName = $("#location-name").text(response.name + " " + setDate());
        $("current-city-weather").append(locationName);

        var calcTemp = parseInt((response.main.temp) * 9 / 5 - 459);
        var displayTemp = $("#temp").text("Temp: " + calcTemp + " °F");

        $("current-city-weather").append(displayTemp);

        var displayHumid = $("#humid").text("Humidity: " + response.main.humidity + " %");
        $("current-city-weather").append(displayHumid);

        var displayWind = $("#wind").text("Wind: " + response.wind.speed + " MPH");
        $("current-city-weather").append(displayWind);

        var coordLon = response.coord.lon;
        var coordLat = response.coord.lat;


        var getApiUv = "https://api.openweathermap.org/data/2.5/uvi?appid=" + appId + "&lat=" + coordLat + "&lon=" + coordLon;
        $.ajax({
            url: getApiUv,
            method: "GET"
        }).then(function(getUV) {

            var displayUV = $("<h2>").text(getUV.value);

            var locationUV = $("<p>").text("UV Index: ");

            locationUV.append(displayUV);

            $("current-city-weather").append(locationUV);

            console.log(typeof getUV.value);
            if (getUV.value > 0 && getUV.value <= 2) {

                displayUV.attr("class", "btn")

            } else if (getUV.value > 2 && getUV.value <= 5) {

                displayUV.attr("class", "red")

            } else if (getUV.value > 5 && getUV.value <= 7) {

                displayUV.attr("class", "pink")

            } else if (getUV.value > 7 && getUV.value <= 10) {

                displayUV.attr("class", "blue")

            } else {

                displayUV.attr("class", "green")
            }
        });


        var getFiveDayApi = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + appId;
        $.ajax({
            url: getFiveDayApi,
            method: "GET"
        }).then(function(setFiveDayWeather) {
            $("#fiveday-output").empty();
            console.log(setFiveDayWeather);
            for (var i = 0, j = 0; j <= 5; i = i + 6) {
                var setDate = setFiveDayWeather.list[i].dt;
                if (setFiveDayWeather.list[i].dt != setFiveDayWeather.list[i + 1].dt) {
                    var fiveDayCards = $("<div>");
                    fiveDayCards.attr("class", "col m-1 card bg-info h-20 text-grey")
                    var d = new Date(0);

                    d.setUTCSeconds(setDate);
                    var date = d;
                    console.log(date);

                    var month = date.getMonth() + 1;

                    var day = date.getDate();

                    var displayDate = date.getFullYear() + '/' +
                        (month < 10 ? '0' : '') + month + '/' +
                        (day < 10 ? '0' : '') + day;
                    var dateCard = $("<h5>").text(displayDate);

                    var skyImage = $("<img>");

                    var currentSky = setFiveDayWeather.list[i].weather[0].main;
                    if (currentSky === "Clouds") {

                        skyImage.attr("src", "./assets/images/cloud.png")

                    } else if (currentSky === "Clear") {

                        skyImage.attr("src", "./assets/images/31479-200.png")

                    } else if (currentSky === "Rain") {

                        skyImage.attr("src", "./assets/images/rainicon.png")
                    }


                    var cityBoxName = $("<h4>").text("Weather in " + response.name);

                    fiveDayCards.append(cityBoxName);

                    var calTemp = setFiveDayWeather.list[i].main.temp;

                    console.log(currentSky);

                    var currentTemp = parseInt((calTemp) * 9 / 5 - 459);

                    var currentTemp = $("<dt>").text("Temp:" + currentTemp + " °F");

                    var currentHumid = $("<dt>").text("Humidity: " + setFiveDayWeather.list[i].main.humidity + " %");

                    var windBoxName = $("<dt>").text("Wind: " + response.wind.speed + "MPH");

                    fiveDayCards.append(dateCard);

                    fiveDayCards.append(skyImage);

                    fiveDayCards.append(currentTemp);

                    fiveDayCards.append(currentHumid);

                    fiveDayCards.append(windBoxName);
                    $("#fiveday-output").append(fiveDayCards);
                    console.log(setFiveDayWeather);
                    j++;
                }

            }

        });


    });

}

function setDate(date) {
    var date = new Date();
    console.log(date);
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var displayDate = date.getFullYear() + '/' +
        (month < 10 ? '0' : '') + month + '/' +
        (day < 10 ? '0' : '') + day;
    return displayDate;
}


$(document).on("click", "#location-list", function() {
    var locationStatus = $(this).attr("data-location");
    setWeather(locationStatus);
});

function init() {
    storageCities();
}
init();