/******************************************************************************
**  Description: JOBPOSTINGS BUILDER PAGE - server side node.js routes
**
**  Root path:  localhost:3500/job_postings_builder
**
**  Contains:   /
**              /save_job_posting
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn              
******************************************************************************/

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

// Get schemas
const JobPosting = require('../models/jobposting.js');
const Employer = require('../models/employer.js');
const Quiz = require('../models/quiz.js');


/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


/* JOBPOSTINGS BUILDER - Function to render jobposting builder page --------------------- */
function renderBuilder(req, res, next) {
    let context = {};

    // Test for the auth provider (Google vs Facebook) and create context object
    if (req.user.provider === 'google') {
        context.email = req.user.email;
    } 
    else {
        context.email = req.user.emails[0].value;
    }
    // Query the user's quizzes and add them to the context object
    Employer.findOne({email: context.email})
    .exec((err, user) => {
        // Find all quizzes for the currently logged in user
        Quiz.find({}).lean().where('employer_id').equals(user._id).exec()
        .then(quizzes => {
            // Assign the quiz properties to the context object
            context.quizzes = quizzes;
            res.status(200).render("job-postings-builder-page", context);
        })
        .catch(err => {
            console.error(err);
            res.status(500).render("500", context);
        });
    })
        
};


/* SUBMIT JOBPOSTING - Function to store the completed job posting into the db ---------- */
function submitJobPosting(req, res, next) {
    let context = {};
    if (req.user.provider === 'google') {
        context.email = req.user.email;
    } 
    else {
        context.email = req.user.emails[0].value;
    }

    if (req.body.quiz !== ""){
        // Query quiz selected from the job posting building form
        Quiz.find({_id: ObjectId(req.body.quiz)}).exec()
        .then(quiz_obj => {
            // Save new object to database collection and associate to employer
            Employer.find({email: req.user.email}).exec()
            .then(doc => {
                // Create a new job posting document
                const saved_job_posting = new JobPosting({
                    _id: new mongoose.Types.ObjectId,
                    employer_id: ObjectId(doc[0]._id),
                    title: req.body.job_title,
                    description: req.body.job_description,
                    messageText: req.body.job_message_text,
                    associatedQuiz : [{
                        quiz : quiz_obj[0]
                    }]
                });

                // Save job posting to the database
                saved_job_posting.save()
                .then(() => {
                    res.status(201).end();
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).end();
                });
            })
            .catch(err => {
                console.error(err);
                res.status(404).end();
            });
        })
        .catch(err => {
            console.error(err);
            res.status(404).end();
        });
    }
    else{
        // No quiz selected
        res.status(500).end();
    }
}


/* JOBPOSTINGS BUILDER PAGE ROUTES ------------------------------------------------ */

router.get('/', checkUserLoggedIn, renderBuilder);
router.post('/save_job_posting', checkUserLoggedIn, submitJobPosting);

module.exports = router;
