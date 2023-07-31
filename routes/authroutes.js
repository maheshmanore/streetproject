const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const path = require('path');
const User = require('../models/User');



router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/index.html'));
  });


  router.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword });
      await user.save();
      req.session.userId = user._id;
      res.redirect('/dashboard');
    } catch (err) {
      res.status(500).send('Error registering user');
    }
  });
  
  // POST route for user login
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).send('Invalid password');
      }
  
      req.session.userId = user._id;
      res.redirect('/dashboard');
    } catch (err) {
      res.status(500).send('Error logging in');
    }
  });
  
  // GET route for user logout
  router.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).send('Error logging out');
      }
      res.redirect('/');
    });
  });


  router.get('/check-auth', (req, res) => {
    if (req.session.userId) {
      res.status(200).send(); // User is authenticated
    } else {
      res.status(401).send(); // User is not authenticated
    }
  });

  
  module.exports = router;