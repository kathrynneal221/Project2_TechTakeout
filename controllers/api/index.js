const router = require('express').Router();

const userRoutes = require('./userRoutes');
const menuRoutes = require('./menuRoutes');
const cartRoutes = require('./cartRoutes');

router.use('/users', userRoutes);
router.use('/menus', menuRoutes);
router.use('/carts', cartRoutes);

module.exports = router;