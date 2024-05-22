const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const MONGO_URL = 'mongodb://127.0.0.1:27017';
const dbName = 'postings';

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json()); // Middleware to parse JSON bodies

let db;
app.use(express.static(path.join(__dirname, '../frontend/build')));

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(MONGO_URL, { useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    db = client.db(dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process if the database connection fails
  }
}

connectToDatabase();

app.post('/api/posts', async (req, res) => {
  try {
    console.log('Incoming request body:', req.body); // Debugging statement
    const collection = db.collection('posts');
    const { name, email, text } = req.body;

    if (!name || !email || !text) {
      return res.status(400).json({ error: 'Name, email, and text are required' });
    }

    await collection.insertOne({ name, email, text });
    console.log('Post added successfully');
    res.status(201).json({ message: 'Post added successfully' });
  } catch (error) {
    console.error('Error adding post:', error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to add post' });
  }
});


app.get('/api/posts', async (req, res) => {
  try {
    const collection = db.collection('posts');
    const posts = await collection.find({}).toArray();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
