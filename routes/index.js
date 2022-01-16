const express = require('express');
const router = express.Router();
const models = require('../models');

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

router.post('/contacts', async function(req, res, next) {
  console.log('posted', req.body);
  const contact = models.Contact.build({ name: req.body.name, email: req.body.email });
  await contact.save();
  res.redirect('/');
});

module.exports = router;
