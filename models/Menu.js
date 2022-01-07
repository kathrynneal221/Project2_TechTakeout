const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class Menu extends Model {}

Menu.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

        cart_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        
        category_code: {
            type: DataTypes.CHAR(1),
            allowNull: false
        },

        dish_name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        dish_description: {
            type: DataTypes.STRING,
            allowNull: false
        },

        price: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            validate: {
                isDecimal: true
            }
        },

        image_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        restaurant_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "restaurant",
                key: "id"
            }
        }
    },

    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'menu',
    }
);

module.exports = Menu;