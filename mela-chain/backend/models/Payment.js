import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  nowPaymentsId: {
    type: String,
    default: null
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  courses: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    title: String,
    price: Number,
    priceInDOT: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  totalAmountDOT: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'DOT'
  },
  status: {
    type: String,
    enum: ['pending', 'waiting', 'confirming', 'confirmed', 'sending', 'partially_paid', 'finished', 'failed', 'refunded', 'expired'],
    default: 'pending'
  },
  paymentAddress: {
    type: String,
    default: null
  },
  paymentUrl: {
    type: String,
    default: null
  },
  actuallyPaid: {
    type: Number,
    default: 0
  },
  transactionHash: {
    type: String,
    default: null
  },
  outcomeAmount: {
    type: Number,
    default: 0
  },
  outcomeCurrency: {
    type: String,
    default: 'USD'
  },
  expiresAt: {
    type: Date,
    default: null
  },
  confirmedAt: {
    type: Date,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  webhookData: [{
    receivedAt: Date,
    data: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ nowPaymentsId: 1 });
paymentSchema.index({ userEmail: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// Virtual for payment status display
paymentSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'pending': 'Pending',
    'waiting': 'Awaiting Payment',
    'confirming': 'Confirming',
    'confirmed': 'Confirmed',
    'sending': 'Processing',
    'partially_paid': 'Partially Paid',
    'finished': 'Completed',
    'failed': 'Failed',
    'refunded': 'Refunded',
    'expired': 'Expired'
  };
  return statusMap[this.status] || this.status;
});

// Method to check if payment is successful
paymentSchema.methods.isSuccessful = function() {
  return ['finished', 'confirmed'].includes(this.status);
};

// Method to check if payment is pending
paymentSchema.methods.isPending = function() {
  return ['pending', 'waiting', 'confirming', 'sending'].includes(this.status);
};

// Method to check if payment has failed
paymentSchema.methods.hasFailed = function() {
  return ['failed', 'expired', 'refunded'].includes(this.status);
};

// Static method to get payment statistics
paymentSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' },
        totalDOT: { $sum: '$totalAmountDOT' }
      }
    }
  ]);
  
  const total = await this.countDocuments();
  const successful = await this.countDocuments({ status: { $in: ['finished', 'confirmed'] } });
  const pending = await this.countDocuments({ status: { $in: ['pending', 'waiting', 'confirming'] } });
  
  return {
    total,
    successful,
    pending,
    byStatus: stats
  };
};

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
