/******************************************************************************
**  Description: LOGIN PAGE - server side node.js routes
**
**  Root path:  localhost:3500/login
**
**  Contains:   /
**              /failed
**              
**  UNSECURED ROUTES!
******************************************************************************/

const express = require('express');
const router = express.Router();


// LOGIN - Function to render the login page ------------------------------- */
function renderLogin(req, res, next) {
    res.status(200).render("login-page", {layout: 'login'});
};


// FAILED - Function to render a failed login ------------------------------ */
function renderFailedLogin(req, res, next) {
    res.status(500).render("login-failed-page", {layout: 'login'});
};


/* LOGIN PAGE ROUTES ------------------------------------------------------- */

router.get('/', renderLogin);
router.get('/failed', renderFailedLogin);

module.exports = router;
