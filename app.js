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
    description: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'accounts' } // Reference to the user
});
const Event = mongoose.model('events', eventSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

        return res.status(200).json({ message: 'User registered successfully', userId: newUser._id });
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

        return res.status(200).json({ message: 'Login successful', userId: user._id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve main.html file
app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

// Create event
app.post('/events', async (req, res) => {
    try {
        const { title, start, end, description, userId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ error: 'Invalid user ID' });
        }

        // Create a new event instance
        const event = new Event({
            title,
            start: new Date(start), // Convert start date string to Date object
            end: new Date(end),     // Convert end date string to Date object
            description,
            userId: new mongoose.Types.ObjectId(userId) // Correct way to create ObjectId
        });

        // Save the event to the database
        await event.save();

        res.status(201).send(event);
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(400).send(error);
    }
});

// Get all events for a user
app.get('/events', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ error: 'Invalid user ID' });
        }

        const events = await Event.find({ userId: new mongoose.Types.ObjectId(userId) });
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

