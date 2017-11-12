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

router.get('/', (req, res) => {
  // Parse query string
  const at = req.query.at !== 'undefined' ? req.query.at : '';
  let weatherData;
  let stationData;

  async.series({
    stations: (callback) => {
      // Request API data from Indeogo
      async.series([
        (callback) => {
          request('https://www.rideindego.com/stations/json/', (err, response, body) => {
            callback(null, body);
          });
        },
      ], (err, results) => {
        callback(null, JSON.parse(results));
      });
    },
    weather: (callback) => {
      // Request API data from OpenWeatherMap
      async.series([
        (callback) => {
          request(`https://api.openweathermap.org/data/2.5/weather?id=4560349&APPID=${WEATHER_API_KEY}`, (err, res, body) => {
            callback(null, body);
          });
        },
      ], (err, results) => {
        callback(null, JSON.parse(results));
      });
    },
  }, (err, results) => {
    async.series([
      (callback) => {
        // Assign results of API calls to variables
        weatherData = results.weather;
        stationData = results.stations;
        callback(null, results);
      },
    ], (error, assignmentResults) => {
      // Send server response as JSON
      res.json({
        at,
        stations: stationData,
        weather: weatherData,
      });
    });
  });
});

router.get('/:kioskId', (req, res) => {
  // Parse query string
  const at = req.query.at !== 'undefined' ? req.query.at : '';
  const to = req.query.to !== 'undefined' ? req.query.to : '';
  const from = req.query.from !== 'undefined' ? req.query.from : '';
  const frequency = req.query.frequency !== 'undefined' ? req.query.frequency : '';


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

  // TODO: Async this API call

  // Fetch weather data
  fetchWeatherData(returnWeatherData);

  // Send server response as JSON
  res.json({
    at,
    stations,
    weather,
  });
});

//
// HELPER FUNCTIONS
//

function parseKioskData(stationsData) {
  const stationArray = stationsData.features;

  const filteredData = stationArray.filter((station) => {
    if (station.properties.kioskId === kioskId) {
      return station;
    }
  });

  stations = filteredData;
}

function fetchStationData(callback) {
  request('https://www.rideindego.com/stations/json/', (err, res, body) => {
    callback(body);
  });
}

function fetchWeatherData(callback) {
  request(`https://api.openweathermap.org/data/2.5/weather?id=4560349&APPID=${WEATHER_API_KEY}`, (err, res, body) => {
    callback(body);
  });
}

function returnStationData(body) {
  stations = JSON.parse(body);
}

function returnWeatherData(body) {
  weather = JSON.parse(body);
}

module.exports = router;
