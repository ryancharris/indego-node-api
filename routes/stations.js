var express = require('express');
var router = express.Router();
var _ = require('lodash');

router.get('/', function(req, res) {
  var query = req.query;

  res.json({
    query
  });
});

router.get('/:kioskId', function(req, res) {
  var query = req.query;

  var queryStringArray = _.toPairs(query);
  var queryString = _.head(queryStringArray).join("=");
  var querySplit = _.split(queryString, ',');

  var arrays = querySplit.map(function(element) {
    return element.split('=');
  });

  var query = _.fromPairs(arrays);

  console.log(query);

  var kioskId = req.params.kioskId;

  res.json({
    kioskId,
    query
  });
});

module.exports = router;