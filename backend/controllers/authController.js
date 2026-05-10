const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      token: generateToken(admin._id),
      admin: { id: admin._id, email: admin.email, role: admin.role },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verify = async (req, res) => {
  try {
    const productCount = await require('mongoose').model('Product').countDocuments();
    const categories = await require('mongoose').model('Product').distinct('category');
    const recentProducts = await require('mongoose').model('Product').find().sort({ createdAt: -1 }).limit(5);

    res.json({
      authenticated: true,
      admin: { id: req.admin._id, email: req.admin.email, role: req.admin.role },
      productCount,
      categories,
      recentProducts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login, verify };
