const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    // You can save or retrieve user profile information here
    // Example: Check if user exists in database or create a new user
    // const user = await User.findOne({ googleId: profile.id });

    // For demo purposes, assume user exists or create new user
    const user = { 
      username: profile.emails[0].value, // Use email as username
      email: profile.emails[0].value // Extract email from Google profile
    };

    // Generate JWT token
    const token = jwt.sign(user, JWT_SECRET);
    user.token = token; // Attach token to user object

    return done(null, user);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
