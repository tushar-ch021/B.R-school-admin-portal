const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    serialNo: {
      type: String,
      unique: true,
      required: true
    },
    apaarId: {
      type: String,
      trim: true,
      default: ''
    },
    aadharNo: {
      type: String,
      trim: true,
      default: ''
    },
    nationality: {
      type: String,
      trim: true,
      default: 'Indian'
    },
    fatherQualification: {
      type: String,
      trim: true,
      default: ''
    },
    motherQualification: {
      type: String,
      trim: true,
      default: ''
    },
    officeAddress: {
      type: String,
      trim: true,
      default: ''
    },
    email: {
      type: String,
      trim: true,
      default: ''
    },
    siblings: {
      brother: {
        name: { type: String, trim: true, default: '' },
        class: { type: String, trim: true, default: '' },
        school: { type: String, trim: true, default: '' }
      },
      sister: {
        name: { type: String, trim: true, default: '' },
        class: { type: String, trim: true, default: '' },
        school: { type: String, trim: true, default: '' }
      }
    },
    photo: {
      url: {
        type: String,
        required: [true, 'Student photo is required']
      },
      thumbnailUrl: {
        type: String,
        required: true
      },
      publicId: {
        type: String,
        required: true
      }
    },
    firstName: {
      type: String,
      required: [true, 'Please enter first name'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Please enter last name'],
      trim: true
    },
    dob: {
      type: Date,
      required: [true, 'Please enter date of birth']
    },
    gender: {
      type: String,
      required: [true, 'Please select gender'],
      enum: ['Male', 'Female', 'Other']
    },
    bloodGroup: {
      type: String,
      trim: true,
      default: ''
    },
    class: {
      type: String,
      required: [true, 'Please enter class (e.g. 10th)'],
      trim: true
    },
    section: {
      type: String,
      required: [true, 'Please enter section (e.g. A)'],
      trim: true
    },
    rollNo: {
      type: String,
      required: [true, 'Please enter roll number'],
      trim: true
    },
    academicYear: {
      type: String,
      required: [true, 'Please enter academic year (e.g. 2026-2027)'],
      trim: true
    },
    admissionDate: {
      type: Date,
      required: [true, 'Please enter admission date'],
      default: Date.now
    },
    fatherName: {
      type: String,
      required: [true, 'Please enter father name'],
      trim: true
    },
    fatherOccupation: {
      type: String,
      trim: true,
      default: ''
    },
    fatherPhone: {
      type: String,
      required: [true, 'Please enter father phone number'],
      trim: true
    },
    motherName: {
      type: String,
      required: [true, 'Please enter mother name'],
      trim: true
    },
    motherOccupation: {
      type: String,
      trim: true,
      default: ''
    },
    motherPhone: {
      type: String,
      trim: true,
      default: ''
    },
    guardianName: {
      type: String,
      trim: true,
      default: ''
    },
    address: {
      current: {
        type: String,
        required: [true, 'Please enter current address'],
        trim: true
      },
      city: {
        type: String,
        required: [true, 'Please enter city'],
        trim: true
      },
      state: {
        type: String,
        required: [true, 'Please enter state'],
        trim: true
      },
      pincode: {
        type: String,
        required: [true, 'Please enter pincode'],
        trim: true
      }
    },
    contactNo: {
      type: String,
      required: [true, 'Please enter contact number'],
      trim: true
    },
    category: {
      type: String,
      enum: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      default: 'General'
    },
    previousSchool: {
      name: { type: String, trim: true, default: '' },
      tcNo: { type: String, trim: true, default: '' }
    },
    usesTransport: {
      type: Boolean,
      default: false
    },
    transportRoute: {
      type: String,
      trim: true,
      default: ''
    },
    // Transfer Certificate Details
    tcIssued: {
      type: Boolean,
      default: false
    },
    tcNumber: {
      type: String,
      default: ''
    },
    tcIssueDate: {
      type: Date
    },
    reasonForLeaving: {
      type: String,
      default: ''
    },
    lastClassAttended: {
      type: String,
      default: ''
    },
    conduct: {
      type: String,
      default: ''
    },
    duesCleared: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    // Soft-delete removal tracking
    isRemoved: {
      type: Boolean,
      default: false
    },
    removalReason: {
      type: String,
      default: ''
    },
    removedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Query helpers/Virtuals if needed
studentSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Student', studentSchema);
