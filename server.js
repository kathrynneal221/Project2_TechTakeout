const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const passport = require('passport');
const Strategy = require('passport-local');
const { User } = require('./models');

const routes = require('./controllers');

// Commented this out.  Don't need it.
// Don't have helpers.js file in utils directory.
//const helpers = require('./utils/helpers');

const sequelize = require('./config/connection');
const res = require('express/lib/response');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Put back code to use file helpers.js in utils directory.
//const hbs = exphbs.create({ helpers });
const hbs = exphbs.create({});

hbs.handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

passport.use(new Strategy(//{usernameField: "email"},
  function(username, password, cb) {
  User.findOne({
    where: {
      email: username
    }
  })
  .then(dbUserData => {
    if(!dbUserData){
      return cb(err);
    }
    const validPassword = dbUserData.checkPassword(password)
    if(!validPassword){
      return cb(null, false, { message: 'Incorrect password!' });
    };
    return cb(null, dbUserData);
    });
}));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.email });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});


const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));
app.use(passport.authenticate('session'));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
