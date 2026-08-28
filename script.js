// ==========================================
// ALGO PASA - SCRIPT PRINCIPAL
// ==========================================


// ------------------------------------------
// FECHA Y HORA
// ------------------------------------------

function updateClock() {
  const now = new Date();

  const dateFormatter = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const dateElement = document.getElementById('today');
  const clockElement = document.getElementById('clock');

  if (dateElement) {
    dateElement.textContent = dateFormatter.format(now);
  }

  if (clockElement) {
    clockElement.textContent = now.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}

updateClock();
setInterval(updateClock, 1000);


// ------------------------------------------
// MENÚ MOBILE
// ------------------------------------------

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}


// ------------------------------------------
// BÚSQUEDA
// ------------------------------------------

const searchButton = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');

if (searchButton && searchInput) {
  searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();

    if (!query) {
      alert('Escribí algo para buscar.');
      return;
    }

    alert(
      'La búsqueda de "' +
      query +
      '" estará conectada a las noticias de ALGO PASA.'
    );
  });

  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      searchButton.click();
    }
  });
}


// ------------------------------------------
// CLIMA REAL - PRESIDENCIA ROCA, CHACO
// ------------------------------------------

const WEATHER_LAT = -26.1406;
const WEATHER_LON = -59.3097;

async function loadWeather() {

  // Elemento de la barra superior
  const weatherTop = document.getElementById('weather');

  // Elementos reales que existen en tu index.html
  const weatherPanel = document.querySelector('.weather-panel');
  const weatherBig = document.querySelector('.weather-big');
  const weatherDescription = weatherPanel
    ? weatherPanel.querySelector('p')
    : null;

  const weatherStats = document.querySelector('.weather-stats');

  try {

    const url =
      'https://api.open-meteo.com/v1/forecast' +
      '?latitude=' + WEATHER_LAT +
      '&longitude=' + WEATHER_LON +
      '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code' +
      '&daily=temperature_2m_max,temperature_2m_min' +
      '&timezone=America%2FArgentina%2FBuenos_Aires' +
      '&forecast_days=1';

    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(
        'Open-Meteo respondió con código ' + response.status
      );
    }

    const data = await response.json();

    if (!data.current || !data.daily) {
      throw new Error('Respuesta meteorológica incompleta');
    }

    // --------------------------------------
    // DATOS ACTUALES
    // --------------------------------------

    const currentTemp = Math.round(
      data.current.temperature_2m
    );

    const currentHumidity = Math.round(
      data.current.relative_humidity_2m
    );

    const currentWind = Math.round(
      data.current.wind_speed_10m
    );

    const maxTemp = Math.round(
      data.daily.temperature_2m_max[0]
    );

    const minTemp = Math.round(
      data.daily.temperature_2m_min[0]
    );

    const weatherCode = data.current.weather_code;

    const weatherInfo = getWeatherInfo(weatherCode);


    // --------------------------------------
    // BARRA SUPERIOR
    // --------------------------------------

    if (weatherTop) {
      weatherTop.textContent =
        weatherInfo.icon +
        ' ' +
        currentTemp +
        '°C · ' +
        weatherInfo.description;
    }


    // --------------------------------------
    // PANEL GRANDE DEL CLIMA
    // --------------------------------------

    if (weatherBig) {

      weatherBig.innerHTML =
        '<span class="weather-icon">' +
        weatherInfo.icon +
        '</span> ' +
        '<strong>' +
        currentTemp +
        '°C' +
        '</strong>';
    }


    // --------------------------------------
    // DESCRIPCIÓN
    // --------------------------------------

    if (weatherDescription) {

      weatherDescription.textContent =
        'Presidencia Roca, Chaco · ' +
        weatherInfo.description;
    }


    // --------------------------------------
    // MÁXIMA, MÍNIMA, HUMEDAD Y VIENTO
    // --------------------------------------

    if (weatherStats) {

      const spans = weatherStats.querySelectorAll('span');

      if (spans.length >= 4) {

        spans[0].innerHTML =
          'Máx. <b>' +
          maxTemp +
          '°C</b>';

        spans[1].innerHTML =
          'Mín. <b>' +
          minTemp +
          '°C</b>';

        spans[2].innerHTML =
          'Humedad <b>' +
          currentHumidity +
          '%</b>';

        spans[3].innerHTML =
          'Viento <b>' +
          currentWind +
          ' km/h</b>';
      }
    }


    // --------------------------------------
    // GUARDAR ÚLTIMA ACTUALIZACIÓN
    // --------------------------------------

    console.log(
      'Clima actualizado:',
      currentTemp + '°C',
      weatherInfo.description,
      '| Máx.',
      maxTemp + '°C',
      '| Mín.',
      minTemp + '°C',
      '| Humedad',
      currentHumidity + '%',
      '| Viento',
      currentWind + ' km/h'
    );

  } catch (error) {

    console.error(
      'Error al cargar el clima:',
      error
    );


    // --------------------------------------
    // SI FALLA EL SERVICIO
    // --------------------------------------

    if (weatherTop) {
      weatherTop.textContent =
        '🌤️ Clima no disponible';
    }

    if (weatherDescription) {
      weatherDescription.textContent =
        'Presidencia Roca, Chaco · Clima no disponible';
    }
  }
}


// ------------------------------------------
// INTERPRETACIÓN DEL CÓDIGO METEOROLÓGICO
// ------------------------------------------

function getWeatherInfo(code) {

  switch (code) {

    case 0:
      return {
        icon: '☀️',
        description: 'Despejado'
      };

    case 1:
      return {
        icon: '🌤️',
        description: 'Principalmente despejado'
      };

    case 2:
      return {
        icon: '⛅',
        description: 'Parcialmente nublado'
      };

    case 3:
      return {
        icon: '☁️',
        description: 'Nublado'
      };

    case 45:
    case 48:
      return {
        icon: '🌫️',
        description: 'Niebla'
      };

    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return {
        icon: '🌦️',
        description: 'Llovizna'
      };

    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return {
        icon: '🌧️',
        description: 'Lluvia'
      };

    case 71:
    case 73:
    case 75:
    case 77:
      return {
        icon: '🌨️',
        description: 'Nieve'
      };

    case 80:
    case 81:
    case 82:
      return {
        icon: '🌦️',
        description: 'Chaparrones'
      };

    case 95:
    case 96:
    case 99:
      return {
        icon: '⛈️',
        description: 'Tormenta'
      };

    default:
      return {
        icon: '🌤️',
        description: 'Condiciones actuales'
      };
  }
}


// ------------------------------------------
// CARGAR CLIMA AL ABRIR
// ------------------------------------------

loadWeather();


// ------------------------------------------
// ACTUALIZAR CADA 10 MINUTOS
// ------------------------------------------

setInterval(
  loadWeather,
  10 * 60 * 1000
);