// statusRoutes.js

const express = require('express');
const router = express.Router();
const Status = require('../models/status'); // Import the Status model

// Route to toggle the status
router.put('/status', async (req, res) => {
  try {
    // Find the first status record
    let currentStatus = await Status.findOne();

    // If a status record exists, toggle its status value
    if (currentStatus) {
      currentStatus.status = currentStatus.status === 'active' ? 'inactive' : 'active';
      await currentStatus.save(); // Save the updated status
      res.json({ status: currentStatus.status }); // Respond with the updated status
    } else {
      // If no status record exists, respond with an error message
      res.status(404).json({ message: 'Status not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get the current status
router.get('/checksystem', async (req, res) => {
  try {
    const currentStatus = await Status.findOne(); // Find the first status record
    res.json({ status: currentStatus ? currentStatus.status : 'inactive' }); // Respond with the current status or 'inactive' if none found
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
