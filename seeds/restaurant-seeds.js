const { Restaurant } = require('../models');

const restaurantData = [
    {
        restaurant_name: 'Panera Bread',
    }
];

const seedRestaurant = () => Restaurant.bulkCreate(restaurantData);

module.exports = seedRestaurant;