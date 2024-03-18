
const mongoose = require('mongoose');

// Define the schema for the status model
const statusSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive' // Default value if not provided
  }
});

// Create the Status model based on the schema
const Status = mongoose.model('Status', statusSchema);

module.exports = Status;