import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import { paymentsAPI } from '../../lib/api';
import { formatPrice, formatDOT, formatDateTime } from '../../lib/utils';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { id } = router.query;
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPayment();
    }
  }, [id]);

  const fetchPayment = async () => {
    try {
      const response = await paymentsAPI.getStatus(id);
      setPayment(response.data.data);
    } catch (error) {
      console.error('Error fetching payment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Payment Success - Mela Pay">
        <div className="container-custom py-12">
          <div className="flex items-center justify-center h-64">
            <div className="spinner"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!payment) {
    return (
      <Layout title="Payment Not Found - Mela Pay">
        <div className="container-custom py-12 text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Payment Not Found</h1>
          <Link href="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const isSuccess = ['finished', 'confirmed'].includes(payment.status);

  return (
    <Layout title="Payment Confirmation - Mela Pay">
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          {isSuccess ? (
            <>
              {/* Success Message */}
              <div className="text-center mb-12">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Payment Successful! 🎉
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Thank you for your purchase. Your courses are now available.
                </p>
              </div>

              {/* Payment Details */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Payment Details</h2>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payment ID</p>
                    <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">{payment.paymentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Date</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{formatDateTime(payment.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount Paid (USD)</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(payment.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount Paid (DOT)</p>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{formatDOT(payment.totalAmountDOT)}</p>
                  </div>
                </div>

                {payment.confirmedAt && (
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
                    <p className="text-sm text-green-800 dark:text-green-300">
                      <strong>Confirmed:</strong> {formatDateTime(payment.confirmedAt)}
                    </p>
                  </div>
                )}
              </div>

              {/* Courses */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Your Courses</h2>
                
                <div className="space-y-4">
                  {payment.courses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">{course.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {course.courseId?.institution || 'EdX Partner'}
                        </p>
                      </div>
                      <a
                        href={course.courseId?.edxUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                      >
                        Access Course →
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">What's Next?</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Check Your Email</p>
                      <p className="text-sm text-gray-600">
                        We've sent a confirmation email to <strong>{payment.userEmail}</strong> with your course access details.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Access Your Courses</p>
                      <p className="text-sm text-gray-600">
                        Click the "Access Course" buttons above to start learning immediately on EdX.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Start Learning</p>
                      <p className="text-sm text-gray-600">
                        Begin your learning journey and earn certificates upon completion.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/courses" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Browse More Courses
                  </Button>
                </Link>
                <button
                  onClick={() => window.print()}
                  className="flex-1 btn-outline"
                >
                  Print Receipt
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Pending/Failed State */}
              <div className="text-center mb-12">
                <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Payment {payment.status === 'waiting' ? 'Pending' : 'Incomplete'}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  {payment.status === 'waiting' 
                    ? 'Your payment is being processed. This may take a few minutes.'
                    : 'Your payment was not completed successfully.'}
                </p>
              </div>

              <div className="text-center">
                <Link href={`/payment/${payment.paymentId}`}>
                  <Button size="lg">View Payment Status</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
