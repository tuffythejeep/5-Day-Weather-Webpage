const cityFormEl = document.querySelector("#city-form");
const historyButtonsEl = document.querySelector("#history-buttons");
const cityInputEl = document.querySelector("#cityname");
const weatherContainerEl = document.querySelector("#weather-container");
const forecastContainerEl = document.querySelector("#forecast-container");
const citySearchTerm = document.querySelector("#city-search-term");

const apiKey = "85857869e938505a57be7c6968414eb8";

const formSubmitHandler = function (event) {
  event.preventDefault();

  if (city) {
    getCityWeather(city);

    cityInputEl.value = "";
  } else {
    alert("Please enter a city name");
  }
};

const buttonClickHandler = function (event) {
  const city = event.target.getAttribute("data-city");

  if (city) {
    getCityWeather(city);
  }
};

