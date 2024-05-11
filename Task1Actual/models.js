const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    ReactionTimeScore: { type: Number, required: true },
});

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
