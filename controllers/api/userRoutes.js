const router = require('express').Router();
// const passport = require('passport');
// const Strategy = require('passport-local');
// const crypto = require('crypto');

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
// router.post('login', (req, res) => {
//   passport.use(new Strategy(function(email, password, cb) {
//     User.findOne({
//       where: {
//         email: req.body.email
//       }
//     })
//     .then(dbUserData => {
//       if(!dbUserData){
//         return cb(err);
//       }
//       crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
//         if(err){
//           return cb(err);
//         }
//         if(!crypto.timingSafeEqual(req.body.password, hashedPassword)){
//           return cb(null, false, { message: 'Incorrect password!' });
//         }
//         req.session.save(() =>{
//           req.session.user_id = dbUserData.id;
//           req.session.email = dbUserData.email;
//           req.session.loggedIn = true;

//           res.json({ user: dbUserData, message: 'You are now logged in!' });
//         });
//       });
//     });
//   }));
// });

// LOGIN for users
router.post('/login', (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: 'No user with that email address!' });
      return;
    }
  
    // Validates password
    const validPassword = dbUserData.checkPassword(req.body.password);
  
    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }
  
    req.session.save(() => {
      // Declare session variables
      req.session.user_id = dbUserData.id;
      req.session.email = dbUserData.email;
      req.session.loggedIn = true;
  
      res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
  });
});

// LOGOUT
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
    res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;