// routes/poles.js

const express = require('express');
const router = express.Router();
const Pole = require('../models/data');
const twilio = require('twilio');

const nodemailer = require('nodemailer');

const accountSid = 'AC4eafb4c3d28a6aafa976aff7d53497cf';
const authToken = '4ac5a1046cbaf59967a4a0d817abbdea';
const twilioPhoneNumber = '+17864041745'; 

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// GMail Service
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'careerjadu@gmail.com',
    pass: 'tnsinxcdhhfjxoqs'
  }
});

// Get all poles
router.get('/', async (req, res) => {
  try {
    const poles = await Pole.find();
    res.json(poles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new pole
router.post('/create', async (req, res) => {
  const pole = new Pole({
    poleId: req.body.poleId,
    geolocation: req.body.geolocation,
    status: req.body.status
  });

  try {
    const newPole = await pole.save();
    res.status(201).json(newPole);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.put('/update/:id/:status', async (req, res) => {
  try {
    const { id, status } = req.params;

    const pole = await Pole.findOne({ poleId: id });
    if (!pole) {
      return res.status(404).json({ message: 'Pole not found' });
    }

    // Update status
    pole.status = status;

    const updatedPole = await pole.save();

    if (status === 'inactive') {
      const [lat, lng] = pole.geolocation.split(',').map(parseFloat);
      const mapsUrl = `https://maps.google.com?q=${lat},${lng}`;

      // client.messages
      // .create({
      //   body: `Pole ID: ${updatedPole.poleId} - Location: ${updatedPole.geolocation} - Status: ${updatedPole.status} - View location: ${mapsUrl}`,
      //   from: twilioPhoneNumber,
      //   to: '+918329321333' // Replace with recipient's phone number
      // })
      // .then(message => console.log(`SMS sent with SID: ${message.sid}`))
      // .catch(error => console.error('Error sending SMS:', error));

      const mailOptions = {
        from: {
          name: 'Street Light Status',
          address: 'careerjadu@gmail.com'
        },
        to: 'maheshmanore048@gmail.com',
        subject: 'Pole Status Alert',
        html: `
          <h1>Pole Status</h1>
          <h2>Pole ID: ${updatedPole.poleId}</h2>
          
          <h2>Status: ${updatedPole.status}</h2>
          <a href="${mapsUrl}" target="_blank">View Pole Location</a>
        `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    }
    req.io.emit('poleUpdate', updatedPole);
    res.json(updatedPole);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



module.exports = router;
