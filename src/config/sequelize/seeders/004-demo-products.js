'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [
      {
        name: 'Laptop Gaming',
        description: 'Laptop para gaming de alta gama',
        price: 1200.0,
        image: 'laptop-gaming.jpg',
        categoryId: 1,
        stock: 15,
        availability: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Mouse Inalámbrico',
        description: 'Mouse ergonómico inalámbrico',
        price: 45.0,
        image: 'mouse-wireless.jpg',
        categoryId: 1,
        stock: 50,
        availability: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Teclado Mecánico',
        description: 'Teclado mecánico RGB',
        price: 89.99,
        image: 'keyboard-mechanical.jpg',
        categoryId: 1,
        stock: 0,
        availability: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Monitor 4K',
        description: 'Monitor 27 pulgadas 4K',
        price: 350.0,
        image: 'monitor-4k.jpg',
        categoryId: 1,
        stock: 8,
        availability: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Auriculares Gaming',
        description: 'Auriculares con micrófono incorporado',
        price: 75.0,
        image: 'headphones-gaming.jpg',
        categoryId: 1,
        stock: 3,
        availability: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  },
};