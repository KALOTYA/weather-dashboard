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

function saveState() {};

function renderWeather() {};

function renderHistory() {};

init();