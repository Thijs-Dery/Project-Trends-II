const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/LoginDB', { useNewUrlParser: true, useUnifiedTopology: true });

const eventSchema = new mongoose.Schema({
    title: String,
    start: Date,
    end: Date,
    description: String,
    userId: mongoose.Schema.Types.ObjectId
});

const Event = mongoose.model('Event', eventSchema);

const accountSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const Account = mongoose.model('Account', accountSchema);

app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Middleware to check if the user is logged in
function checkAuth(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const account = await Account.findOne({ username, password });
    if (account) {
        req.session.userId = account._id;
        res.send('Logged in');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.send('Logged out');
});

app.post('/events', checkAuth, async (req, res) => {
    const { title, start, end, description } = req.body;
    const event = new Event({
        title,
        start,
        end,
        description,
        userId: req.session.userId
    });
    await event.save();
    res.send('Event created');
});

app.get('/events', checkAuth, async (req, res) => {
    const events = await Event.find({ userId: req.session.userId });
    res.json(events);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

