const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', async function(req, res, next) {
  const now = new Date();
  const contacts = await models.Contact.findAll();
  res.render('index', { title: '連絡帳', now: now, contacts: contacts });
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
