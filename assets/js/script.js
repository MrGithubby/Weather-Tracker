const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const daysForecastDiv = document.querySelector(".days-forecast");
const searchHistoryDiv = document.querySelector("#search-history");

const API_KEY = '2db373437ba37df2b7f9ee7d7bf44dff';
document.addEventListener('DOMContentLoaded', function() {
// Function to add a searched city to search history
const addToSearchHistory = (city) => {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        displaySearchHistory();
    }
};

// Function to display search history
const displaySearchHistory = () => {
    const searchHistoryDiv = document.querySelector("#search-history");

    console.log("searchHistoryDiv:", searchHistoryDiv);
searchHistoryDiv.innerHTML = "";
    //searchHistoryDiv.innerHTML = searchHistoryDiv;
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistoryDiv.innerHTML = "";
    searchHistory.forEach(city => {
        const cityElement = document.createElement('div');
        cityElement.textContent = city;
        cityElement.classList.add('search-history-item');
        cityElement.addEventListener('click', () => {
            cityInput.value = city;
            searchButton.click();
        });
        searchHistoryDiv.appendChild(cityElement);
    });
};

// Function to display current weather conditions
const displayCurrentWeather = (cityName, weatherData) => {
    currentWeatherDiv.innerHTML = '';
    const weatherIcon = document.createElement('i');
    weatherIcon.classList.add('fas', `fa-${weatherData.weather[0].icon}`);
    const cityNameElement = document.createElement('h3');
    cityNameElement.textContent = `${cityName} (${new Date().toLocaleDateString()})`;
    const temperatureElement = document.createElement('h6');
    temperatureElement.textContent = `Temperature: ${((weatherData.main.temp - 273.15).toFixed(2))}°C`;
    const humidityElement = document.createElement('h6');
    humidityElement.textContent = `Humidity: ${weatherData.main.humidity}%`;
    const windElement = document.createElement('h6');
    windElement.textContent = `Wind: ${weatherData.wind.speed} M/S`;

    currentWeatherDiv.appendChild(weatherIcon);
    currentWeatherDiv.appendChild(cityNameElement);
    currentWeatherDiv.appendChild(temperatureElement);
    currentWeatherDiv.appendChild(humidityElement);
    currentWeatherDiv.appendChild(windElement);
};

// Function to display 5-day forecast
const displayFiveDayForecast = (forecastData) => {
    daysForecastDiv.innerHTML = '';
    forecastData.forEach(forecast => {
        const leftContainer = document.createElement('div');
        const leftIcon = document.createElement('i');
        leftIcon.classList.add('fas', 'fa-sun');
        const leftHeader = document.createElement('h3');
        leftHeader.classList.add('fw-bold');
        const forecastElement = document.createElement('div');
        forecastElement.classList.add('forecast-item', 'card-body', 'p-3' );
        const dateElement = document.createElement('h5');
        dateElement.textContent = forecast.dt_txt.split(" ")[0];
        const weatherIcon = document.createElement('i');
        weatherIcon.classList.add('fas', `fa-${forecast.weather[0].icon}`);
        const temperatureElement = document.createElement('h6');
        temperatureElement.textContent = `Temperature: ${((forecast.main.temp - 273.15).toFixed(2))}°C`;
        const humidityElement = document.createElement('h6');
        humidityElement.textContent = `Humidity: ${forecast.main.humidity}%`;
        const windElement = document.createElement('h6');
        windElement.textContent = `Wind: ${forecast.wind.speed} M/S`;

        leftContainer.appendChild(leftIcon);
        leftContainer.appendChild(leftHeader);
        forecastElement.appendChild(dateElement);
        forecastElement.appendChild(weatherIcon);
        forecastElement.appendChild(temperatureElement);
        forecastElement.appendChild(humidityElement);
        forecastElement.appendChild(windElement);

        daysForecastDiv.appendChild(forecastElement);
    });
};

// Function to get weather details for a city
const getWeatherDetails = (cityName) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then(response => response.json())
        .then(data => {
            addToSearchHistory(cityName);
            displayCurrentWeather(cityName, data);
        })
        .catch(error => {
            console.error("Error fetching current weather:", error);
        });

    const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`;
    fetch(FORECAST_API_URL)
        .then(response => response.json())
        .then(data => {
            const fiveDayForecast = data.list.filter((forecast, index) => index % 8 === 0);
            displayFiveDayForecast(fiveDayForecast);
        })
        .catch(error => {
            console.error("Error fetching 5-day forecast:", error);
        });
};

// Event listener for the search button
searchButton.addEventListener("click", () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    getWeatherDetails(cityName);
});

// Display search history on page load
displaySearchHistory();
});
