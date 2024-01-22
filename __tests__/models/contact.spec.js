const model = require("../../models");
const Contact = model.Contact;

afterAll(async () => {
  await Contact.destroy({ truncate: true });
  await model.sequelize.close();
});

test("findAll", async () => {
  await Contact.bulkCreate([
    { name: "Jack Sparrow", email: "jack@example.com" },
    { name: "Davy Jones", email: "davy@example.com" },
  ]);

  const contacts = await Contact.findAll();
  expect(contacts.length).toBe(2);
});
