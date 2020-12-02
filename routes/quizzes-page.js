/******************************************************************************
**  Description: QUIZZES PAGE - server side node.js routes
**
**  Root path:  localhost:3500/quizzes
**
**  Contains:   /
**              /delete
**              /download
**              /upload
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn         
******************************************************************************/

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

// Get Schemas
const Quiz = require('../models/quiz.js');
const Employer = require('../models/employer.js');


/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


/* RENDER QUIZZES - Function to render user's quizzes ---------------------- */
function renderQuizzes(req, res, next) {
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
    Employer.findOne({email: context.email})
    .exec((err, user) => {
        // Find all quizzes for the currently logged in user
        Quiz.find({}).lean().where('employer_id').equals(user._id).exec()
        .then(quizzes => {
            // Assign the quiz properties to the context object
            context.quizzes = quizzes;
            res.status(200).render("quizzes-page", context);
        })
        .catch(err => {
            console.error(err);
            res.status(500).render("quizzes-page", context);
        });
    })
};


/* DELETE QUIZ - Function to delete a quiz from database ------------------- */
function deleteQuiz(req, res, next) {
    let context = {};

    // Find the quiz by the id in the request body
    Quiz.deleteOne({'_id': ObjectId(req.body.id)}).exec()
    .then(() => {
        // Reply to the client
        res.status(204).send(context).end();
    })
    .catch(err => {
        console.error(err);
        res.status(500).end();
    });
};


/* DOWNLOAD QUIZ - Function to download a quiz ----------------------------- */
function downloadQuiz(req, res, next) {
    let context = {};

    // Find the quiz by the id in the request body
    Quiz.findOne({'_id': ObjectId(req.body.id)}).exec()
    .then(quiz => {
        // Add quiz to the context object
        context.quiz = quiz;

        // Reply to the client
        res.status(200).send(context).end();
    })
    .catch(err => {
        console.error(err);
        res.status(500).end();
    });
};


/* UPLOAD QUIZ - Function to upload a quiz --------------------------------- */
function uploadQuiz(req, res, next) {
    let context = {};

    // Parse the body as JSON
    let quizUpload = JSON.parse(req.body.quiz);

    // Save new object to database collection and associate to employee
    if (quizUpload.quiz.questions.length !== 0) {
        Employer.find({email: req.user.email}).exec()
        .then(doc => {
            // Create a new quiz instance
            const saved_quiz = new Quiz({
                _id: new mongoose.Types.ObjectId,
                employer_id: doc[0]._id,
                name: quizUpload.quiz.name,
                category: quizUpload.quiz.category,
                timeLimit: quizUpload.quiz.timeLimit,
                questions : quizUpload.quiz.questions
            });

            // Save quiz to database
            saved_quiz.save()
            .then(() => {
                // Return the saved quiz
                context = saved_quiz;
                res.send(context).end();
            })
            .catch(err => {
                console.error(err);
                res.status(500).end();
            });
        })
        .catch(err => {
            console.error(err);
            res.status(404).send(context).end();
        });
    }
    else {
        console.error("No questions in body!!");
        res.send(context).end();
    }
};


/* QUIZZES PAGE ROUTES ----------------------------------------------------- */

router.get('/', checkUserLoggedIn, renderQuizzes);
router.post('/delete', checkUserLoggedIn, deleteQuiz);
router.post('/download', checkUserLoggedIn, downloadQuiz);
router.post('/upload', checkUserLoggedIn, uploadQuiz);

module.exports = router;
