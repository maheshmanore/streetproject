// app.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

const router  = require('./routes/pole');
const crypto = require('crypto');
const path = require('path');


const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};




// Connect to MongoDB (replace 'your_mongodb_uri' with your actual MongoDB connection string)
mongoose.connect('mongodb+srv://maheshmanore048:LrLkOVhHQ6j92F7x@cluster0.zwt81ng.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
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

const authRoutes = require('./routes/authroutes');
const dashboardRoutes = require('./routes/dashboardroutes');
const statusroute = require('./routes/statusroute');

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
app.use('/poles', (req, res, next) => {
  req.io = io; // Attach the io object to the request object
  router(req, res, next); // Call the router with the modified request object
});
app.use('/dashboard', checkAuthentication, dashboardRoutes);
app.use('/system', statusroute);



  
// Start the server
const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

io.on('connection', socket => {
  console.log('A client connected');

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});
