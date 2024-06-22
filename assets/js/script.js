const cityFormEl = document.querySelector("#city-form");
const historyButtonsEl = document.querySelector("#history-buttons");
const cityInputEl = document.querySelector("#cityname");
const weatherContainerEl = document.querySelector("#weather-container");
const forecastContainerEl = document.querySelector("#forecast-container");
const citySearchTerm = document.querySelector("#city-search-term");

const apiKey = "85857869e938505a57be7c6968414eb8";

const formSubmitHandler = function (event) {
  event.preventDefault();

  const city = cityInputEl.value.trim();

  if (city) {
    getWeatherData(city);
    cityInputEl.value = "";
  } else {
    alert("Please enter a city name");
  }
};

const buttonClickHandler = function (event) {
  const city = event.target.getAttribute("data-city");

  if (city) {
    getWeatherData(city);
  }
};

const getWeatherData = function (city) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

  Promise.all([fetch(weatherUrl), fetch(forecastUrl)])
    .then((responses) =>
      Promise.all(responses.map((response) => response.json()))
    )
    .then((data) => {
      const weatherData = data[0];
      const forecastData = data[1];

      displayWeather(weatherData, city);
      saveCityToHistory(city);
      displayForecast(forecastData);
    })
    .catch((error) => {
      alert("Unable to connect to OpenWeather");
      console.error(error);
    });
};

const displayWeather = function (data, city) {
  weatherContainerEl.innerHTML = "";
  citySearchTerm.textContent = city;

  const weatherEl = createWeatherElement(data);
  weatherContainerEl.appendChild(weatherEl);
};

const displayForecast = function (data) {
  forecastContainerEl.innerHTML = "";

  for (let i = 0; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    const forecastEl = createWeatherElement(forecast);
    forecastContainerEl.appendChild(forecastEl);
  }
};

const createWeatherElement = function (data) {
  const weatherEl = document.createElement("div");
  weatherEl.classList = "list-item flex-column";

  const dateEl = document.createElement("h3");
  dateEl.textContent = new Date(data.dt * 1000).toLocaleDateString();

  const iconEl = document.createElement("img");
  iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

  const tempEl = createWeatherInfoElement(`Temperature: ${data.main.temp} °F`);
  const humidityEl = createWeatherInfoElement(
    `Humidity: ${data.main.humidity}%`
  );
  const windEl = createWeatherInfoElement(`Wind Speed: ${data.wind.speed} mph`);

  weatherEl.append(dateEl, iconEl, tempEl, humidityEl, windEl);
  return weatherEl;
};

const createWeatherInfoElement = function (text) {
  const infoEl = document.createElement("p");
  infoEl.textContent = text;
  return infoEl;
};

const saveCityToHistory = function (city) {
  let cities = JSON.parse(localStorage.getItem("cities")) || [];

  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
    displayCityHistory();
  }
};

const displayCityHistory = function () {
  historyButtonsEl.innerHTML = "";

  let cities = JSON.parse(localStorage.getItem("cities")) || [];

  cities.forEach((city) => {
    const cityButton = document.createElement("button");
    cityButton.classList = "btn history-btn";
    cityButton.setAttribute("data-city", city);
    cityButton.textContent = city;

    historyButtonsEl.appendChild(cityButton);
  });
};

cityFormEl.addEventListener("submit", formSubmitHandler);
historyButtonsEl.addEventListener("click", buttonClickHandler);

displayCityHistory();
