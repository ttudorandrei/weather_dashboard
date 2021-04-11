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

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;

    const data = await fetchData(url);

    const currentDayData = transformData(data);

    renderCurrentDayCard(currentDayData);
  }
};

//contains the data we want from the One Call API
const transformData = (data, name) => {
  const current = data.current;
  return {
    cityName: data.name,
    temperature: data.main.temp,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    date: moment.unix(data.dt).format("MM/DD/YYYY"),
    iconURL: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
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

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;

  const data = await fetchData(url);

  const currentDayData = transformData(data);

  renderCurrentDayCard(currentDayData);

  console.log(currentDayData);

  console.log(data);
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

const renderCurrentDayCard = (data) => {
  // this will make sure that the current day container in empty before appending a the city searched by user
  $("#current-day").empty();

  //creates card with data from api
  const card = `<div class="card my-2">
  <div class="card-body">
    <h2>
    ${data.cityName} ${data.date}<img src="${data.iconURL}" />
    </h2>
    <div class="py-2">Temperature: ${data.temperature} &deg; C</div>
    <div class="py-2">Humidity: ${data.humidity}%</div>
    <div class="py-2">Wind Speed: ${data.windSpeed} MPH</div>
    <div class="py-2">UV Index: <span class=""></span></div>
  </div>
</div>`;

  //appends card to the card-container div
  $("#current-day").append(card);
};

//the code inside this function will run when app is loaded
const onReady = () => {
  renderCitiesFromLocalStorage();
};

$("#search-by-city-form").on("submit", onSubmit);

$(document).ready(onReady);
