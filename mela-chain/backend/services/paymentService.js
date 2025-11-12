import axios from 'axios';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Course from '../models/Course.js';

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_API_BASE = 'https://api.nowpayments.io/v1';
const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET;

class PaymentService {
  /**
   * Create a payment with NowPayments
   */
  async createPayment(paymentData) {
    try {
      const { userEmail, userName, courses } = paymentData;

      // Calculate totals
      let totalAmount = 0;
      let totalAmountDOT = 0;
      const courseDetails = [];

      for (const courseId of courses) {
        const course = await Course.findById(courseId);
        if (!course) {
          throw new Error(`Course not found: ${courseId}`);
        }

        totalAmount += course.price;
        totalAmountDOT += course.priceInDOT;
        
        courseDetails.push({
          courseId: course._id,
          title: course.title,
          price: course.price,
          priceInDOT: course.priceInDOT
        });
      }

      // Generate unique payment ID
      const paymentId = this.generatePaymentId();

      // Create payment record in database
      const payment = new Payment({
        paymentId,
        userEmail,
        userName,
        courses: courseDetails,
        totalAmount,
        totalAmountDOT,
        currency: 'DOT',
        status: 'pending',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour expiry
      });

      await payment.save();

      // Create payment with NowPayments
      if (NOWPAYMENTS_API_KEY && NOWPAYMENTS_API_KEY !== 'np_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx') {
        try {
          const nowPaymentData = await this.createNowPayment(payment);
          
          payment.nowPaymentsId = nowPaymentData.payment_id;
          payment.paymentAddress = nowPaymentData.pay_address;
          payment.paymentUrl = nowPaymentData.invoice_url || nowPaymentData.pay_address;
          payment.status = 'waiting';
          
          await payment.save();
        } catch (error) {
          console.error('NowPayments API error:', error.message);
          // Continue with mock payment for development
          payment.paymentAddress = this.generateMockDOTAddress();
          payment.status = 'waiting';
          await payment.save();
        }
      } else {
        // Mock payment for development
        payment.paymentAddress = this.generateMockDOTAddress();
        payment.status = 'waiting';
        await payment.save();
      }

      return payment;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  /**
   * Create payment with NowPayments API
   */
  async createNowPayment(payment) {
    const response = await axios.post(
      `${NOWPAYMENTS_API_BASE}/payment`,
      {
        price_amount: payment.totalAmountDOT,
        price_currency: 'DOT',
        pay_currency: 'DOT',
        ipn_callback_url: `${process.env.BASE_URL}/api/payments/webhook`,
        order_id: payment.paymentId,
        order_description: `Mela Chain - ${payment.courses.length} course(s)`,
        success_url: `${process.env.CLIENT_URL}/payment/success?id=${payment.paymentId}`,
        cancel_url: `${process.env.CLIENT_URL}/payment/${payment.paymentId}`
      },
      {
        headers: {
          'x-api-key': NOWPAYMENTS_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }

  /**
   * Get payment status from NowPayments
   */
  async getPaymentStatus(paymentId) {
    try {
      const payment = await Payment.findOne({ paymentId }).populate('courses.courseId');
      
      if (!payment) {
        throw new Error('Payment not found');
      }

      // If we have a NowPayments ID, check status with their API
      if (payment.nowPaymentsId && NOWPAYMENTS_API_KEY) {
        try {
          const response = await axios.get(
            `${NOWPAYMENTS_API_BASE}/payment/${payment.nowPaymentsId}`,
            {
              headers: {
                'x-api-key': NOWPAYMENTS_API_KEY
              }
            }
          );

          // Update payment status
          payment.status = response.data.payment_status;
          payment.actuallyPaid = response.data.actually_paid || 0;
          
          if (response.data.payment_status === 'finished') {
            payment.confirmedAt = new Date();
          }

          await payment.save();
        } catch (error) {
          console.error('Error fetching from NowPayments:', error.message);
        }
      }

      return payment;
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  }

  /**
   * Handle webhook from NowPayments
   */
  async handleWebhook(webhookData, signature) {
    try {
      // Verify webhook signature
      if (IPN_SECRET && signature) {
        const isValid = this.verifyWebhookSignature(webhookData, signature);
        if (!isValid) {
          throw new Error('Invalid webhook signature');
        }
      }

      const { order_id, payment_status, actually_paid, outcome_amount, outcome_currency } = webhookData;

      const payment = await Payment.findOne({ paymentId: order_id });
      
      if (!payment) {
        console.error('Payment not found for webhook:', order_id);
        return null;
      }

      // Update payment status
      payment.status = payment_status;
      payment.actuallyPaid = actually_paid || 0;
      payment.outcomeAmount = outcome_amount || 0;
      payment.outcomeCurrency = outcome_currency || 'USD';
      
      // Add webhook data to history
      payment.webhookData.push({
        receivedAt: new Date(),
        data: webhookData
      });

      // If payment is finished, mark as confirmed
      if (payment_status === 'finished') {
        payment.confirmedAt = new Date();
        
        // Increment course enrollments
        for (const course of payment.courses) {
          const courseDoc = await Course.findById(course.courseId);
          if (courseDoc) {
            await courseDoc.incrementEnrollments();
          }
        }
      }

      await payment.save();
      
      return payment;
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(data, signature) {
    const hmac = crypto.createHmac('sha512', IPN_SECRET);
    hmac.update(JSON.stringify(data));
    const calculatedSignature = hmac.digest('hex');
    return calculatedSignature === signature;
  }

  /**
   * Generate unique payment ID
   */
  generatePaymentId() {
    return `MELA-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  }

  /**
   * Generate mock DOT address for development
   */
  generateMockDOTAddress() {
    return `1${crypto.randomBytes(32).toString('hex').substring(0, 46)}`;
  }

  /**
   * Simulate payment confirmation (for testing)
   */
  async simulatePaymentConfirmation(paymentId) {
    try {
      const payment = await Payment.findOne({ paymentId });
      
      if (!payment) {
        throw new Error('Payment not found');
      }

      payment.status = 'finished';
      payment.confirmedAt = new Date();
      payment.actuallyPaid = payment.totalAmountDOT;

      // Increment course enrollments
      for (const course of payment.courses) {
        const courseDoc = await Course.findById(course.courseId);
        if (courseDoc) {
          await courseDoc.incrementEnrollments();
        }
      }

      await payment.save();
      
      return payment;
    } catch (error) {
      console.error('Error simulating payment:', error);
      throw error;
    }
  }

  /**
   * Get payment statistics
   */
  async getPaymentStatistics() {
    try {
      const stats = await Payment.getStatistics();
      
      const recentPayments = await Payment.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('courses.courseId');

      const totalRevenue = await Payment.aggregate([
        { $match: { status: { $in: ['finished', 'confirmed'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' }, totalDOT: { $sum: '$totalAmountDOT' } } }
      ]);

      return {
        ...stats,
        recentPayments,
        revenue: totalRevenue[0] || { total: 0, totalDOT: 0 }
      };
    } catch (error) {
      console.error('Error getting payment statistics:', error);
      throw error;
    }
  }
}

export default new PaymentService();
