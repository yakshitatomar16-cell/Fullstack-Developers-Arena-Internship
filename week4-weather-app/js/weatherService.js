function getWeather(city) {
  return weatherData[city] || null;
}

function celsiusToFahrenheit(temp) {
  return Math.round((temp * 9) / 5 + 32);
}