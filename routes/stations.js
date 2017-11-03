var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  var at = req.query.at;

  res.json({
    at
  });
});

router.get('/:kioskId', function(req, res) {
  var at = req.query.at;
  var kioskId = req.params.kioskId;

  res.json({
    at,
    kioskId
  });
});

module.exports = router;