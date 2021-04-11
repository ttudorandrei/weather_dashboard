const onSubmit = (event) => {
  event.preventDefault();
  const cityName = $("#city-input").val();
  console.log(cityName);
};

$("#search-by-city-form").on("submit", onSubmit);
