// GIVEN a weather dashboard with form inputs 
// WHEN I search for a city THEN I am presented with current and future conditions for that city and that city is added to the search history [ ]
// WHEN I view current weather conditions for that city THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index [ ]
// WHEN I view the UV index THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe [ ]
// WHEN I view future weather conditions for that city THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity [ ]
// WHEN I click on a city in the search history THEN I am again presented with current and future conditions for that city [ ]
// WHEN I open the weather dashboard THEN I am presented with the last searched city forecast [ ]

const apiKey = "20062578d6282047a3d69cc7caf70ee7";
const cityName = $();
const stateCode = $();
const countryCode = $();

  // Event listener for search
  $(".city-search").on("click", function(event) {
    event.preventDefault();
    
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
