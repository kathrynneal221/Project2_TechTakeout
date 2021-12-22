const User = require('./User');
const Menu = require('./Menu');
const Restaurant = require('./Restaurant');

Menu.belongsTo(Restaurant, {
    foreignKey: 'restaurant_id'
});


Restaurant.hasMany(Menu, {
    foreignKey: 'restaurant_id'
});

module.exports = { 
    User,
    Restaurant,
    Menu, 
};

