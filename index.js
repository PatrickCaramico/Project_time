const apiKey = '';
const locbutton = document.querySelector('.loc-button');
const todayInfo = document.querySelector('.today-info');
const todayWeatherIcon = document.querySelector('.today-weather i');
const todayTemp = document.querySelector('.weather-temp');
const daysList = document.querySelector('.days-list');
const locationSpan = document.querySelector('#location'); // Elemento <span> que exibe a localização

const weatherIconMap = {
  '01d': 'sun',
  '01n': 'moon',
  '02d': 'sun',
  '02n': 'moon',
  '03d': 'cloud',
  '03n': 'cloud',
  '04d': 'cloud',
  '04n': 'cloud',
  '09d': 'cloud-rain',
  '09n': 'cloud-rain',
  '10d': 'cloud-rain',
  '10n': 'cloud-rain',
  '11d': 'cloud-lightning',
  '11n': 'cloud-lightning',
  '13d': 'cloud-snow',
  '13n': 'cloud-snow',
  '50d': 'water',
  '50n': 'water',
};

// Função para obter a sigla do país
async function getCountryCode(location) {
  const geonamesUsername = 'patrickcaramico'; // Substitua pelo seu nome de usuário Geonames
  const geonamesEndpoint = `http://api.geonames.org/searchJSON?q=${location}&maxRows=1&username=${geonamesUsername}`;
  
  try {
    const response = await fetch(geonamesEndpoint);
    const data = await response.json();
    
    if (data && data.geonames && data.geonames[0]) {
      return data.geonames[0].countryCode;
    } else {
      return '';
    }
  } catch (error) {
    console.error(error);
    return '';
  }
}

// Atualiza a exibição com a localização e a sigla do país
async function updateLocation(location) {
  const countryCode = await getCountryCode(location);
  const locationWithCountry = countryCode ? `${location}, ${countryCode}` : location;
  locationSpan.textContent = locationWithCountry;
}

// Atualiza a exibição com os dados de clima
function updateWeatherInfo(data) {
  if (data.weather && data.weather.length > 0) {
    const todayWeather = data.weather[0].description;
    const todayTemperature = `${Math.round(data.main.temp - 273.15)}°C`; // Convert Kelvin to Celsius
    const todayWeatherIconCode = data.weather[0].icon;

    todayInfo.querySelector('h2').textContent = new Date().toLocaleDateString('en', { weekday: 'long' });
    todayInfo.querySelector('span').textContent = new Date().toLocaleDateString('en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode]}`;
    todayTemp.textContent = todayTemperature;
  } else {
    alert('Dados de clima não encontrados ou vazios.');
  }
}

// Função para buscar dados de clima
function fetchWeatherData(location) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      updateLocation(location); // Atualiza a localização
      updateWeatherInfo(data); // Atualiza a exibição com os dados de clima
    })
    .catch(error => {
      alert(`Erro ao buscar dados de clima: ${error} (Erro da API)`);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const defaultLocation = 'Paris'; // Exemplo de localização padrão
  fetchWeatherData(defaultLocation);
});

locbutton.addEventListener('click', () => {
  const location = prompt('Digite uma localização:');
  if (location) {
    fetchWeatherData(location);
  }
});
