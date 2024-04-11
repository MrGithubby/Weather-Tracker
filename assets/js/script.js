const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const daysForecastDiv = document.querySelector(".days-forecast");
const searchHistoryDiv = document.querySelector("#search-history");

const API_KEY = '2db373437ba37df2b7f9ee7d7bf44dff'; 

// Create weather card HTML based on weather data
const createWeatherCard = (cityName, weatherItem, index) => {
    const container = document.createElement('div');
    if (index === 0) {
        container.classList.add('mt-3', 'd-flex', 'justify-content-between');
        
        const leftContainer = document.createElement('div');
        const leftIcon = document.createElement('i');
        leftIcon.classList.add('fas', 'fa-sun');
        const leftHeader = document.createElement('h3');
        leftHeader.classList.add('fw-bold');
        leftHeader.textContent = `${cityName} (${weatherItem.dt_txt.split(" ")[0]})`;
        const leftTemp = document.createElement('h6');
        leftTemp.classList.add('my-3', 'mt-3');
        leftTemp.textContent = `Temperature: ${((weatherItem.main.temp - 273.15).toFixed(2))}°C`;
        const leftWind = document.createElement('h6');
        leftWind.classList.add('my-3');
        leftWind.textContent = `Wind: ${weatherItem.wind.speed} M/S`;
        const leftHumidity = document.createElement('h6');
        leftHumidity.classList.add('my-3');
        leftHumidity.textContent = `Humidity: ${weatherItem.main.humidity}%`;

        leftContainer.appendChild(leftIcon);
        leftContainer.appendChild(leftHeader);
        leftContainer.appendChild(leftTemp);
        leftContainer.appendChild(leftWind);
        leftContainer.appendChild(leftHumidity);

        const rightContainer = document.createElement('div');
        rightContainer.classList.add('text-center', 'weather-icon', 'me-lg-5');
        const rightIcon = document.createElement('i');
        rightIcon.classList.add('fas', 'fa-sun');
        const rightDescription = document.createElement('h6');
        rightDescription.textContent = weatherItem.weather[0].description;

        rightContainer.appendChild(rightIcon);
        rightContainer.appendChild(rightDescription);

        container.appendChild(leftContainer);
        container.appendChild(rightContainer);
    } else {
        container.classList.add('col', 'mb-3');

        const card = document.createElement('div');
        card.classList.add('card', 'border-0', 'bg-secondary', 'text-white');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'weather-icon', 'p-3', 'text-white');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title', 'fw-semibold');
        cardTitle.textContent = `(${weatherItem.dt_txt.split(" ")[0]})`;

        const cardIcon = document.createElement('i');
        cardIcon.classList.add('fas', 'fa-sun');

        const cardTemp = document.createElement('h6');
        cardTemp.classList.add('card-text', 'my-3', 'mt-3');
        cardTemp.textContent = `Temp: ${((weatherItem.main.temp - 273.15).toFixed(2))}°C`;

        const cardWind = document.createElement('h6');
        cardWind.classList.add('card-text', 'my-3');
        cardWind.textContent = `Wind: ${weatherItem.wind.speed} M/S`;

        const cardHumidity = document.createElement('h6');
        cardHumidity.classList.add('card-text', 'my-3');
        cardHumidity.textContent = `Humidity: ${weatherItem.main.humidity}%`;

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardIcon);
        cardBody.appendChild(cardTemp);
        cardBody.appendChild(cardWind);
        cardBody.appendChild(cardHumidity);

        card.appendChild(cardBody);
        container.appendChild(card);
    }
    return container;
};

// Get weather details of passed latitude and longitude
const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
        const forecastArray = data.list;
        const uniqueForecastDays = new Set();

        const fiveDaysForecast = forecastArray.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.has(forecastDate) && uniqueForecastDays.size < 6) {
                uniqueForecastDays.add(forecastDate);
                return true;
            }
            return false;
        });

        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        daysForecastDiv.innerHTML = "";

        fiveDaysForecast.forEach((weatherItem, index) => {
            const container = createWeatherCard(cityName, weatherItem, index);
        
            // Append the container to the appropriate parent element
            if (index === 0) {
                currentWeatherDiv.appendChild(container);
            } else {
                daysForecastDiv.appendChild(container);
            }
        });
               
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });
}