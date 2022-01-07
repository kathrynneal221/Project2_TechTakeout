const seedRestaurant = require('./restaurant-seeds');
const seedMenu = require('./menu-seeds');
const seedCart = require('./cart-seeds');
const seedUsers = require('./user-seeds');

const sequelize = require('../config/connection');

const seedAll = async () => {
    await sequelize.sync({ force: true });
    console.log('\n----- DATABASE SYNCED -----\n');

    await seedUsers();
    console.log('\n----- USERS SEEDED -----\n');
  
    await seedRestaurant();
    console.log('\n----- RESTAURANT SEEDED -----\n');

    await seedCart();
    console.log('\n----- CART SEEDED -----\n');

    await seedMenu();
    console.log('\n----- MENU SEEDED -----\n');

    process.exit(0);
};

seedAll();