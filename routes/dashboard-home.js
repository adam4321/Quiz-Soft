/******************************************************************************
**  Description: DASHBOARD HOME - server side node.js routes
**
**  Root path:  localhost:3500/dashboard
**
**  Contains:   /
**              /sendmail
**              /removeAccount
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn        
******************************************************************************/

const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');
const jwt = require('jwt-simple');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
let CRED_ENV;

// Get schemas
const JobPosting = require('../models/jobposting.js');
const Employer = require('../models/employer.js');
const Candidate = require('../models/candidate.js');
const Quiz = require('../models/quiz.js');

// Choose credentials for dev or prod
if (process.env.NODE_ENV === 'production') {
    CRED_ENV = process.env;
} 
else {
    CRED_ENV = require('../credentials.js');
}

// Set up sendgrid
sgMail.setApiKey(CRED_ENV.SENDGRID_API_KEY);

// Debug Flag
let DEBUG = 0;


/* Middleware - Function to Check user is Logged in --------------------------------- */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


/* FIND QUIZZES - Function to query schema that is used more than once on the main dashboard ----------- */
function renderPageFromQuery(req, res, next, context, user_id, emp_new) {
    // Find only job postings for current user (employer)
    JobPosting.find({}).lean().where('employer_id').equals(user_id).exec()
    .then(doc => {
        context.jobposting = doc;
        req.session.jobposting_selected = doc._id;

        // Find all quizzes for the currently logged in user
        Quiz.find({}).lean().where('employer_id').equals(user_id).exec()
        .then(quizzes => {
            // Assign the quiz properties to the context object
            context.quizzes = quizzes;
            if (emp_new === 1) {
                req.session.employer_selected = user_id;
                res.status(201).render("dashboard-home", context);
            }
            else{
                req.session.employer_selected = user_id;
                res.status(200).render("dashboard-home", context);
            }     
        })
        .catch(err => {
            console.error(err);
            res.status(500).render("dashboard-home", context);
        });
    })
    .catch(err => {
        console.error(err);
        res.status(404).render("dashboard-home", context);
    });
}


/* RENDER DASHBOARD / REGISTER USER - Function to render the main dashboard ---------------- */
function renderDashboard(req, res, next) {
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

    // Save new object to database collection
    const emp = new Employer({
        _id: new mongoose.Types.ObjectId,
        email: context.email,
        name: context.name,
        missedMessages: 0,
        jobPostings: []
    });

    // Check if email is already registered in collection/employers
    Employer.find({}).where('email').equals(context.email).exec()
    .then(result => {
        // No email found
        if (result[0] == undefined) {
            emp.save()
            .then(emp_result => {
                context.missedMessages = 0;
                renderPageFromQuery(req, res, next, context, emp_result._id, 1);
            })
            .catch(err => {
                console.error(err);
                res.status(500).render("dashboard-home", context);
            });
        }
        else {
            // Email already exists
            context.missedMessages = result[0].missedMessages;
            renderPageFromQuery(req, res, next, context, result[0]._id, 0);
        }
    })
    .catch(err => {
        console.error(err);
        res.status(500).render("dashboard-home", context);
    });
};


/* SEND LINK - Function send quiz link email to the candidate using SendGrid on the main dashboard --------------- */
function sendQuizLinkEmail(req, res, next, msg) {

    sgMail.send(msg)
    .then(() => {
        res.status(200).redirect('/quiz_soft/dashboard');
    })
    .catch((error) => {
        console.error(error)
        res.status(500).redirect('/quiz_soft/dashboard');
    });
}


/* GENERATE MESSAGE - Function to generate the msg object ------------------ */
function generateMessage(email, cand_id, jobposting_id, quiz, title, message_header, first, last) {
    var payload = { email: email, cand_id: cand_id, jobposting: jobposting_id, quiz: quiz};
    var token = jwt.encode(payload, CRED_ENV.HASH_SECRET);
    let quiz_link = 'https://adamjwright.com/quiz_soft/take_quiz/'+token;
    let message = `<strong>Please click the following link to take the quiz</strong><br>${quiz_link}`;
    let html_message = `Hello ${first} ${last},<br><br>${message_header}<br><br>${message}`;
    let name = 'Invitation to Take ' + title + ' Aptitude Quiz';

    const msg = {
        to: `${email}`,                             // Recepiant
        from:  {
            email: 'noreply.quizsoft@gmail.com',    // Sending address
            name: 'Quiz Soft'                       // Name displayed in inbox
        },
        subject: `${name}`,
        text: `${message}`,
        html: `${html_message}`,
    }

    return msg;
}


