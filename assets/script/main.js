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
const getDataByCityName = (event) => {
  const target = $(event.target);

  if (target.is("li")) {
    const cityName = target.data("city");
    fetchData(cityName);
  }
};

//this function will be executed on form submit
const onSubmit = async (event) => {
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

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;

  const data = await fetchData(url);

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

const onReady = () => {
  renderCitiesFromLocalStorage();
};

$("#search-by-city-form").on("submit", onSubmit);

$(document).ready(onReady);
