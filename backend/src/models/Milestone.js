import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Paid'],
    default: 'Pending'
  },
  photoProof: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  },
  paidAt: {
    type: Date,
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

export default mongoose.model('Milestone', milestoneSchema);