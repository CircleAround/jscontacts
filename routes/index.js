const express = require('express');
const router = express.Router();
const models = require('../models');
const { ValidationError } = require('sequelize');

router.get('/', async function(req, res, next) {
  req.session.view_counter = (req.session.view_counter || 0) + 1;
  const flashMessage = req.session.flashMessage;
  delete req.session.flashMessage;

  const now = new Date();
  const contacts = await models.Contact.findAll({include: 'category'});
  const categories = await models.Category.findAll();
  res.render('index', { 
    title: '連絡帳', 
    now, 
    contacts, 
    categories,
    view_counter: req.session.view_counter, 
    flashMessage 
  });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About' });
});

router.get('/contact_form', async function(req, res, next) {
  const categories = await models.Category.findAll();
  res.render('contact_form', { title: '連絡先の作成', contact: {}, categories });
});

router.get('/contacts/:id/edit', async function(req, res, next) {
  const contact = await models.Contact.findByPk(req.params.id);
  const categories = await models.Category.findAll();
  res.render('contact_form', { title: '連絡先の更新', contact: contact, categories });
});

router.post('/contacts', async function(req, res, next) {
  const fields = ['name', 'email', 'categoryId'];
  try {
    console.log('posted', req.body);
    if(req.body.id) {
      const contact = await models.Contact.findByPk(req.body.id);
      contact.set(req.body);
      await contact.save({ fields });
      req.session.flashMessage = `「${contact.name}」さんを更新しました`;
    } else {
      const contact = models.Contact.build(req.body);
      await contact.save({ fields });
      req.session.flashMessage = `新しい連絡先として「${contact.name}」さんを保存しました`;
    }
    res.redirect('/');
  } catch (err) {
    if(err instanceof ValidationError) {
      const title = (req.body.id) ? '連絡先の更新' : '連絡先の作成';
      res.render(`contact_form`, { title, contact: req.body, err: err });
    } else {
      throw err;
    }
  }
});

router.post('/contacts/:id/delete', async function(req, res, next) {
  console.log(req.params);
  const contact = await models.Contact.findByPk(req.params.id);
  await contact.destroy();
  req.session.flashMessage = `「${contact.name}」さんを削除しました`;
  res.redirect('/');
});

router.get('/categories/:id', async function(req, res, next) {
  const category = await models.Category.findByPk(req.params.id);
  const contacts = await category.getContacts({ include: 'category' });
  res.render('category', { title: `カテゴリ ${category.name}`, category, contacts });
});

module.exports = router;
