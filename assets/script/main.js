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

const fetchData = (cityName) => {
  const functionForJSON = (responseObject) => {
    return responseObject.json();
  };
  const functionForApplication = (dataFromServer) => {
    console.log(dataFromServer);
  };
  const functionToHandleError = (errorObject) => {
    console.log(errorObject);
  };

  const oneApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;

  fetch(oneApiUrl)
    .then(functionForJSON)
    .then(functionForApplication)
    .catch(functionToHandleError);
};

//this will retrieve the city name based on which list item is clicked
const getDataByCityName = (event) => {
  const target = $(event.target);

  if (target.is("li")) {
    const cityName = target.data("city");
    fetchData(cityName);
  }
};

//this function will be executed on form submit
const onSubmit = (event) => {
  event.preventDefault();

  const cityName = $("#city-input").val();
  const cities = getFromLocalStorage();

  //this pushes user city input into array
  cities.push(cityName);

  //this saves array into local storage
  localStorage.setItem("cities", JSON.stringify(cities));

  renderCitiesFromLocalStorage();

  //this clears the text from input after submitting
  $("#city-input").val("");

  fetchData(cityName);
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

const onReady = () => {
  renderCitiesFromLocalStorage();
};

$("#search-by-city-form").on("submit", onSubmit);

$(document).ready(onReady);
