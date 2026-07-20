const FeePayment = require('../models/FeePayment');
const Student = require('../models/Student');
const { generateReceiptNo } = require('../utils/serialNoGenerator');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Record a new fee collection payment
// @route   POST /api/fees/collect
// @access  Private
const collectFee = asyncHandler(async (req, res) => {
  const {
    studentId,
    academicYear,
    feeItems,
    paymentMode,
    bankDetails,
    payableAt,
    remark
  } = req.body;

  if (!studentId || !feeItems || !feeItems.length) {
    res.status(400);
    throw new Error('Student ID and at least one fee item is required');
  }

  const student = await Student.findById(studentId);
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // Pre-calculate dues, received, balances for validation
  let totalDues = 0;
  let totalReceived = 0;
  let totalBalance = 0;

  const processedFeeItems = feeItems.map((item) => {
    const dues = Number(item.dues) || 0;
    const received = Number(item.received) || 0;
    const balance = dues - received;

    totalDues += dues;
    totalReceived += received;
    totalBalance += balance;

    return {
      particular: item.particular,
      dueDate: item.dueDate || new Date(),
      dues,
      received,
      balance
    };
  });

  // Generate atomic receipt ID sequence
  const receiptNo = await generateReceiptNo(academicYear);

  const feePayment = await FeePayment.create({
    student: studentId,
    receiptNo,
    receiptDate: new Date(),
    academicYear,
    feeItems: processedFeeItems,
    totalDues,
    totalReceived,
    totalBalance,
    paymentMode,
    bankDetails: paymentMode !== 'Cash' ? bankDetails : undefined,
    payableAt: payableAt || '',
    remark: remark || '',
    collectedBy: req.admin._id
  });

  // Populate references for the receipt preview
  const populatedPayment = await FeePayment.findById(feePayment._id)
    .populate('student')
    .populate('collectedBy', 'name email');

  res.status(201).json(populatedPayment);
});

// @desc    Get fee transaction records by Student ID
// @route   GET /api/fees/student/:studentId
// @access  Private
const getFeeHistoryByStudent = asyncHandler(async (req, res) => {
  const payments = await FeePayment.find({ student: req.params.studentId })
    .populate('collectedBy', 'name')
    .sort({ receiptDate: -1 });

  res.status(200).json(payments);
});

// @desc    Update a student's assigned total fee / fee structure
// @route   PUT /api/fees/student/:studentId/update-dues
// @access  Private
const updateStudentDues = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { tuitionFee, transportFee } = req.body;

  const student = await Student.findById(studentId);
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const parsedTuition = tuitionFee !== undefined ? Math.max(0, Number(tuitionFee) || 0) : (student.tuitionFee ?? 0);
  const parsedTransport = transportFee !== undefined ? Math.max(0, Number(transportFee) || 0) : (student.transportFee ?? 0);

  student.tuitionFee = parsedTuition;
  student.transportFee = parsedTransport;
  student.totalFee = parsedTuition + (student.usesTransport ? parsedTransport : 0);

  await student.save();

  // Compute total paid across all historical FeePayments
  const payments = await FeePayment.find({ student: studentId });
  const totalPaid = payments.reduce((sum, p) => sum + (Number(p.totalReceived) || 0), 0);
  const remainingBalance = student.totalFee - totalPaid;

  res.status(200).json({
    success: true,
    message: 'Student fee structure updated successfully',
    student,
    feeSummary: {
      currentTotalFee: student.totalFee,
      tuitionFee: student.tuitionFee,
      transportFee: student.usesTransport ? student.transportFee : 0,
      totalPaid,
      remainingBalance
    }
  });
});

