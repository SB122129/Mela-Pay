import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

export const configurePassport = () => {
  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
        passReqToCallback: true
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            // User exists, update last login
            user.lastLogin = new Date();
            await user.save();
            return done(null, user);
          }

          // Check if user exists with same email
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          if (email) {
            user = await User.findOne({ email: email.toLowerCase() });
            if (user) {
              // Link Google account to existing user
              user.googleId = profile.id;
              user.lastLogin = new Date();
              await user.save();
              return done(null, user);
            }
          }

          // Create new user
          const newUser = await User.create({
            googleId: profile.id,
            email: email ? email.toLowerCase() : `${profile.id}@google.temp`,
            name: profile.displayName || 'Google User',
            isActive: true,
            role: 'user',
            lastLogin: new Date()
          });

          done(null, newUser);
        } catch (error) {
          console.error('Google OAuth error:', error);
          done(error, null);
        }
      }
    )
  );

  // (Optional) — You can add local strategy here if needed

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select('-password');
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default configurePassport;