/* SUBMIT EMAIL - Function to process quiz parameters and store candidate details in database on the main dashboard -- */
function readEmailForm(req, res, next) {
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let job_arr = req.body.jobposting.split("<,> ");
    let jobposting_id = job_arr[0];
    let title = job_arr[1];
    let message_header = job_arr[2];
    let quiz = job_arr[3];

    // Save new object to database collection
    const cand = new Candidate({
        _id: new mongoose.Types.ObjectId,
        email: email,
        firstName: first,
        lastName: last,
        quizResponseId: []
    });

    if (DEBUG === 0){
        // Check if email is already registered in collection/candidate for jobposting
        Candidate.find({}).where('email').equals(email).exec()
        .then(cand_result => {
            // No email found, add candidate
            if (cand_result[0] == undefined) {
                cand.save()
                .then(result => {
                    let cand_id = cand._id;
                    var msg = generateMessage(email, cand_id, jobposting_id, quiz, title, message_header, first, last);
                    sendQuizLinkEmail(req, res, next, msg);
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).render("dashboard-home", context);
                });
            }
            else {
                var query = JobPosting.findOne(
                    {"quizResponses.candidate_id": ObjectId(cand_result[0]._id)}, 
                    {"quizResponses.$": 1} 
                );
                query.where('_id').equals(ObjectId(jobposting_id));
                query.exec()            
                .then(job_result => {
                    if (job_result === null) {
                        // TODO: Alert employer they have already sent an email to this candidate email

                            // Yes, continue

                            // Email found, but candidate has not submitted response yet for this job posting, add candidate
                            cand.save()
                            .then(result => {
                                let cand_id = cand._id;
                                var msg = generateMessage(email, cand_id, jobposting_id, quiz, title, message_header, first, last);
                                sendQuizLinkEmail(req, res, next, msg);
                            })
                            .catch(err => {
                                console.error(err);
                                res.status(500).render("dashboard-home", context);
                            });

                    }
                    else {
                        // Email already exists and for this job posting and has submitted response
                        let cand_id = cand_result[0]._id
                        var msg = generateMessage(email, cand_id, jobposting_id, quiz, title, message_header);
                        sendQuizLinkEmail(req, res, next, msg);
                    }
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).render("dashboard-home", context);
                });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).render("dashboard-home", context);
        });
    }
    else {
        // Email already exists
        sendQuizLinkEmail(req, res, next, msg);
    }
};


/* DELETE USER - Function to remove a user --------------------------------- */
function removeUser(req, res, next) {
    // Check if email for employer then remove all associated jobpostings quizzes and candiates connected to jobpostings
    Employer.find({}).where('email').equals(req.user.email).exec()
    .then(result => {

        // Query JobPosting for associations to Candidates
        JobPosting.find({employer_id: ObjectId(result[0]._id)}).exec()
        .then(job_data => {
            // Return only unique candidate ids
            function removeDuplicates(data) {
                return data.filter((value, index) => data.indexOf(value) === index);
            };

            var job_delete = [];
            var candidate_delete = [];

            for (let i = 0; i < job_data.length; i++) {
                job_delete.push((job_data[i]._id).toString());

                JobPosting.deleteOne({'_id': ObjectId(job_data[i]._id)});
                for (let j = 0; j < job_data[i].quizResponses.length; j++) {
                    if (job_data[i].quizResponses[j].candidate_id != undefined) {
                        candidate_delete.push((job_data[i].quizResponses[j].candidate_id).toString());
                    }
                }
            }

            var candidate_delete_reduced = removeDuplicates(candidate_delete);

            // Remove job postings  
            JobPosting.deleteMany({_id: {$in: job_delete }}).exec()
            .then(() => {

                // Remove associated candidates with job postings  
                Candidate.deleteMany({_id: {$in: candidate_delete_reduced }}).exec()
                .then(() => {

                    // Remove quizzes
                    Quiz.deleteMany({ employer_id: ObjectId(result[0]._id)}).exec()
                    .then(() => {

                        // Finally remove employer
                        Employer.deleteOne({ '_id': ObjectId(result[0]._id)}).exec()
                        .then(emp_remove =>{
                            // Removal complete
                            res.status(204).json(emp_remove).end();
                        })
                    })
                })
            })
        })
    })
    .catch(err => {
        console.error(err);
        res.status(500).render("dashboard-home", context);
    });
};


/* DASHBOARD PAGE ROUTES --------------------------------------------------- */

router.get('/', checkUserLoggedIn, renderDashboard);
router.post('/sendmail', checkUserLoggedIn, readEmailForm);
router.post('/removeAccount', checkUserLoggedIn, removeUser);

module.exports = router;
