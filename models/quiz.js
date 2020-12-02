/******************************************************************************
**  Description:  Mongodb / Mongoose data model for the Quiz entity
******************************************************************************/

const mongoose = require('mongoose');

const quizSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employer_id: mongoose.Schema.Types.ObjectId,
    name: String,
    category: String,
    timeLimit: Number,
    questions : [{
        quizQuestion: [String],
        quizAnswers: [String],
        quizKey: [String],
        quizType: String
    }]
});

module.exports = mongoose.model('Quiz', quizSchema);
