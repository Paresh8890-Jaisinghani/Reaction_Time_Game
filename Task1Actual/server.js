const express = require('express');
const mongoose = require('mongoose');
const Score = require('./models.js');
const cors = require('cors')

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;


mongoose.connect('mongodb://localhost:27017/test', {
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
    const ReactionTimeScore  = req.body
    const phonenumber = req.body
    try {
        const newScore = new Score({ReactionTimeScore,phonenumber});
        await newScore.save();
        res.status(201).json(newScore);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.get('/api/scores', async (req, res) => {
    try {
        const scores = await Score.find();
        res.json(scores);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
