function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveLastCity(city) {
  localStorage.setItem("lastCity", city);
}

function getLastCity() {
  return localStorage.getItem("lastCity");
}