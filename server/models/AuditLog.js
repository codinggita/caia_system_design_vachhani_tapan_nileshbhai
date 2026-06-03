const mongoose = require('mongoose');

// ============================================================
// AUDIT LOG MODEL
// Stores system administration events, user security status shifts, etc.
// ============================================================

const AuditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: [true, 'Please provide an action name'],
      trim: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please specify who performed the action'],
    },
    details: {
      type: String,
      required: [true, 'Please provide log details'],
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AuditLog', AuditLogSchema);
