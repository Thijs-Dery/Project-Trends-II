const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const atlasURI = 'mongodb+srv://admin:admin@cluster0.v4tqvzo.mongodb.net/LoginDB';
mongoose.connect(atlasURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('accounts', userSchema);

const eventSchema = new mongoose.Schema({
    title: String,
    start: Date,
    end: Date,
    description: String
});
const Event = mongoose.model('events', eventSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!password || typeof password !== 'string') {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });

        await newUser.save();

        return res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Calendar routes
app.get('/main', (req, res) => {
    const filePath = path.join(__dirname, 'main.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(err.status || 500).send('Internal Server Error');
        }
    });
});

// Create event
app.post('/events', async (req, res) => {
    try {
        const { title, start, end, description } = req.body;

        // Create a new event instance
        const event = new Event({
            title,
            start: new Date(start), // Convert start date string to Date object
            end: new Date(end),     // Convert end date string to Date object
            description
        });

        // Save the event to the database
        await event.save();

        res.status(201).send(event);
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(400).send(error);
    }
});

// Get all events
app.get('/events', async (req, res) => {
    try {
        const events = await Event.find();
        res.send(events);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update event
app.put('/events/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) {
            return res.status(404).send();
        }
        res.send(event);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete event
app.delete('/events/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).send();
        }
        res.send(event);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
