const router = require('express').Router();
const passport = require('passport');

const { User } = require('../../models');


// GET all users
router.get('/', (req, res) => {
  User.findAll({
    attributes: { exclude: ['password'] }
  })
  .then(dbUserData => res.json(dbUserData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// GET a single user by id
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    where: {
      id: req.params.id
    }
  })
  .then(dbUserData => {
    if(!dbUserData) {
      res.status(404).json({ message: 'No user found with that id!'});
      return;
    }
    res.json(dbUserData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// CREATE new user
router.post('/', (req, res) => {
  User.create({
    // username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
  .then(dbUserData => {
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.email = dbUserData.email;
      req.session.loggedIn = true;

      res.json(dbUserData);
    });
  });
});

// LOGIN for users - passport
router.post('/login', passport.authenticate('local',  {
  successRedirect: '/',
  failureRedirect: '/login',
  failureMessage: true
}));


// LOGOUT
router.post('/logout', (req, res) => {
  if (!!req.session.passport) {
    req.session.destroy(() => {
    res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;