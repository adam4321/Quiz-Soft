/******************************************************************************
**  Description: QUIZ BUILDER PAGE - server side node.js routes
**
**  Root path:  localhost:3500/quiz_create
**
**  Contains:   /
**              /save_quiz
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn              
******************************************************************************/

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Get schemas
const Quiz = require('../models/quiz.js');
const Employer = require('../models/employer.js');


/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


/* QUIZ BUILDER - Function to render quiz builder page --------------------- */
function renderBuilder(req, res, next) {
    res.status(200).render("quiz-builder-page", {layout: 'login'});
};


/* SUBMIT QUIZ - Function to store the completed quiz into the db ---------- */
function submitQuiz(req, res, next) {
    let context = {};

    // Save new object to database collection and associate to employee
    if (req.body.questions.length !== 0) {
        Employer.find({email: req.user.email}).exec()
        .then(doc => {
           
            // Create a new quiz document
            const saved_quiz = new Quiz({
                _id: new mongoose.Types.ObjectId,
                employer_id: doc[0]._id,
                name: req.body.name,
                category: req.body.category,
                timeLimit: req.body.timeLimit,
                questions : req.body.questions
            });

            // Save quiz to the database
            saved_quiz.save()
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
            res.status(404).render("quiz-setup-page", context);
        });
    }
    else {
        console.error("No questions in body!!");
        res.send(context).end();
    }
}


/* QUIZ BUILDER PAGE ROUTES ------------------------------------------------ */

router.get('/', checkUserLoggedIn, renderBuilder);
router.post('/save_quiz', checkUserLoggedIn, submitQuiz);

module.exports = router;
