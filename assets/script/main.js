//this function gets the city names from local storage
const getFromLocalStorage = () => {
  const localStorageData = JSON.parse(localStorage.getItem("cities"));

  if (localStorageData === null) {
    return [];
  } else {
    return localStorageData;
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
    console.log(city);
    const li = `<li class="list-group-item">${city}</li>`;
    ul.append(li);
  };

  //creates list item for each city stored in local storage and appends it
  cities.forEach(appendListItemToUl);

  $("#searched-cities").append(ul);
};

const onReady = () => {
  renderCitiesFromLocalStorage();
};

$("#search-by-city-form").on("submit", onSubmit);
$(document).ready(onReady);
