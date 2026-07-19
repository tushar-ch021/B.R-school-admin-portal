const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { collectFee, getFeeHistoryByStudent, getDashboardStats } = require('../controllers/feeController');
const { protect } = require('../middleware/authMiddleware');
const { validateFields } = require('../middleware/validationMiddleware');

const collectFeeValidationRules = [
  body('studentId').notEmpty().withMessage('Student ID is required').isMongoId().withMessage('Invalid student database key'),
  body('academicYear').notEmpty().withMessage('Academic year is required').trim(),
  body('paymentMode').isIn(['Cash', 'Cheque', 'DD', 'Online', 'UPI']).withMessage('Invalid payment mode option'),
  body('feeItems').isArray({ min: 1 }).withMessage('At least one fee item must be specified'),
  body('feeItems.*.particular').notEmpty().withMessage('Particular title is required').trim(),
  body('feeItems.*.dues').isNumeric().withMessage('Dues must be numeric').toFloat(),
  body('feeItems.*.received').isNumeric().withMessage('Received amount must be numeric').toFloat()
];

// Fee collection entry
router.post('/collect', protect, collectFeeValidationRules, validateFields, collectFee);

// Student ledger logs
router.get('/student/:studentId', protect, getFeeHistoryByStudent);

// Dashboard aggregate statistics (Total Students, Transport, Monthly Collected)
router.get('/dashboard-stats', protect, getDashboardStats);

module.exports = router;
