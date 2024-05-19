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

function loadState() {};

function saveState() {};

function renderWeather() {};

function renderHistory() {};

init();