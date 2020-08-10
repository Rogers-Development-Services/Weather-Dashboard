// GIVEN a weather dashboard with form inputs 
// WHEN I search for a city THEN I am presented with current and future conditions for that city and that city is added to the search history [ ]
// WHEN I view current weather conditions for that city THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index [ ]
// WHEN I view the UV index THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe [ ]
// WHEN I view future weather conditions for that city THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity [ ]
// WHEN I click on a city in the search history THEN I am again presented with current and future conditions for that city [ ]
// WHEN I open the weather dashboard THEN I am presented with the last searched city forecast [ ]

// @returns {string}

const queryParams = { 
  'appid': '20062578d6282047a3d69cc7caf70ee7',
  'units': 'imperial'
};

function buildQueryURL () {
  
// Parameters 'q' = city name, state code and country code divided by comma, use ISO 3166 country codes. 
  
  queryParams.q = $('#search-city')
    .val()
    .trim();
  console.log(queryParams.q);
  console.log(queryParams);

  // queryParams.sys.state = $('#search-state')
  //   .val()
  //   .trim();
    
  // queryParams.sys.country = $('#search-country')
  //   .val()
  //   .trim();

  let queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + queryParams.q + '&units=' + queryParams.units +'&appid=' + queryParams.appid;
  // let urrentUvIndexURL = '#'; 
  // let forecastURL = '#';

  // Logging the URL so we have access to it for troubleshooting
  console.log("---------------\nURL: " + queryURL + "\n---------------");

  return queryURL;
  // console.log($.param(queryParams));
  // console.log(queryURL + $.param(queryParams));
  // return queryURL + $.param(queryParams);
}

function updatePage (response) {

  let cityNameData = response.name;
  let currentDateData = response.dt;
  let weatherIcon = response.weather.icon;
  let currentTempData = '<strong>Temperature: </strong>' + response.main.temp + ' ℉';
  let currentHumidityData = '<strong>Humidity: </strong>' + response.main.humidity + ' %';
  let windSpeedData = '<strong>Wind Speed: </strong>' + response.wind.speed + 'MPH';
  // let uvIndexData = '#';

        // search for the coordinates in the first api 
        // let lattitude = response.coord.lat;
        // let longitude = response.coord.lon;

  let currentWeatherDiv = $('#current-weather');
  let cityName = `<h2>${cityNameData + ' ' + currentDateData}</h2>`;
  // let weatherIconImg = ;
  let currentTemp = `<p>${currentTempData}</p>`;
  let currentHumidity = `<p>${currentHumidityData}</p>`;
  let windSpeed = `<p>${windSpeedData}</p>`


  currentWeatherDiv.append(cityName, currentTemp, currentHumidity, windSpeed);
}

// Function to empty out the cities
function clear() {
  $('#weekly-forecast').empty();
  $('#current-weather').empty();
  $('#city-selection').empty();
}


  // Event listener for search
  $("#run-search").on("click", function(event) {
    event.preventDefault();

    clear();

    let queryURL = buildQueryURL();
    
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(updatePage); 
});

//  .on("click") function associated with the clear button
$("#clear-all").on("click", clear);







  // let cityNameData = response.name;
  //       console.log(cityNameData);
  //       let currentDateData = response.dt;
  //       console.log(time(currentDateData));


  //       let currentTemp = response.main.temp;
  //       console.log(currentTemp);
  //       let currentHumidity = response.main.humidity;
  //       console.log(currentHumidity);
  //       let windSpeedData = '#';
  //       let uvIndexData = '#';

        // search for the coordinates in the first api 
        // let lattitude = response.coord.lat;
        // let longitude = response.coord.lon;

        // let currentWeather = $("<div>");

        // currentWeather.attr("id", "current-weather");

        // currentWeather.append(currentTemp, currentHumidity);
        // $(".weather-display").append(currentWeather);