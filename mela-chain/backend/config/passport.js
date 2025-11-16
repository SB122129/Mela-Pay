import passport from 'passport';
import User from '../models/User.js';

export const configurePassport = () => {
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
