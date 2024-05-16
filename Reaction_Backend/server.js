const express = require('express');
const mongoose = require('mongoose');
const Contact = require('../Reaction_Backend/models.js');
const cors = require('cors')

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;


mongoose.connect('mongodb+srv://Paresh:pareshjaisinghani@cluster0.rxwg4ag.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err.message);
    });

app.use(express.json());

app.post('/api/scores', async (req, res) => {
    const { ReactionTimeScore1, ReactionTimeScore2, ReactionTimeScore3, phonenumber } = req.body;
    try {
        // Check if the phone number exists in the database
        let contact = await Contact.findOne({ number: phonenumber });

        if (!contact) {
            // If the phone number doesn't exist, send a specific response
            return res.status(404).json({ message: "Wrong code Entered" });
        }

        // If the phone number exists, update the scores
        contact.ReactionTimeScore1 = ReactionTimeScore1;
        contact.ReactionTimeScore2 = ReactionTimeScore2;
        contact.ReactionTimeScore3 = ReactionTimeScore3;

        // Save the contact (whether it's a new one or existing with updated scores)
        await contact.save();
        
        res.status(201).json(contact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



app.get('/api/scores', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});