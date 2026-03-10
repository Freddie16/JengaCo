import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  type: {
    type: String,
    enum: ['milestone', 'material', 'permit', 'payment', 'general'],
    default: 'general'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'fa-circle-info'
  },
  iconColor: {
    type: String,
    default: 'text-blue-400'
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

export default mongoose.model('Activity', activitySchema);