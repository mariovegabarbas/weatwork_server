const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const knex = require('./db/connection');

const options = {};

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

passport.serializeUser((user, done) => { done(null, user.id); });

passport.deserializeUser((id, done) => {
  return knex('users').where({id}).first()
  .then((user) => { done(null, user); })
  .catch((err) => { done(err,null); });
});

passport.use(new LocalStrategy(options, (username, password, done) => {
  knex('users').where({ username }).first()
  .then((user) => {
    if (!user) return done(null, false);
    if (!comparePass(password, user.password)) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  })
  .catch((err) => { return done(err); });
}));

/* https://flow.polar.com/oauth2/authorization?response_type=code&client_id=9cb3f0e9-6278-4c45-829c-5b480ada245d */
/*client id:  9cb3f0e9-6278-4c45-829c-5b480ada245d  */ 
/*secret:     46cc92ea-50ba-4fa2-8500-4492315d9d14  */