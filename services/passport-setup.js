const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user')
const {createTokenForUser} = require('../services/authentication')
require('dotenv').config();




passport.use(
    new GoogleStrategy({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: '/user/google/redirect', 
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        // Find the user based on their Google ID
        let currentUser = await User.findOne({ googleId: profile.id });
        if (currentUser) {
          // If the user already exists, log and return the user to home screen with the token
          console.log('User Already Existed');
          const token = createTokenForUser(currentUser);

          return done(null, currentUser , {token});
        } else {
          // If the user does not exist, create a new user
          let newUser = await User.create({
            username: profile.displayName,
            googleId: profile.id,
            email: profile.emails[0].value,
            password: profile.id 
          });
          console.log('User Created');
          const token = createTokenForUser(newUser);
          return done(null, newUser , {token});
        }
      } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error during Google authentication:', error);
        return done(error, null);
      }
    })
);