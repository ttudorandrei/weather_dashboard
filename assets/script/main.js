const API_KEY = "0492fcec51078a456b3b312201fb3dea";

//this function gets the city names from local storage
const getFromLocalStorage = () => {
  const localStorageData = JSON.parse(localStorage.getItem("cities"));

  if (localStorageData === null) {
    return [];
  } else {
    return localStorageData;
  }
};

//this function fetches data from api
const fetchData = async (url) => {
  try {
    const response = await fetch(url);

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

//this will retrieve the city name based on which list item is clicked
const getDataByCityName = async (event) => {
  const target = $(event.target);

  //if targeted element is a li, it will execute the function
  if (target.is("li")) {
    const cityName = target.data("city");

    renderAllCards(cityName);
  }
};

//contains the data we want from the Current Weather Data API
const transformCurrentDayData = (data, name) => {
  const current = data.current;
  return {
    cityName: name,
    temperature: current.temp,
    humidity: current.humidity,
    windSpeed: current.wind_speed,
    date: moment.unix(current.dt).format("MM/DD/YYYY"),
    iconURL: `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`,
    uvi: current.uvi,
  };
};

const transformForecastData = (data) => {
  return {
    date: moment.unix(data.dt).format("MM/DD/YYYY"),
    iconURL: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    temperature: data.temp.day,
    humidity: data.humidity,
  };
};

//this function will be executed on form submit
const onSubmit = async (event) => {
  event.preventDefault();

  //gets the value of input and stores it in a variable
  const cityName = $("#city-input").val();
  const cities = getFromLocalStorage();

  //this pushes user city input into array
  cities.push(cityName);

  //this saves array into local storage
  localStorage.setItem("cities", JSON.stringify(cities));

  renderCitiesFromLocalStorage();

  //this clears the text from input after submitting
  $("#city-input").val("");

  renderAllCards(cityName);
};

const renderAllCards = async (cityName) => {
  const currentDayUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${API_KEY}`;

  const currentDayResponse = await fetchData(currentDayUrl);

  const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentDayResponse.coord.lat}&lon=${currentDayResponse.coord.lon}&exclude=minutely,hourly&units=metric&appid=${API_KEY}`;

  const forecastResponse = await fetchData(forecastUrl);

  const cardsData = forecastResponse.daily.map(transformForecastData);

  $("#forecast-cards-container").empty();

  //this gets the forecast data starting with the following day to the day the search was made on
  cardsData.slice(1, 6).forEach(renderForecastCard);

  const currentDayData = transformCurrentDayData(
    forecastResponse,
    currentDayResponse.name
  );

  renderCurrentDayCard(currentDayData);
};

const renderCitiesFromLocalStorage = () => {
  // this empties the list before appending the new, updated list
  $("#searched-cities").empty();

  //this gets cities from local storage
  const cities = getFromLocalStorage();

  //creates ul
  const ul = $("<ul>").addClass("list-group");

  //for each city in local storage create li and append to target ul
  const appendListItemToUl = (city) => {
    const li = $("<li>")
      .addClass("list-group-item")
      .text(city)
      .attr("data-city", city);
    ul.append(li);
  };

  //creates list item for each city stored in local storage and appends it
  cities.forEach(appendListItemToUl);

  ul.on("click", getDataByCityName);

  $("#searched-cities").append(ul);
};

//this will set the uv index background color based on the uv index value. green for normal levels, yellow for medium levels and red for dangerous levels
const getUvIndexClass = (uvIndex) => {
  if (uvIndex <= 3) {
    return "p-2 bg-success text-white";
  } else if (uvIndex >= 3 && uvIndex <= 7) {
    return "p-2 bg-warning text-white";
  } else {
    return "p-2 bg-danger text-white";
  }
};

const renderCurrentDayCard = (data) => {
  // this will make sure that the current day container in empty before appending a the city searched by user
  $("#current-day").empty();

  //creates card with data from api
  const card = `<div class="card my-2">
  <div class="card-body">
    <h2>
    ${data.cityName} ${data.date}<img src="${data.iconURL}" />
    </h2>
    <div class="py-2">Temperature: ${data.temperature} &deg;F</div>
    <div class="py-2">Humidity: ${data.humidity}%</div>
    <div class="py-2">Wind Speed: ${data.windSpeed} MPH</div>
    <div class="py-2">UV Index: <span class="${getUvIndexClass(data.uvi)}">${
    data.uvi
  }</span></div>
  </div>
</div>`;

  //appends card to the card-container div
  $("#current-day").append(card);
};

const renderForecastCard = (data) => {
  const card = `<div class="card mh-100 bg-primary text-light rounded card-block">
    <h5 class="card-title p-1">${data.date}</h5>
    <img src="${data.iconURL}" />
    <h6 class="card-subtitle mb-2 text-light p-md-2">
      Temperature: ${data.temperature}&deg; C
    </h6>
    <h6 class="card-subtitle mb-2 text-light p-md-2">
      Humidity: ${data.humidity}%
    </h6>
  </div>`;

  $("#forecast-cards-container").append(card);
};

//the code inside this function will run when app is loaded
const onReady = () => {
  renderCitiesFromLocalStorage();
};

$("#search-by-city-form").on("submit", onSubmit);

$(document).ready(onReady);
