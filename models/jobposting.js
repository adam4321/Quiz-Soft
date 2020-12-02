/******************************************************************************
**  Description:  Mongodb / Mongoose data model for the Job Posting entity
******************************************************************************/

const { ObjectId, Int32 } = require('mongodb');
const mongoose = require('mongoose');
const Quiz = require('./quiz.js');

const jobpostingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employer_id: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    messageText: String,
    associatedQuiz : [{
        quiz: Quiz.schema
    }],
    quizResponses : [{
        quiz_response_id : mongoose.Schema.Types.ObjectId,
        quiz_id : mongoose.Schema.Types.ObjectId,
        candidate_id : mongoose.Schema.Types.ObjectId,
        candidate_email : String,
        candidateAnswers: [[String]],
        quizComment: String,
        quizEpochTime: Number,
        quizTotalTime: Number,
        quizScore: mongoose.Schema.Types.Decimal128
    }]
});

module.exports = mongoose.model('JobPosting', jobpostingSchema);
