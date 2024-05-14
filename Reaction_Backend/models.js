const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    ReactionTimeScore: { type: Number, required: true },
    phonenumber :{type :String}
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
