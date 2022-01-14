var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const now = new Date();
  res.render('index', { title: 'Hello World', now: now });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About' });
});

router.get('/contact_form', function(req, res, next) {
  res.render('contact_form', { title: '連絡先フォーム' });
});

router.post('/contacts', function(req, res, next) {
  console.log('posted', req.body);
  res.redirect('/');
});

module.exports = router;
