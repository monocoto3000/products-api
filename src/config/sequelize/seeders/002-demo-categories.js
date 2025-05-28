'use strict';
const { v4: uuidv4 } = require('uuid');

const electronicsId = '11111111-1111-1111-1111-111111111111';
const booksId = '22222222-2222-2222-2222-222222222222';
const clothingId = '33333333-3333-3333-3333-333333333333';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      {
        id: electronicsId,
        name: 'Electronics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: booksId,
        name: 'Books',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: clothingId,
        name: 'Clothing',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  },
};

module.exports.categoryIds = {
  electronicsId,
  booksId,
  clothingId,
};
