import Fundi from '../models/Fundi.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// GET /api/fundis
export const getFundis = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } }
    ];
  }
  if (category) filter.category = category;

  const fundis = await Fundi.find(filter).sort({ rating: -1, reviews: -1 });
  res.json({ fundis });
});

// POST /api/fundis
export const createFundi = asyncHandler(async (req, res) => {
  const { name, category, phone, location, bio, avatar } = req.body;

  const fundi = await Fundi.create({
    name,
    category,
    phone: phone || '',
    location: location || '',
    bio: bio || '',
    avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e3a5f&color=fff`,
    rating: 0,
    reviews: 0,
    verified: false,
    user: req.user._id
  });

  res.status(201).json({ fundi });
});