// @desc    Get single source of truth fee summary for a student
// @route   GET /api/fees/student/:studentId/summary
// @access  Private
const getStudentFeeSummary = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findById(studentId);
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const tuition = student.tuitionFee !== undefined ? student.tuitionFee : 0;
  const transport = student.transportFee !== undefined ? student.transportFee : 0;
  const currentTotalFee = tuition + (student.usesTransport ? transport : 0);

  const payments = await FeePayment.find({ student: studentId });
  
  let paidTuition = 0;
  let paidTransport = 0;
  let totalPaid = 0;

  payments.forEach((payment) => {
    totalPaid += (Number(payment.totalReceived) || 0);
    if (payment.feeItems && Array.isArray(payment.feeItems)) {
      payment.feeItems.forEach((item) => {
        if (item.particular === 'Tuition Fee') {
          paidTuition += (Number(item.received) || 0);
        } else if (item.particular === 'Transport Fee') {
          paidTransport += (Number(item.received) || 0);
        }
      });
    }
  });

  const remainingTuition = Math.max(0, tuition - paidTuition);
  const remainingTransport = student.usesTransport ? Math.max(0, transport - paidTransport) : 0;
  const remainingBalance = currentTotalFee - totalPaid;

  res.status(200).json({
    studentId: student._id,
    currentTotalFee,
    tuitionFee: tuition,
    transportFee: student.usesTransport ? transport : 0,
    paidTuition,
    paidTransport,
    totalPaid,
    remainingTuition,
    remainingTransport,
    remainingBalance,
    usesTransport: student.usesTransport
  });
});

// @desc    Fetch dashboard statistics
// @route   GET /api/fees/dashboard-stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const { className, section } = req.query;

  // 1. Total Active Students (conditional class and section filter)
  const studentQuery = { isActive: true, isRemoved: { $ne: true } };
  if (className) {
    studentQuery.class = className;
  }
  if (section) {
    studentQuery.section = section;
  }
  const totalStudents = await Student.countDocuments(studentQuery);

  // 2. Active Students this current academic cycle
  const date = new Date();
  const currentYear = date.getFullYear();
  const academicCycle = `${currentYear}-${currentYear + 1}`;
  const yearQuery = { isActive: true, isRemoved: { $ne: true }, academicYear: academicCycle };
  if (className) {
    yearQuery.class = className;
  }
  if (section) {
    yearQuery.section = section;
  }
  const studentsThisYear = await Student.countDocuments(yearQuery);

  // 3. Active Students using transport routes
  const transportQuery = { isActive: true, isRemoved: { $ne: true }, usesTransport: true };
  if (className) {
    transportQuery.class = className;
  }
  if (section) {
    transportQuery.section = section;
  }
  const transportStudents = await Student.countDocuments(transportQuery);

  // 4. Monthly Fee collected sum (filter by student class and section via aggregate lookup join)
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const pipeline = [
    {
      $match: {
        receiptDate: { $gte: startOfMonth }
      }
    }
  ];

  if (className || section) {
    const matchCriteria = {};
    if (className) matchCriteria['studentInfo.class'] = className;
    if (section) matchCriteria['studentInfo.section'] = section;

    pipeline.push(
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      // Use preserveNullAndEmptyArrays so payments from deleted students aren't silently discarded
      { $unwind: { path: '$studentInfo', preserveNullAndEmptyArrays: true } },
      { $match: matchCriteria }
    );
  }

  pipeline.push({
    $group: {
      _id: null,
      monthlyCollected: { $sum: '$totalReceived' }
    }
  });

  const aggregation = await FeePayment.aggregate(pipeline);
  const monthlyFeeCollected = aggregation.length > 0 ? aggregation[0].monthlyCollected : 0;

  // 5. Recent 5 admissions listings
  const recentQuery = { isActive: true, isRemoved: { $ne: true } };
  if (className) {
    recentQuery.class = className;
  }
  if (section) {
    recentQuery.section = section;
  }
  const recentAdmissions = await Student.find(recentQuery)
    .sort({ createdAt: -1 })
    .limit(5)
    .select('serialNo firstName lastName class section photo.thumbnailUrl admissionDate');

  res.status(200).json({
    totalStudents,
    studentsThisYear,
    transportStudents,
    monthlyFeeCollected,
    recentAdmissions
  });
});

module.exports = {
  collectFee,
  getFeeHistoryByStudent,
  updateStudentDues,
  getStudentFeeSummary,
  getDashboardStats
};
