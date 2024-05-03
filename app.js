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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});