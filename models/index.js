const User = require('./User');
const Menu = require('./Menu');
const Restaurant = require('./Restaurant');
const Cart = require('./Cart');

Menu.belongsTo(Restaurant, {
    foreignKey: 'restaurant_id'
});

Restaurant.hasMany(Menu, {
    foreignKey: 'restaurant_id'
});


Cart.belongsTo(User, {
    foreignKey: 'user_id'
});

User.hasMany(Cart, {
    foreignKey: 'user_id'
});

module.exports = { 
    User,
    Restaurant,
    Menu, 
    Cart,
};

