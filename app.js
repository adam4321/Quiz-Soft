/******************************************************************************
**  Description:   Node.js web server for the server-side rendered Software
**                 Quiz employer dashboard. This file is the entry point for
**                 the application.
**
**  Path of forever binary file:    ./node_modules/forever/bin/forever
******************************************************************************/

// Set up express
const express = require('express');
const app = express();

// PORT NUMBER - Set a static port for the appliction 
const PORT = process.env.PORT || 3500;

// Set up express-handlebars
const handlebars = require('express-handlebars');
const HANDLEBARS_HELPERS = require('./HANDLEBARS_HELPERS.js');
app.set('view engine', '.hbs');
app.engine('.hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: HANDLEBARS_HELPERS
}));

// Set up body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up Mongodb, Mongoose, and authentication credentials
const mongoose = require('mongoose');
let credentials;

// Choose credentials for dev or prod
if (process.env.NODE_ENV === 'production') {
    credentials = process.env;
} else {
    credentials = require('./credentials.js');
}

// Create database url using credentials
const url = `mongodb+srv://${credentials.MONGO_ADMIN}:${credentials.MONGO_ADMIN_PW}@${credentials.MONGO_PATH}`;

// Connect to Atlas remote database
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}, function (err, res) {
    if (err) {
        console.error('ERROR connecting ' + err);
    } else {
        console.log('Successful database connection\n');
    }
});

// Set up path to static files
app.use('/quiz_soft', express.static('public'));

// Set up cookie session and configure session storage
const crypto = require('crypto');
const buf = Buffer.alloc(10);
const USERCRYPTO = crypto.randomFillSync(buf).toString('hex');
const cookieSession = require('cookie-session');
app.use(cookieSession({
    name: 'session-name',
    secret: `${USERCRYPTO}`,
    resave: true,
    saveUninitialized: true
}));

// Include and configure passport
const passport = require('passport');
require('./passport.js');
app.use(passport.initialize());
app.use(passport.session());


/* PORTFOLIO INTRO PAGE ---------------------------------------------------- */
app.get('/quiz_soft/intro', (req, res) => {
    res.render('intro_page', {layout: 'login'});
});

/* PRIVACY PAGE ------------------------------------------------------------ */
app.get('/quiz_soft/privacy', (req, res) => {
    res.render('privacy_page', {layout: 'login'});
});


/* PAGE ROUTES -------------------------------------------------------------- */

// LOGIN PAGE ROUTES
app.use('/quiz_soft/login', require('./routes/login-page.js'));

// MAIN DASHBOARD PAGE ROUTES
app.use('/quiz_soft/dashboard', require('./routes/dashboard-home.js'));

// JOB POSTINGS PAGE ROUTES
app.use('/quiz_soft/job_postings', require('./routes/job-postings-page.js'));

// JOB POSTINGS BUILDER PAGE ROUTES
app.use('/quiz_soft/job_postings_builder', require('./routes/job-postings-builder-page.js'));

// RANKING PAGE ROUTES
app.use('/quiz_soft/ranking', require('./routes/ranking-page.js'));

// GRAPHIC PAGE ROUTES
app.use('/quiz_soft/graphic', require('./routes/graphic-page.js'));

// QUIZ SETUP PAGE ROUTES
app.use('/quiz_soft/quiz_builder', require('./routes/quiz-setup-page.js'));

// QUIZ BUILDER PAGE ROUTES
app.use('/quiz_soft/quiz_create', require('./routes/quiz-builder-page.js'));

// QUIZZES PAGE ROUTES
app.use('/quiz_soft/quizzes', require('./routes/quizzes-page.js'));

// TAKE QUIZ PAGE ROUTES
app.use('/quiz_soft/take_quiz', require('./routes/take-quiz-page.js'));


/* AUTHENTICATION ROUTES ---------------------------------------------------- */

// GOOGLE AUTH REQUEST 
app.get('/quiz_soft/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// GOOGLE POST-AUTH REDIRECT
app.get('/quiz_soft/auth/google/callback', passport.authenticate('google', { failureRedirect: '/quiz_soft/login/failed' }),
    function(req, res) {
        res.redirect('/quiz_soft/dashboard');
    }
);

// FACEBOOK AUTH REQUEST 
app.get('/quiz_soft/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

// FACEBOOK POST-AUTH REDIRECT
app.get('/quiz_soft/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/quiz_soft/login/failed' }),
    function(req, res) {
        res.redirect('/quiz_soft/dashboard');
    }
);

// LOG OUT ROUTE - for all pages
app.get('/quiz_soft/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/quiz_soft/intro');
});


/* ERROR ROUTES ------------------------------------------------------------ */

// Middleware - Function to Check user is Logged in
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
};

// PAGE NOT FOUND - Route for bad path error page
app.use(checkUserLoggedIn, (req, res) => {
    res.status(404).render('404');
})
   
// INTERNAL SERVER ERROR - Route for a server-side error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('500');
});


/* LISTEN ON PORT ---------------------------------------------------------- */

// Set to render on a static port set globally
app.listen(PORT, () => {
    console.log(`\nExpress started at http://localhost:${PORT}/quiz_soft/login\nPress ctrl-C to terminate.\n`);
});
