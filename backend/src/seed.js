/**
 * Seed script - populates the DB with demo data.
 * Run with: node src/seed.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

import User from './models/User.js';
import Project from './models/Project.js';
import MaterialLog from './models/MaterialLog.js';
import Milestone from './models/Milestone.js';
import Fundi from './models/Fundi.js';
import Permit from './models/Permit.js';
import Activity from './models/Activity.js';

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB...');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    MaterialLog.deleteMany({}),
    Milestone.deleteMany({}),
    Fundi.deleteMany({}),
    Permit.deleteMany({}),
    Activity.deleteMany({})
  ]);
  console.log('Cleared existing data...');

  // Create demo user
  const user = await User.create({
    name: 'David Karanja',
    email: 'david@example.com',
    password: 'password123',
    phone: '+254 712 345 678',
    role: 'Homeowner'
  });

  // Create demo project
  const project = await Project.create({
    name: 'Kitengela Family Home',
    location: 'Kitengela, Kajiado',
    budget: 4500000,
    spent: 1200000,
    status: 'In Progress',
    completionDate: '2025-12-15',
    owner: user._id,
    budgetAllocation: { materials: 65, labor: 20, compliance: 10, miscellaneous: 5 },
    spendingHistory: [
      { month: 'Jan', budget: 750000, spent: 400000 },
      { month: 'Feb', budget: 750000, spent: 300000 },
      { month: 'Mar', budget: 750000, spent: 200000 },
      { month: 'Apr', budget: 750000, spent: 150000 },
      { month: 'May', budget: 750000, spent: 100000 },
      { month: 'Jun', budget: 750000, spent: 50000 }
    ]
  });

  // Material logs
  await MaterialLog.insertMany([
    { project: project._id, date: '2024-11-20', item: 'Cement (Bamburi)', quantity: 50, unit: 'Bags', cost: 37500, verified: true, addedBy: user._id },
    { project: project._id, date: '2024-11-21', item: 'River Sand', quantity: 1, unit: 'Lorry', cost: 15000, verified: true, addedBy: user._id },
    { project: project._id, date: '2024-11-22', item: 'Steel Rods (D10)', quantity: 20, unit: 'Pieces', cost: 28000, verified: false, addedBy: user._id },
    { project: project._id, date: '2024-11-23', item: 'Ballast (13mm)', quantity: 2, unit: 'Lorries', cost: 22000, verified: true, addedBy: user._id },
  ]);

  // Milestones
  await Milestone.insertMany([
    { project: project._id, title: 'Foundation & Footing', description: 'Excavation, leveling and concrete pouring for foundation.', cost: 450000, status: 'Paid', photoProof: 'https://picsum.photos/400/200?random=1', order: 1 },
    { project: project._id, title: 'Wall Plate & Lintels', description: 'Masonry work up to the roof level.', cost: 600000, status: 'Approved', photoProof: 'https://picsum.photos/400/200?random=2', order: 2 },
    { project: project._id, title: 'Roofing Structure', description: 'Timber structure and iron sheets / tiles.', cost: 850000, status: 'Pending', order: 3 },
    { project: project._id, title: 'Electrical & Plumbing Rough-in', description: 'Wiring conduits and pipe laying before wall finishing.', cost: 300000, status: 'Pending', order: 4 },
  ]);

  // Permits
  await Permit.insertMany([
    { project: project._id, name: 'NCA Project Registration', status: 'Approved', agency: 'NCA', renewalDate: 'Permanent' },
    { project: project._id, name: 'NEMA EIA License', status: 'Approved', agency: 'NEMA', renewalDate: 'Permanent' },
    { project: project._id, name: 'County Building Approval', status: 'Applied', agency: 'County' },
    { project: project._id, name: 'Public Health Certificate', status: 'Pending', agency: 'County' },
  ]);

  // Fundis
  await Fundi.insertMany([
    { name: 'Jared Onyango', category: 'Plumber', rating: 4.8, reviews: 124, verified: true, avatar: 'https://picsum.photos/100/100?random=10', phone: '+254 700 111 222', location: 'Nairobi' },
    { name: 'Mary Wanjiku', category: 'Mason', rating: 4.9, reviews: 89, verified: true, avatar: 'https://picsum.photos/100/100?random=11', phone: '+254 700 333 444', location: 'Kiambu' },
    { name: 'Stephen Kamau', category: 'Electrician', rating: 4.5, reviews: 56, verified: true, avatar: 'https://picsum.photos/100/100?random=12', phone: '+254 700 555 666', location: 'Thika' },
    { name: 'Patrick Musyoka', category: 'Foreman', rating: 4.7, reviews: 210, verified: false, avatar: 'https://picsum.photos/100/100?random=13', phone: '+254 700 777 888', location: 'Machakos' },
    { name: 'Grace Achieng', category: 'Mason', rating: 4.6, reviews: 43, verified: true, avatar: 'https://picsum.photos/100/100?random=14', phone: '+254 700 999 000', location: 'Kisumu' },
    { name: 'Brian Mwangi', category: 'Electrician', rating: 4.3, reviews: 31, verified: false, avatar: 'https://picsum.photos/100/100?random=15', phone: '+254 700 100 200', location: 'Nairobi' },
  ]);

  // Activities
  await Activity.insertMany([
    { project: project._id, type: 'milestone', title: 'Site Milestone Proof Uploaded', description: 'Foreman uploaded 4 photos for the foundation slab approval.', icon: 'fa-camera', iconColor: 'text-blue-400', performedBy: user._id },
    { project: project._id, type: 'material', title: 'Material Receipt Logged', description: '50 bags of Blue Triangle cement delivered and verified.', icon: 'fa-file-invoice-dollar', iconColor: 'text-green-400', performedBy: user._id },
    { project: project._id, type: 'permit', title: 'NCA Site Visit Scheduled', description: 'NCA official will visit the site this Thursday for inspection.', icon: 'fa-certificate', iconColor: 'text-amber-400', performedBy: user._id },
  ]);

  console.log('✅ Seeded successfully!');
  console.log('Demo credentials:');
  console.log('  Email: david@example.com');
  console.log('  Password: password123');
  mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed error:', err);
  mongoose.disconnect();
  process.exit(1);
});