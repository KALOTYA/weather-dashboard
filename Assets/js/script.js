var state = {
    history: []
};

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

function renderWeather() {};

function renderHistory() {
    $("city-list").empty();

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