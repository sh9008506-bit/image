const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        proxy: true // For HTTPS in production
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists
            let user = await User.findOne({ email: profile.emails[0].value });
            
            if (user) {
                // Update last login and profile info
                user.lastLogin = Date.now();
                user.displayName = profile.displayName;
                user.profileImage = profile.photos[0].value;
                await user.save();
                return done(null, user);
            } else {
                // Create new user
                const newUser = new User({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    displayName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    profileImage: profile.photos[0].value,
                    username: profile.emails[0].value.split('@')[0] + Math.floor(Math.random() * 1000),
                    isVerified: profile.emails[0].verified || false
                });
                
                await newUser.save();
                return done(null, newUser);
            }
        } catch (err) {
            console.error('Google OAuth Error:', err);
            return done(err, null);
        }
    }));
};