const models = require('../models');

async function listContacts(){
  const contacts = await models.Contact.findAll();
  // console.log(contacts);
  console.log(contacts.map((contact) => { return contact.name; }))
}

listContacts();