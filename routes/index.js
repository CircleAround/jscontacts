const express = require('express');
const router = express.Router();
const models = require('../models');
const { ValidationError } = require('sequelize');

router.get('/', async function(req, res, next) {
  req.session.view_counter = (req.session.view_counter || 0) + 1;

  const now = new Date();
  const contacts = await models.Contact.findAll();
  res.render('index', { title: '連絡帳', now, contacts, view_counter: req.session.view_counter });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About' });
});

router.get('/contact_form', function(req, res, next) {
  res.render('contact_form', { title: '連絡先フォーム', contact: {} });
});

router.post('/contacts', async function(req, res, next) {
  try {
    console.log('posted', req.body);
    const contact = models.Contact.build({ name: req.body.name, email: req.body.email });
    await contact.save();
    res.redirect('/');
  } catch (err) {
    if(err instanceof ValidationError) {
      res.render(`contact_form`, { title: '連絡先フォーム', contact: req.body, err: err });
    } else {
      throw err;
    }
  }
});

module.exports = router;
