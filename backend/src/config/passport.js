// backend/src/config/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { findUserByGoogleId, findUserByEmail, linkGoogleAccount, createUser } from "../models/User.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // e.g., https://api.yourapp.com/auth/google/callback
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value?.toLowerCase();
        const name = profile.displayName || profile.name?.givenName || "User";

        let user = await findUserByGoogleId(googleId);
        if (user) return done(null, user);

        if (email) {
          const existing = await findUserByEmail(email);
          if (existing) {
            await linkGoogleAccount(existing.id, googleId);
            return done(null, { ...existing, google_id: googleId });
          }
        }

        const newId = await createUser({ name, email, passwordHash: null, googleId });
        user = { id: newId, name, email, google_id: googleId };
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => done(null, { id }));

export default passport;
