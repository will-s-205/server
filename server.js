const express = require('express');
const app = express();
const cors = require('cors');
const mongooseDB = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const userCreds = require('./user.model');

dotenv.config({ path: path.resolve(__dirname, '.env') });
app.use(express.json());

// app.use(cors({ origin: 'https://login.rigo205.repl.co/' }));
// OR
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Max-Age', 1728000); // WORKS?
  next();
});
// OTHER OPTIONS
// add_header 'Access-Control-Allow-Origin' '*';
// add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, DELETE, HEAD';
// add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
// add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';

// Connect to MongoDB using Mongoose
mongooseDB.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true, // not supported
});

// INITALL DEBUGGING
app.get('/', (req, res) => {
  res.json({ message: 'API endpoint is working!' });
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
