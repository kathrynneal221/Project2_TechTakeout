const router = require('express').Router();
const userRoutes = require('./userRoutes');
const menuRoutes = require('./menuRoutes');

router.use('/users', userRoutes);
router.use('/menus', menuRoutes);

module.exports = router;