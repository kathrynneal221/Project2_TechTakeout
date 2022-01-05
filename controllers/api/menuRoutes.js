const router = require('express').Router();
const { Restaurant, Menu } = require('../../models');

// GET all menus for menu view.
router.get('/', async (req, res) => {
  try 
  {
    const dbMenuData = await Menu.findAll({
      include: [{ model: Restaurant }],
    });

    const menus = dbMenuData.map((project) => project.get({ plain: true }));

    res.render('menu', {menus, loggedIn: req.session.loggedIn, });
  } 
  catch (err) 
  {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;