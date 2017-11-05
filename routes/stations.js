// NPM packages
var express = require('express');
var router = express.Router();
var request = require('request');
var _ = require('lodash');

// Config variables
var config = require('../config/config');
var WEATHER_API_KEY = config.weatherKey();

// Global Variables
var stations;
var weather;

router.get('/', function(req, res) {
  // Parse query string
  var at = req.query.at;

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
  var at = parseQueryParams(req.query);

  // Parse query params
  var kioskId = req.params.kioskId;

  // Fetch weather data
  fetchWeatherData(returnWeatherData);

  // Send server response as JSON
  res.json({
    at,
    weather
  });
});

//
// HELPER FUNCTIONS
//

function parseQueryParams(query) {
  var queryStringArray = _.toPairs(query);
  var queryString = _.head(queryStringArray).join("=");
  var querySplit = _.split(queryString, ',');
  var arrays = querySplit.map(function(element) {
    return element.split('=');
  });
  var query = _.fromPairs(arrays);
  return query.at;
}

function fetchStationData(callback) {
  request('https://www.rideindego.com/stations/json/', function(err, res, body) {
    stations = JSON.parse(body);
    callback();
  });
}

function returnStationData() {
  console.info(stations);
}

function fetchWeatherData(callback) {
  request(`https://api.openweathermap.org/data/2.5/weather?id=4560349&APPID=${WEATHER_API_KEY}`, function(err, res, body) {
    weather = JSON.parse(body);
    callback();
  });
}

function returnWeatherData() {
  console.info(weather);
}

module.exports = router;