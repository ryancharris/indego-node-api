var express = require('express');
var router = express.Router();
var request = require('request');
var _ = require('lodash');
var stations;

router.get('/', function(req, res) {
  // Parse query string
  var at = req.query.at;

  // Make request to Indego GeoJSON API
  fetchStationData(returnRes);

  // Send server response as JSON
  res.json({
    at,
    stations
  });
});

router.get('/:kioskId', function(req, res) {
  // Parse query string and create object from params
  var queryStringArray = _.toPairs(req.query);
  var queryString = _.head(queryStringArray).join("=");
  var querySplit = _.split(queryString, ',');
  var arrays = querySplit.map(function(element) {
    return element.split('=');
  });

  var query = _.fromPairs(arrays);
  var kioskId = req.params.kioskId;

  // Send server response as JSON
  res.json({
    kioskId,
    query
  });
});

//
// HELPER FUNCTIONS
//

function fetchStationData(callback) {
  request('https://www.rideindego.com/stations/json/', function(err, res, body) {
    stations = JSON.parse(body);
    callback();
  });
}

function returnRes() {
  console.log(stations);
}

module.exports = router;