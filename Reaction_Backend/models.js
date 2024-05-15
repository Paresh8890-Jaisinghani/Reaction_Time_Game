const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    ReactionTimeScore1: { type: Number, required: true },
    ReactionTimeScore2: { type: Number, required: true },
    ReactionTimeScore3: { type: Number, required: true },
    phonenumber :{type :String}
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
