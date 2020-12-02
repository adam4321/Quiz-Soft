/******************************************************************************
**  Description: GRAPHIC PAGE - server side node.js routes
**
**  Root path:  localhost:3500/graphic
**
**  Contains:   /
**  
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn             
******************************************************************************/

const express = require('express');
const router = express.Router();

// Get Schemas
const JobPosting = require('../models/jobposting.js');
const Quiz = require('../models/quiz.js');
const { ObjectId } = require('mongodb');


/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


/* GENERATE BINS - Function to return an object of frequencies of unique properties from raw data array --------------- */
function generateBins(data) {
    let result = {};
    //calculate frequencies of each unique property in array
    for(let j = 0; j < data.length; ++j) {
        if(!result[data[j]])
            result[data[j]] = 0;
        ++result[data[j]];
    };    
    return result;
};


/* GRAPHIC PAGE - Function to render user's ranking page ------------------- */
function renderGraphic(req, res, next) {
    let context = {};

    // Find object with id from jobpostings data model
    JobPosting.findOne({'_id': ObjectId(req.query.id)}).lean().exec()
    .then(doc => {
        // Add the Job Posting title to context
        context.title = doc.title;

        // Add the Job Posting _id to context
        context._id = doc._id;

        // Add the quiz name to context
        context.quiz_name = doc.associatedQuiz[0].quiz.name;

        // Send initial rankings to context
        context.rankings = doc.quizResponses;

        // Send total number of responses to context
        context.num_of_rankings = Object.keys(doc.quizResponses).length;

        res.render("graphic-page", context);
    })
    .catch(err => {
        console.error(err);
        res.status(500).render("graphic-page", context);
    });
};


/* COMPILE DATA FROM RESPONSES - Function to render user's ranking page ------------------- */
function compileResponses(req, res, next) {
    let job_id = req.body.job_id;

    // Query job posting again to develop the JSON object of responses (time and scores for each user)
    JobPosting.findOne({'_id': ObjectId(job_id)}).lean().exec()
    .then(doc => {

        // Capture data values from each response and put into arrays
        let parsed_time_data = [];
        let parsed_score_data = [];
        let parsed_data = {};
        let raw_data = doc.quizResponses;
        let raw_data_length = Object.keys(raw_data).length;
        for (let i = 0; i < raw_data_length; i++){
            parsed_time_data.push(raw_data[i].quizTotalTime);
            parsed_score_data.push(JSON.parse('{"score": '+Math.round(raw_data[i].quizScore)+'}'));
        };

        // Calculate frequencies for time
        let time_obj = generateBins(parsed_time_data);
        
        // Build the data object to pass to the client
        parsed_data.times = time_obj;
        parsed_data.scores = parsed_score_data;
        parsed_data.total_responses = raw_data_length;

        //Send data to the client
        const candidate_data = parsed_data;
        res.send({ graphic_data: candidate_data})
    })
    .catch(err => {
        console.error(err);
        res.status(500).render("graphic-page", context);
    });
};


/* RANKING PAGE ROUTES ---------------------------------------------------- */

router.get('/', checkUserLoggedIn, renderGraphic);
router.post('/', checkUserLoggedIn, compileResponses);

module.exports = router;
