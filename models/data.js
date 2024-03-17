const mongoose = require('mongoose');

const poleSchema = new mongoose.Schema({
  poleId: {
    type: Number,
    required: true,
    unique: true
  },
  geolocation: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the 'updatedAt' field before saving or updating the document
poleSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

poleSchema.pre('updateOne', function(next) {
  this._update.updatedAt = new Date();
  next();
});

const Pole = mongoose.model('Pole', poleSchema);

module.exports = Pole;
