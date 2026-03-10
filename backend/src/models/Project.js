import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: 0
  },
  spent: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['Planning', 'In Progress', 'Stalled', 'Completed'],
    default: 'Planning'
  },
  completionDate: {
    type: String,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  budgetAllocation: {
    materials: { type: Number, default: 65 },
    labor: { type: Number, default: 20 },
    compliance: { type: Number, default: 10 },
    miscellaneous: { type: Number, default: 5 }
  },
  spendingHistory: [{
    month: String,
    budget: Number,
    spent: Number
  }]
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);