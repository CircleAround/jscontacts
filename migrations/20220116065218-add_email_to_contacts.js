'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Contacts',
      'email',
      Sequelize.STRING
    );    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Contacts',
      'email'
    );
  }
};
