// NPM packages
const express = require('express');
const request = require('request');
const async = require('async');
const _ = require('lodash');

// Config variables
const config = require('../config/config');

// Instances
const router = express.Router();
const WEATHER_API_KEY = config.weatherKey();

// Global Variables
let stations;
let weather;
let kioskId;

router.get('/', function(req, res) {
  // Parse query string
  let at = req.query.at;

  // Make request to Indego GeoJSON API
  fetchStationData(returnStationData);

  // Fetch weather data
  fetchWeatherData(returnWeatherData);

  // Send server response as JSON
  res.json({
    at,
    stations,
    weather
  });
});

router.get('/:kioskId', function(req, res) {
  // Parse query string and create object from params
  let at = parseQueryParams(req.query);

  // Parse query params
  kioskId = parseInt(req.params.kioskId);

  // Make request to Indego GeoJSON API
  // fetchStationData(returnStationData);

  async.series([
    function(callback) {
      console.log('fetching station data');
      fetchStationData(returnStationData);
      callback(null);
    },
    function(callback) {
      console.log('fetch is over, now parse if needed')

      if (kioskId) {
        parseKioskData(stations);
      }

      callback(null);
    }
  ]);

  // Fetch weather data
  fetchWeatherData(returnWeatherData);

  // Send server response as JSON
  res.json({
    at,
    stations,
    weather
  });
});

//
// HELPER FUNCTIONS
//

function parseKioskData(stationsData) {
  const stationArray = stationsData.features;

  const filteredData = stationArray.filter(function(station) {
    if (station.properties.kioskId === kioskId) {
      return station;
    }
  });

  stations = filteredData;
}

function parseQueryParams(query) {
  const queryStringArray = _.toPairs(query);
  const queryString = _.head(queryStringArray).join('=');
  const querySplit = _.split(queryString, ',');
  const arrays = querySplit.map(function(element) {
    return element.split('=');
  });
  const queryInfo = _.fromPairs(arrays);
  return queryInfo.at;
}

function fetchStationData(callback) {
  request('https://www.rideindego.com/stations/json/', function(err, res, body) {
    callback(body);
  });
}

function fetchWeatherData(callback) {
  request(`https://api.openweathermap.org/data/2.5/weather?id=4560349&APPID=${WEATHER_API_KEY}`, function(err, res, body) {
    callback(body);
  });
}

function returnStationData(body) {
  console.log('setting stations');
  stations = JSON.parse(body);
}

function returnWeatherData(body) {
  console.log('setting weather data');
  weather = JSON.parse(body);
}

module.exports = router;