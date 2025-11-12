import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  edxId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  priceInDOT: {
    type: Number,
    required: true,
    min: 0
  },
  institution: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
    default: 'All Levels'
  },
  duration: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'English'
  },
  subjects: [{
    type: String
  }],
  edxUrl: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalEnrollments: {
    type: Number,
    default: 0
  },
  lastSynced: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ institution: 1 });
courseSchema.index({ subjects: 1 });
courseSchema.index({ price: 1 });
courseSchema.index({ isActive: 1 });

// Virtual for formatted price
courseSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Virtual for formatted DOT price
courseSchema.virtual('formattedDOTPrice').get(function() {
  return `${this.priceInDOT.toFixed(4)} DOT`;
});

// Method to increment enrollments
courseSchema.methods.incrementEnrollments = async function() {
  this.totalEnrollments += 1;
  return this.save();
};

const Course = mongoose.model('Course', courseSchema);

export default Course;
