const router = require('express').Router();
const passport = require('passport');
const { Restaurant, Menu, User, Cart } = require('../models');
const withAuth = require('../utils/auth');

// RENDER login page
router.get('/login', async (req, res) => {
  try
  {
    res.render('login', {
      loggedIn: !!req.session.passport,
      dashboardPage: false,
      loginPage: true
    });
  }
  catch(err)
  {
    res.status(500).json(err);
  }
});

// REDIRECT users to homepage after logging in
router.get('/login', (req, res) => {
  if (!!req.session.passport) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

// RENDER sign up page
router.get('/signup', (req, res) => {
  if (!!req.session.passport) {
    res.redirect('/');
    return;
   }
  
  res.render('signup');
});


// RENDER all restaurants for homepage
router.get('/', async (req, res) => {
  try {
    const dbRestaurantData = await Restaurant.findAll({
    });

    const restaurants = dbRestaurantData.map((project) => project.get({ plain: true }));

    res.render('homepage', {
      restaurants,
      loggedIn: !!req.session.passport

});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// RENDER menu
router.get('/menus', async (req, res) => {
  try 
  {
    // Get the Restaurant.
    const restaurantData = await Restaurant.findByPk(1, { });

    // Get the cart data for just the one cart item.
    const restaurantItem = restaurantData.get({ plain: true });

    const dbMenuData = await Menu.findAll({
      include: [{ model: Restaurant }],
      // Testing if the cart_id value = 0 and restaurant_id = 1
      // Getting the default menu items for the restaurant not 
      // assigned to any cart.
      where: {
          cart_id: 0,
          restaurant_id: 1
      }
    });

    const menus = dbMenuData.map((project) => project.get({ plain: true }));
    res.render('menu', {
      menus, 
      restaurantItem,
      loggedIn: !!req.session.passport
    });
  } 
  catch (err) 
  {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/carts', withAuth, async (req, res) => {  
  try
  {
    // Call the findAll method of the Cart model to get all of the rows from the Cart table that contain a 
    // match on the user_id value. Include the User model.
    const cartData = await Cart.findAll({
      include: [{ model: User }], where: { user_id: req.session.passport.user.id, },
      order: [['id', 'DESC']],
    }); 

    const carts = cartData.map((project) => project.get({ plain: true }));
    res.render('carthistory', {
      carts,
      loggedIn: !!req.session.passport
    });
  }
  catch (err)
  {
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
  router.get('/carts/:id', withAuth, async (req, res) => {  
    try
    {
      let nCartId = null;
      let cartData = null;
      let szToday= new Date().toLocaleDateString();
      let carts = null;
      let newCart = null;

      // If the id value pass in is 0 then get the current cart.
      // otherwise use the cart id passed in.
      if (req.params.id == 0)
      {
        // Do a findAll operation for the cart based on the user_id value and the hardwired restaurant id 
        // value of 1, and todays date.
        cartData = await Cart.findAll({
          include: [{ model: User }], where: { user_id: req.session.passport.user.id, restaurant_id: 1,
                                               datecreated: szToday} 
        });

        carts = cartData.map((project) => project.get({ plain: true }));

        // If the cart data was not found, then create one.
        if (carts.length == 0) 
        {
          // Call the create method of the Cart model to add a new row to the Cart table.
          newCart = await Cart.create({
            user_id: req.session.passport.user.id,
            restaurant_id: 1,
            datecreated: new Date().toLocaleDateString(),
            total_price: 0.0,
            pickup: false,
            delivery: false
          });

          nCartId = newCart.id;                
        }
        else
        {
          nCartId = nCartId = carts[0].id;
        }
      }
      else
      {
        nCartId = req.params.id;
      }

      // Call the findAll method of the Menu model to get all of the rows from the Menu table that contain a 
      // match on the cart_id value. Include the User model.
      const menuData = await Menu.findAll({where: { cart_id: nCartId, }
      });
  
      const menus = menuData.map((project) => project.get({ plain: true }));
  
      // Get the data for the cart:
      cartData = await Cart.findByPk(nCartId, {
        include: [ { model: User } ],
      });
  
      // If the cart data was not found then only send the menu items to the view.
      if (!cartData) 
      {
        if (menus.length == 0)
        {
          res.render('menu', {
            menusExist: false,
            loggedIn: !!req.session.passport
          });
        }
        else
        {
          // Render the cart view with just the menu items.
          res.render('cart', {
            menus, 
            menusExist: true,
            loggedIn: !!req.session.passport
          });
        }
      }
      else
      {
        // Get the cart data for just the one cart item.
        const cartItem = cartData.get({ plain: true });

        if (menus.length == 0)
        {
          // Render the cart view with both the cart and all the menu items.
          res.render('cart', {
            cartItem, 
            menusExist: false,
            loggedIn: !!req.session.passport
          });
        }
        else
        {
          // Render the cart view with both the cart and all the menu items.
          res.render('cart', {menus, 
            cartItem, 
            menusExist: true,
            loggedIn: !!req.session.passport
          });
        }
      }
    }
    catch (err)
    {
      res.status(500).json(err);
    }
  });

///////////////////////////////////////////////////////////////////////////////////////////////////
// Route: To delete menu item from the cart.
// id = The menu id value.  cart_id = The cart id value.
//////////////////////////////////////////////////////////////////////////////////////////////////
  router.get('/carts/del/:id/:cart_id', async (req, res) => {  
    try
    {
      let menuData = null;
      let cartData = null;
      let menus = null;
      let dPrice = null;
      let dTotalPrice = null;
      let menuItem = null;
      let cartItem = null;
      let updatedCart = null;
    
      // Get the data for the menu that will be deleted.  Save the price value.
      menuData = await Menu.findByPk(req.params.id, {    
      });

      // Get the menu data for just the one cart item.
      menuItem = menuData.get({ plain: true });      

      // Save the price of the menu item.
      dPrice = parseFloat(menuItem.price);

      // Call the destroy method of the menu model to delete the menu row in the table 
      // based on id given in the request parameters.
      menuData = Menu.destroy(
      {
        where: 
        {
          id: req.params.id,
        },
      });

      // Get the data for the menu that was just deleted.  This is done so the findAll command
      // below will work correctly
      menuData = await Menu.findByPk(req.params.id, {  });

      // Call the findAll method of the Menu model to get all of the rows from the Menu table that contain a 
      // match on the cart_id value. Include the User model.
      menuData = await Menu.findAll({where: { cart_id: req.params.cart_id, }
      });

      // Get all of the menu item in a map element.
      menus = menuData.map((project) => project.get({ plain: true }));
  
      // Get the data for the cart:
      cartData = await Cart.findByPk(req.params.cart_id, {
        include: [ { model: User } ],
      });

      // If the cart data was not found then only send the menu items to the view.
      if (!cartData) 
      {
        //////////////////////////////////////////////////////////////////////////
        // DO THIS AGAIN AT THE END TO SEE IF IT FIXES THIS PROBLEM.
        //////////////////////////////////////////////////////////////////////////
        // Call the findAll method of the Menu model to get all of the rows from the Menu table that contain a 
        // match on the cart_id value. Include the User model.
        menuData = await Menu.findAll({where: { cart_id: req.params.cart_id, }
        });

        // Get all of the menu item in a map element.
        menus = menuData.map((project) => project.get({ plain: true }));

        // Test if we have any menu items.  If we don't then do not send any data models
        // to the veiw.
        if (menus.length == 0)
        {
          res.render('cart', {
            menusExist: false,
            loggedIn: !!req.session.passport
          });          
        }
        // otherwise just send the menu data model.
        else
        {
          // Render the cart view with just the menu items.
          res.render('cart', {
            menus, 
            menusExist: true,
            loggedIn: !!req.session.passport
          });
        }
      }
      else
      {
        // Get the cart data for just the one cart item.
        cartItem = cartData.get({ plain: true });

        // Get the Total Price value from the cart.
        dTotalPrice = parseFloat(cartItem.total_price);
        dTotalPrice -= dPrice;
        dTotalPrice = parseFloat(dTotalPrice);

        // Add additional test, if value less than zero, set it to zero.
        if (dTotalPrice < 0.0)
        {
          dTotalPrice = 0.0;
        }

        // Update the cart, add the price of the menu item that was added.
        updatedCart = await Cart.update(
          {
              // All the fields you can update and the data attached to the request body.
              user_id: cartItem.user_id,
              restaurant_id: 1,
              datecreated: cartItem.datecreated,
              total_price: dTotalPrice,
              pickup: cartItem.pickup,
              delivery: cartItem.delivery
          },
          {
              // Gets the Cart based on the id given in the request parameters.
              where: 
              {
                id: req.params.cart_id,
              },
          });

        // Just updated the cart have to get the data again.
        cartData = await Cart.findByPk(req.params.cart_id, {
          include: [ { model: User } ],
        });

        // Get the cart data for just the one cart item.
        cartItem = cartData.get({ plain: true });          

        //////////////////////////////////////////////////////////////////////////
        // DO THIS AGAIN AT THE END TO SEE IF IT FIXES THIS PROBLEM.
        //////////////////////////////////////////////////////////////////////////
        // Call the findAll method of the Menu model to get all of the rows from the Menu table that contain a 
        // match on the cart_id value. Include the User model.
        menuData = await Menu.findAll({where: { cart_id: req.params.cart_id, }
        });

        // Get all of the menu item in a map element.
        menus = menuData.map((project) => project.get({ plain: true }));

        // Test if we don't have any menu items.
        // If we don't then just send the Cart data model to the view.
        if (menus.length == 0)
        {
          // Render the cart view with both the cart and all the menu items.
          res.render('cart', {
            cartItem, 
            menusExist: false,
            loggedIn: !!req.session.passport
          });
        }
        // Else we have menu items so include them also.
        else
        {
          // Render the cart view with both the cart and all the menu items.
          res.render('cart', {
            menus, 
            cartItem, 
            menusExist: true,
            loggedIn: !!req.session.passport
          });
        }
      }
    }
    catch (err)
    {
      res.status(500).json(err);
    }
  });

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Route: Adds the menu item passed to the cart for the current user.
// This route will get the menu item and create a new one with it cart id value set to the id value of
// the current cart for the user.
/////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/carts/add/:id', withAuth, async (req, res) => {  
  try
  {
    let bCartExists = false;
    let nCartId = 0;
    let szToday= new Date().toLocaleDateString();
    let cartData  = null;
    let carts = null;
    let newCart = null;
    let menuData = null;
    let menuItem = null;
    let updatedMenu = null;
    let updatedCart = null;
    let dPrice = null;
    let dTotalPrice = null;

    // Test if we have a user_id value.  
    if (req.session.passport !== undefined)
    {
      // Get the data for the menu item.  Do this now so can add the price to the cart if a cart is
      // created, otherwise we sum up the price with the current cart and save it.
      menuData = await Menu.findByPk(req.params.id, {});

      // If the Menu data was not found tell the user.
      if (!menuData) 
      {
        res.status(404).json({ message: 'No menu items found, cannot add menu item to cart.' });
        return;
      }

      // Get the menu data for just the one cart item.
      menuItem = menuData.get({ plain: true });      

      // Do a findAll operation for the cart based on the user_id value and the hardwired restaurant id 
      // value of 1, and todays date.
      cartData = await Cart.findAll({
        include: [{ model: User }], where: { user_id: req.session.passport.user.id, restaurant_id: 1,
                                             datecreated: szToday} 
      });

      carts = cartData.map((project) => project.get({ plain: true }));

      // If the cart data was not found, then create one.
      if (carts.length == 0) 
      {
        // Call the create method of the Cart model to add a new row to the Cart table.
        newCart = await Cart.create({
          user_id: req.session.passport.user.id,
          restaurant_id: 1,
          datecreated: new Date().toLocaleDateString(),
          total_price: menuData.price,
          pickup: false,
          delivery: false
        });

        // Save the id value of the new cart created and set the bCartExists value to true.
        nCartId = newCart.id;
        bCartExists = true;
      }
      // else - Have a cart so set bCartExists to true and save the cart id value.
      //        Also sum up the total price for the menu item being added and update the cart. 
      else
      {
        bCartExists = true;
        nCartId = carts[0].id;

        // Sum up the price for total price for the cart.
        dPrice = parseFloat(menuData.price);
        dTotalPrice = parseFloat(carts[0].total_price);
        dTotalPrice += dPrice;
        dTotalPrice = parseFloat(dTotalPrice);

        // Update the cart, add the price of the menu item that was added.
        updatedCart = await Cart.update(
        {
            // All the fields you can update and the data attached to the request body.
            user_id: carts[0].user_id,
            restaurant_id: 1,
            datecreated: carts[0].datecreated,
            total_price: dTotalPrice,
            pickup: carts[0].pickup,
            delivery: carts[0].delivery
        },
        {
            // Gets the Cart based on the id given in the request parameters.
            where: 
            {
              id: nCartId,
            },
        });
      }
    }

    // Following operations performed if the cart exists.
    if (bCartExists)
    {
      // Calls the create method of the menu item to create a new one that contains the cart id value.
      updatedMenu = await Menu.create(
      {
        cart_id: nCartId,
        category_code: menuItem.category_code,
        dish_name: menuItem.dish_name,
        dish_description: menuItem.dish_description,
        price: menuItem.price,
        image_url: menuItem.image_url,
        restaurant_id: menuItem.restaurant_id
      });

      // Render to addcart handlebars view.  Pass in the menu item and cart exists value.
      res.render('addcart', {
        menuItem, 
        cartExists: bCartExists, 
        loggedIn: !!req.session.passport
      });  
    }
    // The cart does not exist, so just render the addcart view, and only pass in the cart exists
    // value so for this case user told the menu item could not be added and they need to login.
    else
    {
      res.render('addcart', {
        cartExists: bCartExists, 
        loggedIn: !!req.session.passport
      });  
    }    
  }
  catch (err)
  {
    res.status(500).json(err);      
  }
});

module.exports = router;