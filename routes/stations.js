var express = require('express');
var router = express.Router();
var _ = require('lodash');
var axios = require('axios');

router.get('/', function(req, res) {
  // Parse query string
  var at = req.query.at;

  // Make request to Indego GeoJSON API
  axios.get('https://www.rideindego.com/stations/json/')
    .then(function(response) {
      console.log(response.data);
    })
    .catch(function(errors) {
      console.log(error);
    });

  // Send server response as JSON
  res.json({
    at,
    response
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

module.exports = router;