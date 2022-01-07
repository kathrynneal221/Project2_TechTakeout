const router = require('express').Router();
const { Restaurant, Menu, User, Cart } = require('../../models');
const withAuth = require('../../utils/auth');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create a new Cart.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/', async (req, res) => {
  try
  {
    // Call the create method of the Cart model to add a new row to the Cart table.
    const newCart = await Cart.create({
      user_id: req.body.user_id,
      restaurant_id: req.body.restaurant_id,
      datecreated: new Date().toLocaleDateString(),
      total_price: req.body.total_price,
      pickup: req.body.pickup,
      delivery: req.body.delivery
    });
    
    // Return the status of 200 and the success message.
    res.status(200).json({ message: 'Cart was created successfully.' });
  }
  catch (err) 
  {
    // Return the status code of 500 and the error object.
    res.status(500).json({ message: 'Cart create operation failed.' });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Update a specific Cart.
/////////////////////////////////////////////////////////////////////////////////////////////////////////
router.put('/:id', async (req, res) => {
  try
  {
    // Calls the update method of the Cart model to update the row data based on the id
    // value passed in.
    const updatedCart = await Cart.update(
      {
        // All the fields you can update and the data attached to the request body.
        user_id: req.body.user_id,
        restaurant_id: req.body.restaurant_id,
        datecreated: new Date().toLocaleDateString(),
        total_price: req.body.total_price,
        pickup: req.body.pickup,
        delivery: req.body.delivery
      },
      {
        // Gets the Cart based on the id given in the request parameters.
        where: 
        {
          id: req.params.id,
        },
      }
    )
 
    // Return the status code of 200 and tell the user that the Cart record was updated successfully.
    res.status(200).json({ message: "The Cart record was updated successfully." });    
  }
  catch (err)
  {
    // Return the status code of 500 and tell the user the update operation failed.    
    res.status(500).json({ message: 'Cart post update operation failed.' });    
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////
// Delete a Cart by id.
//////////////////////////////////////////////////////////////////////////////////////////////////////
router.delete('/:id', async (req, res) => {
    try
    {
      // Call the destroy method of the Cart model to delete the Cart row in the table 
      // based on id given in the request parameters.
      const deletedCart = Cart.destroy(
      {
        where: 
        {
          id: req.params.id,
        },
      })
  
      // Return the status code of 200 and tell the user that the Cart record was deleted successfully.
      res.status(200).json({ message: "The Cart record with the id value: " + req.params.id.toString() + " was deleted successfully." });
    }
    catch (err)
    {
      // Return a status code of 500 and tell the user that the Blog post delete operation failed. 
      res.status(500).json({ message: 'Blog post delete operation failed.' });           
    }
  });

////////////////////////////////////////////////////////////////////////////////////////
// Route to get, display the cart dashboard page.
// This route does a findAll based on the user_id value. All carts for this user
// will be displayed on the dashboard page. 
////////////////////////////////////////////////////////////////////////////////////////
// Put back verion with the function call "withAuth" after done testing.
// Also put back the req.session.user_id value once this is set up.
///////////////////////////////////////////////////////////////////////////////////////
//router.get('/',  withAuth, async (req, res) => {
router.get('/',  async (req, res) => {  
  try
  {
    // Call the findAll method of the Cart model to get all of the rows from the Cart table that contain a 
    // match on the user_id value. Include the User model.
    const cartData = await Cart.findAll({
      include: [{ model: User }], where: { //user_id: req.session.user_id, } 
                                           user_id: 1, }
    });

    const carts = cartData.map((project) => project.get({ plain: true }));

    res.render('dashboard', {carts});
  }
  catch (err)
  {
    res.status(500).json(err);
  }
});

module.exports = router;
