var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const now = new Date();
  res.render('index', { title: 'Hello World', now: now });
});

module.exports = router;
