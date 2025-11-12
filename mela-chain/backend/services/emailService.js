/**
 * Email Service for Mela Chain
 * In production, integrate with SendGrid, AWS SES, or similar service
 */

class EmailService {
  /**
   * Send payment confirmation email
   */
  async sendPaymentConfirmation(payment) {
    try {
      console.log('📧 Sending payment confirmation email...');
      console.log(`To: ${payment.userEmail}`);
      console.log(`Payment ID: ${payment.paymentId}`);
      console.log(`Courses: ${payment.courses.map(c => c.title).join(', ')}`);
      
      // In production, implement actual email sending
      // Example with SendGrid:
      /*
      const msg = {
        to: payment.userEmail,
        from: 'noreply@melachain.com',
        subject: 'Payment Confirmed - Mela Chain',
        html: this.getPaymentConfirmationTemplate(payment)
      };
      await sgMail.send(msg);
      */

      return {
        success: true,
        message: 'Email sent successfully (mock)'
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Send payment pending email
   */
  async sendPaymentPending(payment) {
    try {
      console.log('📧 Sending payment pending email...');
      console.log(`To: ${payment.userEmail}`);
      console.log(`Payment Address: ${payment.paymentAddress}`);
      
      return {
        success: true,
        message: 'Email sent successfully (mock)'
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Send course access email
   */
  async sendCourseAccess(userEmail, courses) {
    try {
      console.log('📧 Sending course access email...');
      console.log(`To: ${userEmail}`);
      console.log(`Courses: ${courses.map(c => c.title).join(', ')}`);
      
      return {
        success: true,
        message: 'Email sent successfully (mock)'
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get payment confirmation email template
   */
  getPaymentConfirmationTemplate(payment) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #7C3AED 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .course-list { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .course-item { padding: 10px 0; border-bottom: 1px solid #eee; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 12px 30px; background: #7C3AED; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Payment Confirmed!</h1>
            <p>Thank you for your purchase</p>
          </div>
          <div class="content">
            <h2>Hi ${payment.userName},</h2>
            <p>Your payment has been confirmed and your courses are now ready!</p>
            
            <div class="course-list">
              <h3>Your Courses:</h3>
              ${payment.courses.map(course => `
                <div class="course-item">
                  <strong>${course.title}</strong><br>
                  <small>$${course.price} (${course.priceInDOT} DOT)</small>
                </div>
              `).join('')}
            </div>
            
            <p><strong>Payment ID:</strong> ${payment.paymentId}</p>
            <p><strong>Total Paid:</strong> ${payment.totalAmountDOT} DOT ($${payment.totalAmount})</p>
            
            <center>
              <a href="${process.env.CLIENT_URL}/payment/success?id=${payment.paymentId}" class="button">
                View Your Courses
              </a>
            </center>
          </div>
          <div class="footer">
            <p>Mela Chain - Learn Smarter, Pay with Crypto</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default new EmailService();
