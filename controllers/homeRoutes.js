const router = require('express').Router();
const { Restaurant, Menu, User, Cart } = require('../models');

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

////////////////////////////////////////////////////////////////////////////////////////
// Route to get, display the cart page.
// This route does a findAll based on the cart_id value. It gets all of the menus records
// for the cart id value passed in. 
////////////////////////////////////////////////////////////////////////////////////////
// Put back the withAuth function call to go to the login later after done testing.
////////////////////////////////////////////////////////////////////////////////////////
//router.get('/:id', withAuth, async (req, res) => {
  router.get('/carts/:id', async (req, res) => {  
    try
    {
      // Call the findAll method of the Menu model to get all of the rows from the Menu table that contain a 
      // match on the cart_id value. Include the User model.
      const menuData = await Menu.findAll({where: { cart_id: req.params.id, }
      });
  
      const menus = menuData.map((project) => project.get({ plain: true }));
  
      // Get the data for the cart:
      cartData = await Cart.findByPk(req.params.id, {
        include: [ { model: User } ],
      });
  
      // If the cart data was not found then only send the menu items to the view.
      if (!cartData) 
      {
        // Render the cart view with just the menu items.
        res.render('cart', {menus});
      }
      else
      {
        // Get the cart data for just the one cart item.
        const cartItem = cartData.get({ plain: true });
  
        // Render the cart view with both the cart and all the menu items.
        res.render('cart', {menus, cartItem});
      }
    }
    catch (err)
    {
      res.status(500).json(err);
    }
  });


// This route will get the menu item and create a new one with it cart id value set to the id value of
// the current cart for the user.
router.get('/carts/add/:id', async (req, res) => {  
  try
  {
    // Use this as the default for now.
    // The current cart Id value is a session variable and will have it
    // after the user logs in a cart is created.
    let nCartId = 4;

    // Get the data for the menu item:
    menuData = await Menu.findByPk(req.params.id, {});

    // If the Menu data was not found tell the user.
    if (!menuData) 
    {
      res.status(404).json({ message: 'No menu items found, cannot add menu item to cart.' });
      return;
    }
    else
    {
      // Get the menu data for just the one cart item.
      const menuItem = menuData.get({ plain: true });

      // Calls the create method of the menu item to add a new row of data in the database.
      const updatedMenu = await Menu.create(
      {
        // All the fields you can update and the data attached to the request body.
        cart_id: nCartId,
        category_code: menuItem.category_code,
        dish_name: menuItem.dish_name,
        dish_description: menuItem.dish_description,
        price: menuItem.price,
        image_url: menuItem.image_url,
        restaurant_id: menuItem.restaurant_id
      });      

      res.render('addcart', {menuItem});      

    }
  }
  catch (err)
  {
    res.status(500).json(err);      
  }
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
