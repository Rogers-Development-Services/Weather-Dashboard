const apiKey = "20062578d6282047a3d69cc7caf70ee7";

  // Event listener for search
  $(".city-search").on("click", function(event) {
    event.preventDefault();
    
    let cityName ='';
    let stateCode ='';
    let countryCode ='';
    
    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=London&appid=20062578d6282047a3d69cc7caf70ee7'

    // "api.openweathermap.org/data/2.5/weather?q=" + cityName + ','stateCode + ','countryCode + '&appid=' + apiKey;

    $.ajax({
      url: queryURL,
      method: "GET"
    })

      .then(function(response) {

        let currentTemp = response.main.temp;
        console.log(currentTemp);
        
        let currentHumidity = response.main.humidity;
        console.log(currentHumidity);

        // search for the coordinates in the first api 
        // let lattitude = response.coord.lat;
        // let longitude = response.coord.lon;

        let currentWeather = $("<div>");

        currentWeather.attr("id", "current-weather");

        currentWeather.append(currentTemp, currentHumidity);
        $(".weather-display").append(currentWeather);
      });
  });
