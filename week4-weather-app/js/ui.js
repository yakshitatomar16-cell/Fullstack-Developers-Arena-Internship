function displayWeather(city, data) {

  document.getElementById("cityName").innerText = city;

  document.getElementById("temperature").innerText =
    currentUnit === "C"
      ? data.temp + "°C"
      : celsiusToFahrenheit(data.temp) + "°F";

  document.getElementById("condition").innerText = data.condition;

  document.getElementById("humidity").innerText =
    "Humidity : " + data.humidity + "%";

  document.getElementById("wind").innerText =
    "Wind : " + data.wind + " km/h";

  let forecast = document.getElementById("forecast");

  forecast.innerHTML = "";

  data.forecast.forEach(item => {

    forecast.innerHTML += `
        <div class="day">
            <h3>${item.day}</h3>
            <p>${
              currentUnit === "C"
                ? item.temp + "°C"
                : celsiusToFahrenheit(item.temp) + "°F"
            }</p>
        </div>
    `;

  });

}

function displayFavorites() {

  let favorites = getFavorites();

  let container = document.getElementById("favorites");

  container.innerHTML = "";

  favorites.forEach(city => {

    container.innerHTML +=
      `<button class="city-btn" onclick="searchCity('${city}')">
      ${city}
      </button>`;

  });

}