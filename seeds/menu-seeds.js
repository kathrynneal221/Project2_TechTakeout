const { Menu } = require('../models');

const menuData = [
    {
        dish_name: 'Spinach Artichoke Dip',
        dish_description: 'Cheesy spinach artichoke dip with pita chips',
        price: 9.99,
        image_url: '/assets/img/app1.jpeg',
        restaurant_id: 1,
        cart_id: 0,
        category_code: 'E',
    },
    {
        dish_name: 'Grilled Mac and Cheese Sandwich',
        dish_description: 'Creamy Mac & Cheese with our fontina and mozzarella cheese blend and parmesan crisps on toasted thick-sliced Classic White Miche.',
        price: 10.99,
        image_url: '/assets/img/app2.jpeg',
        restaurant_id: 1,
        cart_id: 0,
        category_code: 'E',        
    },
    {
        dish_name: 'Green Goddess Cobb Salad with Chicken',
        dish_description: 'Chicken, arugula, romaine, baby kale and red leaf blend, grape tomatoes and pickled red onions with a Green Goddess dressing.',
        price: 11.59,
        image_url: '/assets/img/app3.jpg',
        restaurant_id: 1,
        cart_id: 0,
        category_code: 'E',        
    },
    {
        dish_name: 'Homestyle Chicken Noodle Soup',
        dish_description: 'Tender pieces of white-meat chicken simmered in a rich, perfectly seasoned homestyle chicken bone broth with curly egg noodles, sliced carrots, celery and herbs.',
        price: 6.79,
        image_url: '/assets/img/entree1.jpg',
        restaurant_id: 1,
        cart_id: 0,
        category_code: 'S',        
    },
    {
        dish_name: 'Broccoli Cheddar Soup',
        dish_description: 'Chopped broccoli, shredded carrots and select seasonings simmered in a velvety smooth cheese sauce.',
        price: 6.79,
        image_url: '/assets/img/entree2.jpg',
        restaurant_id: 1,
        cart_id: 0,
        category_code: 'S',        
    },
    {
        dish_name: 'Creamy Tomato',
        dish_description: 'Vine-ripened pear tomatoes pureed with fresh cream for a velvety smooth flavor accented by hints of red pepper and oregano and topped with black pepper focaccia croutons.',
        price: 6.79,
        image_url: '/assets/img/entree3.jpg',
        restaurant_id: 1,
        cart_id: 0,
        category_code: 'S',        
    },
    {
        dish_name: 'Chocolate Chip Cookie',
        dish_description: 'A chewy oatmeal raisin cookie with sweetened, dried cranberries and infused, dried strawberries and blueberries.',
        price: 2.49,
        image_url: '/assets/img/dessert1.jpg',
        restaurant_id: 1,
        cart_id: 0,
        category_code: 'D',        
    },
    {
        dish_name: 'Oatmeal Raisin with Berries Cookie',
        dish_description: 'Oven-roasted turkey breast raised without antibiotics, emerald greens, vine-ripened tomatoes, red onions, mayo, spicy mustard, salt and pepper on Country Rustic Sourdough.',
        price: 2.49,
        image_url: '/assets/img/dessert2.jpg',
        restaurant_id: 1,
        cart_id: 0,
        category_code: 'D',        
    },
    {
        dish_name: 'Brownie',
        dish_description: 'Rich, fudgy soft chocolate brownie dusted with powdered sugar.',
        price: 2.99,
        image_url: '/assets/img/dessert3.jpg',
        restaurant_id: 1,
        cart_id: 0,
        category_code: 'D',        
    },
];

const seedMenu = () => Menu.bulkCreate(menuData);

module.exports = seedMenu;