const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Generates JWT token for the authenticated admin
 * @param {string} id Admin MongoDB ObjectId
 * @returns {string} Signed JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Token expires in 30 days
  });
};

// @desc    Auth Admin & Get Token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Find admin by email
  const admin = await Admin.findOne({ email: email.toLowerCase() });

  if (admin && (await bcrypt.compare(password, admin.password))) {
    res.status(200).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id)
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get Admin profile (verify active login status)
// @route   GET /api/auth/profile
// @access  Private
const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select('-password');
  if (admin) {
    res.status(200).json(admin);
  } else {
    res.status(404);
    throw new Error('Admin not found');
  }
});

// @desc    Upload Principal Signature
// @route   PUT /api/auth/signature
// @access  Private
const uploadSignature = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please select a signature image file to upload.');
  }

  const { uploadAndOptimize } = require('../utils/cloudinaryUpload');

  // Upload to branding folder without face cropping
  const uploadResult = await uploadAndOptimize(req.file.buffer, {
    folder: 'br-school/branding',
    isStudentPhoto: false
  });

  const admin = await Admin.findById(req.admin._id);
  if (!admin) {
    res.status(404);
    throw new Error('Admin not found');
  }

  admin.signatureUrl = uploadResult.url;
  await admin.save();

  res.status(200).json({
    message: 'Principal signature uploaded successfully',
    signatureUrl: admin.signatureUrl
  });
});

// @desc    Delete Principal Signature
// @route   DELETE /api/auth/signature
// @access  Private
const deleteSignature = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id);
  if (!admin) {
    res.status(404);
    throw new Error('Admin not found');
  }

  admin.signatureUrl = '';
  await admin.save();

  res.status(200).json({
    message: 'Principal signature removed successfully',
    signatureUrl: ''
  });
});

module.exports = {
  loginAdmin,
  getAdminProfile,
  uploadSignature,
  deleteSignature
};
