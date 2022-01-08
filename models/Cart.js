const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Cart extends Model {}

Cart.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id",
            },            
        },

        restaurant_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "restaurant",
                key: "id",
            },                        
        },  
        
        datecreated: {
            type: DataTypes.STRING,
            allowNull: false,
        },         

        total_price: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0,
            allowNull: false,
            validate: {
                isDecimal: true,
            }
        },
        
        pickup: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },

        delivery: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },        
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'cart',
    }
);

module.exports = Cart;