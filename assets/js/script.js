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
        forecastElement.classList.add('forecast-item', 'card-body', 'p-3','bg-secondary' ,'text-white');
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
    // Fetch coordinates for the given city
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                // Call the function to fetch weather details using the obtained coordinates
                fetchWeatherData(cityName, lat, lon);
            } else {
                console.error("No coordinates found for the city:", cityName);
            }
        })
        .catch(error => {
            console.error("Error fetching coordinates:", error);
        });
};

const fetchWeatherData = (cityName, lat, lon) => {
    // Weather API URL with latitude and longitude
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    
    // Fetch current weather data
    fetch(WEATHER_API_URL)
        .then(response => response.json())
        .then(data => {
            addToSearchHistory(cityName);
            displayCurrentWeather(cityName, data);
        })
        .catch(error => {
            console.error("Error fetching current weather:", error);
        });

    // Forecast API URL with latitude and longitude
    const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    
    // Fetch 5-day forecast data
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
