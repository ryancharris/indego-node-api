// NPM packages
var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');
var _ = require('lodash');

// Config variables
var config = require('../config/config');
var WEATHER_API_KEY = config.weatherKey();

// Global Variables
var stations;
var weather;
var kioskId;
var singleStationData;

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
  var stationArray = stationsData['features'];

  var filteredData = stationArray.filter(function(station) {
    if (station.properties.kioskId === kioskId) {
      return station;
    }
  });

  stations = filteredData;
}

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