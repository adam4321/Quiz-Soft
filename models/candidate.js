/******************************************************************************
**  Description:  Mongodb / Mongoose data model for the Candidate entity
******************************************************************************/

const mongoose = require('mongoose');

const candidateSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    firstName: String,
    lastName: String,
    quizResponseId: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model('Candidate', candidateSchema);
