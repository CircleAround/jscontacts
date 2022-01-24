const models = require('../models');
async function createCategory(){
  const contact = models.Category.build({ name: 'test'});
  await contact.save();
}
createCategory();
