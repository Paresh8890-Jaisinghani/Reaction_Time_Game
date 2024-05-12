const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    ReactionTimeScore: { type: Number, required: true },
    phonenumber :{type :String}
});

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
