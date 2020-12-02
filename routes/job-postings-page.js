/******************************************************************************
**  Description: JOB POSTINGS PAGE - server side node.js routes
**
**  Root path:  localhost:3500/job_postings
**
**  Contains:   /
**              /delete
**  
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn             
******************************************************************************/

const express = require('express');
const router = express.Router();

// Get Schemas
const Employer = require('../models/employer.js');
const JobPosting = require('../models/jobposting.js');
const { ObjectId } = require('mongodb');


/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


/* POSTINGS PAGE - Function to render user's job postings ------------------ */
function renderPostings(req, res, next) {
    let context = {};

    // Test for the auth provider (Google vs Facebook) and create context object
    if (req.user.provider === 'google') {
        context.email = req.user.email;
        context.name = req.user.displayName;
        context.photo = req.user.picture;
    } 
    else {
        context.email = req.user.emails[0].value;
        context.name = req.user.displayName;
        context.photo = req.user.photos[0].value;
    }

    // Query the user's quizzes and add them to the context object
    Employer.findOne({email: context.email}).exec((err, user) => {
        let emp_id = user._id;
        // Update the missedMessages attribute of the document, when rendering the job posting route
        user.missedMessages = 0;
        user.save()
        .then(emp_result => {
            // Find all quizzes for the currently logged in user
            JobPosting.find({}).lean().where('employer_id').equals(emp_id).exec()
            .then(postings => {
                // Assign the quiz properties to the context object
                context.postings = postings;

                res.status(200).render("job-postings-page", context);
            })
            .catch(err => {
                console.error(err);
                res.status(500).render("job-postings-page", context);
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).render("job-postings-page", context);
        });
    })
};


/* DELETE POSTING - Function to delete a posting from database ------------- */
function deletePosting(req, res, next) {
    let context = {};

    // Find the quiz by the id in the request body
    JobPosting.deleteOne({'_id': ObjectId(req.body.id)}).exec()
    .then(() => {
        // Reply to the client
        res.status(204).send(context).end();
    })
    .catch(err => {
        console.error(err);
        res.status(500).end();
    });
};


/* RANKING PAGE ROUTES ---------------------------------------------------- */

router.get('/', checkUserLoggedIn, renderPostings);
router.post('/delete', checkUserLoggedIn, deletePosting);

module.exports = router;
