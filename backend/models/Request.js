const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 150,
  },
  department: {
    type: String,
    enum: ['electricity', 'water', 'agriculture', 'law', 'medical', 'services'],
    required: true,
  },
  images: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['raised', 'in-progress', 'completed', 'closed', 'clarification-needed'],
    default: 'raised',
  },
  allocatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  clarificationNeeded: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  statusUpdates: [{
    status: String,
    message: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  alarms: [{
    sentAt: {
      type: Date,
      default: Date.now,
    },
    message: String,
  }],
});

module.exports = mongoose.model('Request', requestSchema);
