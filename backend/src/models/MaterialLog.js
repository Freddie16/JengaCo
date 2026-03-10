import mongoose from 'mongoose';

const materialLogSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  item: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    default: 'Units'
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  photoUrl: {
    type: String,
    default: ''
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

export default mongoose.model('MaterialLog', materialLogSchema);