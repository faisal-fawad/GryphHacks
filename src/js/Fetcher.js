const fetch = require('node-fetch');
const { DateTime } = require('luxon');
const fs = require('fs');

const oneMonthUnix = 2600000;
const currentTime = Math.floor(Date.now() / 1000);

const elements = 'temp,windspeed,solarenergy,sunset,sunrise';
const API_KEY = 'HBDJQZ469RYVBHQ6DXMSCYCM6'; // Replace with your API key
const cities = [
  'Guelph, Ontario',
  'New York City, New York',
  'Sydney, Australia',
  'London, United Kingdom',
  'Paris, France',
  'Istanbul, Turkey',
  'Barcelona, Spain',
  'Amsterdam, Netherlands',
  'Rome, Italy',
  'Tokyo, Japan',
  'Bangkok, Thailand'
];

const rawWeatherData = {};
const weatherData = {};

async function fetchData(city, month) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${currentTime - (month * oneMonthUnix)}?key=${API_KEY}&include=days&elements=${elements}`;
  console.log(`[GET] ${url}`);

  const response = await fetch(url);
  const data = await response.json();

  const temp = data.days[0].temp;
  const windspeed = data.days[0].windspeed;
  const sunrise = DateTime.fromFormat(data.days[0].sunrise, 'H:mm:ss').toISO();
  const sunset = DateTime.fromFormat(data.days[0].sunset, 'H:mm:ss').toISO();
  const sunTime = DateTime.fromFormat(data.days[0].sunset, 'H:mm:ss').diff(DateTime.fromFormat(data.days[0].sunrise, 'H:mm:ss')).as('seconds');

  return {
    temp,
    windspeed,
    sunrise,
    sunset,
    sunTime
  };
}

async function fetchWeatherData() {
  for (const city of cities) {
    const temps = [];
    const windSpeeds = [];
    const sunriseTimes = [];
    const sunsetTimes = [];
    const sunTimes = [];

    for (let month = 0; month < 12; month++) {
      const weather = await fetchData(city, month);
      temps.push(weather.temp);
      windSpeeds.push(weather.windspeed);
      sunriseTimes.push(weather.sunrise);
      sunsetTimes.push(weather.sunset);
      sunTimes.push(weather.sunTime);
    }

    rawWeatherData[city] = {
      temp: temps,
      windspeed: windSpeeds,
      sunrise: sunriseTimes,
      sunset: sunsetTimes,
      sun_time: sunTimes
    };

    weatherData[city] = {
      temp: temps.reduce((a, b) => a + b, 0) / temps.length,
      windspeed: windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length,
      sun_time: sunTimes.reduce((a, b) => a + b, 0) / sunTimes.length
    };
  }

  const weatherDataJson = JSON.stringify(weatherData, null, 4);
  fs.writeFileSync('../json/weather_data.json', weatherDataJson);

  const rawWeatherDataJson = JSON.stringify(rawWeatherData, null, 4);
  fs.writeFileSync('../json/weather_data_raw.json', rawWeatherDataJson);
}

fetchWeatherData();