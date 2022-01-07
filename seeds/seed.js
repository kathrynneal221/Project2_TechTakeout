const seedRestaurant = require('./restaurant-seeds');
const seedMenu = require('./menu-seeds');
const seedCart = require('./cart-seeds');
const { User } = require('../models');

const userData = require('./userData.json');

const sequelize = require('../config/connection');

const seedAll = async () => {
    await sequelize.sync({ force: true });
    console.log('\n----- DATABASE SYNCED -----\n');

    await User.bulkCreate(userData, {
      individualHooks: true,
      returning: true,
    });

    await seedRestaurant();
    console.log('\n----- RESTAURANT SEEDED -----\n');

    await seedCart();
    console.log('\n----- CART SEEDED -----\n');

    await seedMenu();
    console.log('\n----- MENU SEEDED -----\n');

    process.exit(0);
};

seedAll();