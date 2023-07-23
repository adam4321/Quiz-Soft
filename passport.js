/******************************************************************************
**  Description:  Setup file for authentication with Oauth2 through
**                passport.js with Google and Facebook
******************************************************************************/

const passport = require('passport');

// Include Oauth2 strategies
let GOOG_CREDS;
let FACE_CREDS;

if (process.env.NODE_ENV === 'production') {
    GOOG_CREDS = process.env;
    FACE_CREDS = process.env;
}
else {
    GOOG_CREDS = require('./credentials.js');
    FACE_CREDS = require('./credentials.js')
}

const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

// Process the user's token
passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Create Oauth2 strategies
passport.use(new GoogleStrategy({
        clientID: GOOG_CREDS.GOOGLE_CLIENT_ID,
        clientSecret: GOOG_CREDS.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.PWD && process.env.PWD.includes('code/portfolio_site')
            ? GOOG_CREDS.GOOGLE_CALLBACK_LOCAL
            : GOOG_CREDS.GOOGLE_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

passport.use(new FacebookStrategy({
        clientID: FACE_CREDS.FACEBOOK_CLIENT_ID,
        clientSecret: FACE_CREDS.FACEBOOK_CLIENT_SECRET,
        callbackURL: FACE_CREDS.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'displayName', 'photos', 'email']
    }, 
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));
