/******************************************************************************
**  Description: QUIZ SETUP PAGE - server side node.js routes
**
**  Root path:  localhost:3500/quiz_builder
**
**  Contains:   /
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn              
******************************************************************************/

const express = require('express');
const router = express.Router();


// Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


// QUIZ SETUP - Function to render quiz setup page ------------------------- */
function renderSetup(req, res, next) {
    res.status(200).render("quiz-setup-page");
};


/* QUIZ SETUP PAGE ROUTES -------------------------------------------------- */

router.get('/', checkUserLoggedIn, renderSetup);

module.exports = router;
