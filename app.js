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
    console.log('Request body:', req.body);


    // Log received username and password
    console.log('Received username:', username);
    console.log('Received password:', password);

    try {
        if (!password || typeof password !== 'string') {
            return res.status(400).send('Invalid password');
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });

        await newUser.save();

        res.send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});




app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).send('Invalid username or password');
        }

        console.log('User found:', user);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        console.log('Password provided:', password);
        console.log('Password from DB:', user.password);
        console.log('Password comparison result:', isPasswordValid);

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
