var state = {
    history: []
};
var apiKey = "7aa1575e6481806aa9d43ca2e3f7b41d";

function init () {
    loadState();
    renderHistory();

    $("#search-button").on('click', function(){
        var city = $("#input-city").val();
        
        if (city === "") {
            window.alert("There is no city provided! Please provide a city.");
            return;
        }

        renderWeather(city);

        if (state.history.indexOf(city) === -1) {
            state.history.push(city);
            saveState()
        }

        renderHistory();
    });
};

function loadState() {
    
    var json = localStorage.getItem("weather_dashboard");
    
    if (json !== null) {
        state = JSON.parse(json);
    }
};

function saveState() {
    var json = JSON.stringify(state);

    localStorage.setItem("weather_dashboard", json);
};

function renderWeather(city) {
    // Get the coordinates of the city using OpenWeatherMap Geocoding API
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            console.log("Data received from the API:", data);
            if (!data || data.length === 0) {
                throw new Error('City not found');
            }

            // Get the city longitude and latitude coordinates
            const { lat: latitude, lon: longitude } = data[0];

            return { latitude, longitude };
        })
        .then(coordinates => {
            console.log('Coordinates:', coordinates);
            // With the coordinates of the city, obtain the weather
            var currentDate = new Date();
            currentDate.setHours(12, 0, 0, 0);
            var timestamp = Math.floor(currentDate.getTime() / 1000);

            return Promise.all([
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&units=imperial&appid=${apiKey}`),
                fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&units=imperial&dt=${timestamp}&appid=${apiKey}`)
            ]);
        })
        .then(([currentWeatherResponse, forecastResponse]) => {
            console.log('Weather API Response Status:', currentWeatherResponse.status); 
            return Promise.all([currentWeatherResponse.json(), forecastResponse.json()]);
        })
        .then(([currentWeather, forecast]) => {
            console.log('Current weather:', currentWeather);
            console.log('5-day forecast:', forecast);
            console.log('timezone:', forecast.list[0].dt_txt);

            // Render the weather
            const today = new Date();
            const todayString = ` (${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()})`;

            // Generate the weather icons for the current weather
            const iconHtml = currentWeather.weather.map(currentWeather =>
                `<img width='64px' title='${currentWeather.description}' src='http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png' />`
            ).join('');
            
            // Set the values for the current weather
            $("#city").html(currentWeather.name + todayString);
            $("#temperature").text(` ${currentWeather.main.temp}°F`);
            $("#wind").text(` ${currentWeather.wind.speed} km/h`);
            $("#humidity").text(` ${currentWeather.main.humidity} %`);
            $("#uv-index").text(` ${currentWeather.weather[0].description}`);


            // Render the 5-day forecast
            const template = $('#five-days-forecast .template');

            // Remove old forecasts
            $('#five-days-forecast .forecast').remove();

            const dailyForecasts = forecast.list.filter(item => item.dt_txt.includes("21:00:00"));
            console.log("Daily:", dailyForecasts);

            for (let i = 0; i < 5; i++) {
                const forecast = template.clone();
                forecast.removeClass('template');
                forecast.addClass('forecast');

                // Get the weather for this day
                const dayWeather = dailyForecasts[i];

                // Get the day's date
                const date = new Date(dayWeather.dt * 1000);

                // Generate the weather icons for the forecast day
                const forecastIconHtml = dayWeather.weather.map(currentWeather =>
                    `<img width='64px' title='${currentWeather.description}' src='http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png' />`
                ).join('');

                // Set the values for the forecast day
                forecast.find('.date').text(` ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} `);
                forecast.find('.icon').html(forecastIconHtml);
                forecast.find('.temperature').text(` ${dayWeather.main.temp}°F`);
                forecast.find('.wind').text(` ${dayWeather.wind.speed} km/h`);
                forecast.find('.humidity').text(` ${dayWeather.main.humidity} %`);

                // Add the forecast to the 5-day-forecast
                $('#five-days-forecast').append(forecast);
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Could not retrieve weather data. Please try again.');
        });
}

function renderHistory() {
    $("#city-list").empty();

    for (var i = 0; i < state.history.length; i++){
        var city = $("<button class='col-12 rounded btn btn-secondary m-1'></button>");
        city.text(state.history[i]);
        city.on('click', function() {
            var button = $(this);
            renderWeather(button.text());
        });

        $("#city-list").append(city);
    }
};

init();