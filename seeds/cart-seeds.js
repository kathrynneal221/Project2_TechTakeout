const { Cart } = require('../models');

const cartData = [
    {
        user_id: 1,
        restaurant_id: 1,
        total_price: 0.00,
        datecreated: new Date().toLocaleDateString(),
        pickup: false,
        delivery: false,
        system_datecreated: new Date(),
    },
    {
        user_id: 2,
        restaurant_id: 1,
        total_price: 0.00,
        datecreated: new Date().toLocaleDateString(),
        pickup: false,
        delivery: false,
        system_datecreated: new Date(),        
    },
    {
        user_id: 3,
        restaurant_id: 1,
        total_price: 0.00,
        datecreated: new Date().toLocaleDateString(),
        pickup: false,
        delivery: false,
        system_datecreated: new Date(),        
    },        
];

const seedCart = () => Cart.bulkCreate(cartData);

module.exports = seedCart;