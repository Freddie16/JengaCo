import mongoose from 'mongoose';

const permitSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Applied', 'Approved'],
    default: 'Pending'
  },
  agency: {
    type: String,
    enum: ['NEMA', 'NCA', 'County'],
    required: true
  },
  renewalDate: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model('Permit', permitSchema);