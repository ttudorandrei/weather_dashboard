//this function gets the city names from local storage
const getFromLocalStorage = () => {
  const localStorageData = JSON.parse(localStorage.getItem("cities"));

  if (localStorageData === null) {
    return [];
  } else {
    return localStorageData;
  }
};

//this function retrieves data from input box
const onSubmit = (event) => {
  event.preventDefault();

  const cityName = $("#city-input").val();
  const cities = getFromLocalStorage();

  //this pushes user city input into array
  cities.push(cityName);

  //this saves array into local storage
  localStorage.setItem("cities", JSON.stringify(cities));
  console.log(cities);
};

$("#search-by-city-form").on("submit", onSubmit);
