const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

// User model
const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', UserSchema);

// Middleware to parse JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Handle POST request to /register route
app.post('/register', async (req, res) => {
    const {
        username,
        password
    } = req.body;

    try {
        // Check if username already exists
        const existingUser = await User.findOne({
            username
        });

        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            password: hashedPassword
        });

        // Save new user to the database
        await newUser.save();

        res.send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// Handle POST request to /login route
app.post('/login', async (req, res) => {
    const {
        username,
        password
    } = req.body;

    try {
        // Find user by username in the database
        const user = await User.findOne({
            username
        });

        if (!user) {
            return res.status(401).send('Invalid username or password');
        }

        // Compare hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            res.send('Login successful');
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});