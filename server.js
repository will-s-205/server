const express = require('express');
const app = express();
const cors = require('cors');
const mongooseDB = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const userCreds = require('./user.model');

dotenv.config({ path: path.resolve(__dirname, '.env') });
app.use(cors());
app.use(express.json());

// Connect to MongoDB using Mongoose
mongooseDB.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true, // not supported
});

// INITALL DEBUGGING
app.get('', (req, res) => {
  res.json({ message: 'API endpoint is working' });
});

// SIGNUP
const signup = '/api/signup';
app.post(signup, async (req, res) => {
  console.log(req.body);
  try {
    const user = await userCreds.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      newsletter: req.body.newsletter,
    });
    res.send({ status: 'ok', message: 'User has been created' });
  } catch (error) {
    console.log(error);
    res.json({ status: 'error', message: error });
  }
});

// Start the server
app.listen(process.env.MONGO_PORT, () => {
  console.log(`Server is running on port ${process.env.MONGO_PORT}`);
});
