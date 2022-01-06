const router = require('express').Router();
const { Restaurant, Menu } = require('../models');

// GET all restaurants for homepage
router.get('/', async (req, res) => {
  try {
    const dbRestaurantData = await Restaurant.findAll({
    });

    const restaurants = dbRestaurantData.map((project) => project.get({ plain: true }));

    res.render('homepage', {
      restaurants,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Redirect users to homepage after logging in
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

// Render sign up page
router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
   }
  
  res.render('signup');
});


module.exports = router;
