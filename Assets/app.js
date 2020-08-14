// GIVEN a weather dashboard with form inputs 
// WHEN I search for a city THEN I am presented with current and future conditions for that city and that city is added to the search history [ X ]
// WHEN I view current weather conditions for that city THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index [ X ]
// WHEN I view the UV index THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe [ X ]
// WHEN I view future weather conditions for that city THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity [ X ]
// WHEN I click on a city in the search history THEN I am again presented with current and future conditions for that city [ ]
// WHEN I open the weather dashboard THEN I am presented with the last searched city forecast [ X ]

// @returns {string}

$(document).ready(function() {

  // Declare Constants
  const queryParams = { 
    'appid': '20062578d6282047a3d69cc7caf70ee7',
    'units': 'imperial'
  }; 
  const currentWeatherDiv = $('#current-weather');
  const forecastDiv = $('#weekly-forecast');
  const searchedDiv = $('#city-section');
  const searchBtn = $('#run-search');

// Establishes savedCities and makes sure last city searched is available
  let savedCities = JSON.parse(localStorage.getItem('savedCities'));
  if (!savedCities) {
    savedCities = [];
    localStorage.setItem('savedCities', JSON.stringify(savedCities));
  } else if (savedCities[0] !== undefined) {  
    const firstCityToAdd = savedCities[savedCities.length - 1];
    let lastSavedBtn = $(`<button class="city-button">${firstCityToAdd}</button>`);
    lastSavedBtn.attr("id", lastSavedBtn.text());
    searchedDiv.append(lastSavedBtn);
    searchedDiv.append(lastSavedBtn);
  }  


  // This function will pull from the form and build the query URL for the current weather section.
  function buildQueryURL () {
    
    queryParams.q = $('#search-city')
      .val()
      .trim();
    // console.log(queryParams.q);
    // console.log(queryParams);

    // queryParams.sys.state = $('#search-state')
    //   .val()
    //   .trim();
      
    // queryParams.sys.country = $('#search-country')
    //   .val()
    //   .trim();

    let queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + queryParams.q + '&units=' + queryParams.units +'&appid=' + queryParams.appid;
    // console.log("---------------\nURL: " + queryURL + "\n---------------");
    return queryURL;
  }

  // This function takes API Data (JSON/Object) and turns it into elements with the current weather card
  function updateWeather (response) {

    let cityNameData = response.name;
    let currentDateData = moment(response.dt*1000).format('dddd, MMMM Do, YYYY @h:mm A (PT)');
    let weatherIcon = new Image();
    // console.log(response.weather);
    weatherIcon.src = 'http://openweathermap.org/img/wn/' + response.weather[0].icon + '.png';
    weatherIcon.alt = response.weather[0].description;
    // console.log(weatherIcon.alt);
    // console.log(weatherIcon);
    
    let currentTempData = '<strong>Temperature: </strong>' + response.main.temp + ' ℉';
    let currentHumidityData = '<strong>Humidity: </strong>' + response.main.humidity + ' %';
    let windSpeedData = '<strong>Wind Speed: </strong>' + response.wind.speed + 'MPH';

    // set the lat and log for UV coordinates in queryParams{} 
    queryParams.lat = response.coord.lat;
    // console.log(queryParams.lat)
    queryParams.lon = response.coord.lon;
    // console.log(queryParams.lon)
    // console.log(queryParams);

    let cityInfo = `<h2>${cityNameData}</h2>` + `<h4>${currentDateData}</h4>`;
    let currentTemp = `<p>${currentTempData}</p>`;
    let currentHumidity = `<p>${currentHumidityData}</p>`;
    let windSpeed = `<p>${windSpeedData}</p>`

    $.ajax({
      url: buildUvURL(),
      method: "GET"
    }).then(updateUvIndex);

    $.ajax({
      url: buildForecastURL(),
      method: "GET"
    }).then(updateForecast);
    
    currentWeatherDiv.append(cityInfo, weatherIcon, currentTemp, currentHumidity, windSpeed);

//only want the 10 most recent submissions

    console.log(cityNameData);
    savedCities.push(cityNameData);
    console.log(savedCities);
    updateTwice();
  }

  // updates local storage and savedCities[]
  function updateTwice() {
    searchedDiv.empty();
    for (let i = 0 ; i < 10; i++) {
      const cityToAdd = savedCities[savedCities.length - 1 - i];

      if (cityToAdd) {
        let cityButton = $(`<button class="city-button">${cityToAdd}</button>`);
        cityButton.attr("id", cityButton.text());
        searchedDiv.append(cityButton);

        // add a click listener function for each button
        cityButton.on('click', function (event) {
          event.preventDefault();
          
          clearWeather();

          let btnName = cityButton.text();

          let btnWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + btnName + '&units=' + queryParams.units +'&appid=' + queryParams.appid;

          let btnUvURL = 'https://api.openweathermap.org/data/2.5/uvi?appid=' + queryParams.appid + '&lat=' + queryParams.lat + '&lon=' + queryParams.lon;

          let btnForecastURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + btnName + '&units=' + queryParams.units + '&appid=' + queryParams.appid;
          console.log("---------------\nURL: " + btnForecastURL + "\n---------------");

          $.ajax({
            url: btnWeatherURL,
            method: "GET"
          }).then(updateWeather); 

          $.ajax({
            url: btnUvURL,
            method: "GET"
          }).then(updateUvIndex); 

          $.ajax({
            url: btnForecastURL,
            method: "GET"
          }).then(clearForecast, updateForecast); 

        });        
        // reference cityButton in some way since it corresponds to a specific city
        // on click write a new function or write the function in place for an ajax call similar to the one at the bottom of this file
        // either write a new buildQueryURL (with a different name) that takes in an argument which would be city name
        // OR refactor original buildQueryURL to take in an argument (in which case add an argument in your buildQueryURL call at the bottom of this file) => $('#search-city') value trim
        // maybe call that buildQueryURL function before (or inside like before is ok) the ajax with your "cityToAdd" reference string
        // .then update weather
        // hopefully that works
        // we are doing this within the for loop above because we want to refrence each indiv btn, depending on its text within cityToAdd, and we can't access it anywhere outside of this loop.
      }
    }

    // update localstorage
    localStorage.setItem('savedCities', JSON.stringify(savedCities)); 
  }


  function buildUvURL () {

    // console.log(queryParams);
    let uvURL = 'https://api.openweathermap.org/data/2.5/uvi?appid=' + queryParams.appid + '&lat=' + queryParams.lat + '&lon=' + queryParams.lon;
    // console.log("---------------\nURL: " + uvURL + "\n---------------");
    return uvURL;
  }

  function updateUvIndex (response) {  //You need to wait for the AJAX call to come back, thats why we added the new ajax into the first function. JS is asynchronous. 
    let uvIndexData = response.value;
    let uvIndex = `<p><strong>UV Index: </strong><span id="uv-index">${uvIndexData}</span></p>`;
    currentWeatherDiv.append(uvIndex);

    if (uvIndexData < 3) {
      $('#uv-index').css('background-color', 'green');
    } else if (uvIndexData < 6) {
      $('#uv-index').css('background-color', 'yellow');
    } else if (uvIndexData < 8) {
      $('#uv-index').css('background-color', 'orange');
    } else if (uvIndexData < 11) {
      $('#uv-index').css('background-color', 'red');
    } else {
      $('#uv-index').css('background-color', 'violet');
    }
  }

  function buildForecastURL () {

  let forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + queryParams.q + '&units=' + queryParams.units + '&appid=' + queryParams.appid;
  // console.log("---------------\nURL: " + forecastURL + "\n---------------");

  return forecastURL
  }

  function updateForecast(response) {

      //day's weather will be queried everyday at noon
    let noonIndex = 4;
    for (i=0; i < 5 ;i++) {

      const dateDiv = $('<div>').css({
        "display": "block",
        "max-width": "20%",
        "padding": "1rem",
        "margin": "0 0 1rem 0",
        "background-color": "#007eb5",
        "border-style": "solid",
        "color": "white",
      });
      dateDiv.attr({
        "id": "weekday-forecast",
      })
      const dateData = moment(response.list[noonIndex].dt*1000).format('ddd <br> MM-D-YY');
      const dateIcon = new Image();
      dateIcon.src = 'http://openweathermap.org/img/wn/' + response.list[noonIndex].weather[0].icon.replace('n','d') + '.png';
      dateIcon.alt = response.list[noonIndex].weather[0].description;
      const dateTempData = '<strong>Temperature: </strong>' + '<br>' + response.list[i].main.temp + ' ℉'
      const dateHumidityData = '<strong>Humidity: </strong>' + '<br>' + response.list[i].main.humidity + ' %';

      let dateEl = `<h5>${dateData}</h5>`;
      let dateTempEl = `<p>${dateTempData}</p>`;
      let dateHumidity = `<p>${dateHumidityData}</p>`;
      
      dateDiv.append(dateEl, dateIcon, dateTempEl, dateHumidity);
      forecastDiv.append(dateDiv);
      noonIndex += 8
    }
  }

  // function to empty out weather div
  function clearWeather () {
    $('#current-weather').empty();
  }

  // Function to empty out forecast div
  function clearForecast () {
    $('#weekly-forecast').empty();
  }

  // Function to empty out the cities
  function clearResults() {
    $('#weekly-forecast').empty();
    $('#current-weather').empty();
    $('#city-selection').empty();
  }

    // Event listener for search
  $("#run-search").on("click", function(event) {
    event.preventDefault();

    clearResults();
      
    $.ajax({
      url: buildQueryURL(),
      method: "GET"
    }).then(updateWeather); 
  });

  //  .on("click") function associated with the clear button
  $("#clear-all").on("click", clearResults);
})