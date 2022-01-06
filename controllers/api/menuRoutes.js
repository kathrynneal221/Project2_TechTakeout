const router = require('express').Router();
const { Restaurant, Menu, User } = require('../../models');

// GET all menus for menu view.
router.get('/', async (req, res) => {
  try 
  {
    const dbMenuData = await Menu.findAll({

      // Testing if the cart_id value = 0 and restaurant_id = 1
      // Getting the default menu items for the restaurant not 
      // assigned to any cart.
      where: {
          cart_id: 0,
          restaurant_id: 1
      }
    });

    const menus = dbMenuData.map((project) => project.get({ plain: true }));
    res.render('menu', {menus});
  } 
  catch (err) 
  {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
