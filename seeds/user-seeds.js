const { User } = require('../models');

const userData = [{
        // username: 'user1',
        email: 'user1@gmail.com',
        password: 'pw123'
    },
    {
        // username: 'user2',
        email: 'user2@gmail.com',
        password: 'pw234'
    },
    {
        // username: 'user3',
        email: 'user3@gmail.com',
        password: 'pw345'
    },
    {
        // username: 'test2',
        email: 'test1@gmail.com',
        password: 'pw123'
    },
    {
        username: 'canterad',
        email: 'email',
        password: 'password'
    }    
]

const seedUsers = () => User.bulkCreate(userData);
module.exports = seedUsers;