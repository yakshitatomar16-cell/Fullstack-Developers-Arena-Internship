let currentUnit = "C";

displayFavorites();

let last = getLastCity();

if (last) {
  searchCity(last);
} else {
  searchCity("Delhi");
}

document
  .getElementById("searchBtn")
  .addEventListener("click", () => {

    let city =
      document.getElementById("cityInput").value;

    searchCity(city);

  });

function searchCity(city) {

  document
    .querySelector(".loading")
    .classList.remove("hidden");

  setTimeout(() => {

    let data = getWeather(city);

    document
      .querySelector(".loading")
      .classList.add("hidden");

    if (!data) {

      document
        .querySelector(".error")
        .classList.remove("hidden");

      return;
    }

    document
      .querySelector(".error")
      .classList.add("hidden");

    displayWeather(city, data);

    saveLastCity(city);

  }, 500);

}

document
  .getElementById("celsiusBtn")
  .addEventListener("click", () => {

    currentUnit = "C";

    let city =
      document.getElementById("cityName").innerText;

    searchCity(city);

    document
      .getElementById("celsiusBtn")
      .classList.add("active");

    document
      .getElementById("fahrenheitBtn")
      .classList.remove("active");

  });

document
  .getElementById("fahrenheitBtn")
  .addEventListener("click", () => {

    currentUnit = "F";

    let city =
      document.getElementById("cityName").innerText;

    searchCity(city);

    document
      .getElementById("fahrenheitBtn")
      .classList.add("active");

    document
      .getElementById("celsiusBtn")
      .classList.remove("active");

  });

document
  .getElementById("cityInput")
  .addEventListener("keypress", function(e){

    if(e.key==="Enter"){

      searchCity(this.value);

    }

});

document
  .getElementById("cityInput")
  .addEventListener("change",function(){

    let city=this.value;

    let favorites=getFavorites();

    if(city && !favorites.includes(city) && weatherData[city]){

      favorites.push(city);

      saveFavorites(favorites);

      displayFavorites();

    }

});