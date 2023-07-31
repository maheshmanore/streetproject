// app.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};




// Connect to MongoDB (replace 'your_mongodb_uri' with your actual MongoDB connection string)
mongoose.connect('mongodb+srv://ashwinsapkale58:tQFMHvAvaCSsXOrh@cluster0.c9gtdg1.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Models
// const User = require('./models/User');
const checkAuthentication = (req, res, next) => {
    if (req.session.userId) {
      next(); // User is authenticated
    } else {
      res.redirect('/'); // Redirect to login page if not authenticated
    }
  };
// // Middleware
// app.use(express.static('public'));
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/views/index.html');
//   });
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({
//   secret: generateSecretKey(), // Replace with a strong secret key
//   resave: false,
//   saveUninitialized: true,
// }));



// app.js (continued)
// ... (previously defined code)

// POST route for user registration
// app.post('/register', async (req, res) => {
//     const { username, password } = req.body;
  
//     try {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const user = new User({ username, password: hashedPassword });
//       await user.save();
//       req.session.userId = user._id;
//       res.redirect('/dashboard');
//     } catch (err) {
//       res.status(500).send('Error registering user');
//     }
//   });
  
//   // POST route for user login
//   app.post('/login', async (req, res) => {
//     const { username, password } = req.body;
  
//     try {
//       const user = await User.findOne({ username });
  
//       if (!user) {
//         return res.status(404).send('User not found');
//       }
  
//       const isPasswordValid = await bcrypt.compare(password, user.password);
  
//       if (!isPasswordValid) {
//         return res.status(401).send('Invalid password');
//       }
  
//       req.session.userId = user._id;
//       res.redirect('/dashboard');
//     } catch (err) {
//       res.status(500).send('Error logging in');
//     }
//   });
  
//   // GET route for user logout
//   app.get('/logout', (req, res) => {
//     req.session.destroy(err => {
//       if (err) {
//         return res.status(500).send('Error logging out');
//       }
//       res.redirect('/');
//     });
//   });
  

//   // Dashboard route accessible only after authentication
//   app.get('/dashboard', checkAuthentication, (req, res) => {
//     res.sendFile(__dirname + '/public/views/dashboard.html');
//   });
  
//  // Route for authentication check
// app.get('/check-auth', (req, res) => {
//     if (req.session.userId) {
//       res.status(200).send(); // User is authenticated
//     } else {
//       res.status(401).send(); // User is not authenticated
//     }
//   });




const authRoutes = require('./routes/authroutes');
const dashboardRoutes = require('./routes/dashboardroutes');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: generateSecretKey(),
  resave: false,
  saveUninitialized: true,
}));

// Use route files as middleware
app.use('/', authRoutes);
app.use('/dashboard', checkAuthentication, dashboardRoutes);



  
// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
