import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import PaymentFlow from '../../components/mela/PaymentFlow';
import { paymentsAPI } from '../../lib/api';

export default function PaymentPage() {
  const router = useRouter();
  const { id } = router.query;
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError('Payment not found');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = (completedPayment) => {
    router.push(`/payment/success?id=${completedPayment.paymentId}`);
  };

  if (loading) {
    return (
      <Layout title="Payment - Mela Pay">
        <div className="container-custom py-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="spinner"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !payment) {
    return (
      <Layout title="Payment Not Found - Mela Pay">
        <div className="container-custom py-12">
          <div className="max-w-3xl mx-auto text-center">
            <svg className="w-24 h-24 text-red-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Payment Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{error || 'The payment you are looking for does not exist.'}</p>
            <button
              onClick={() => router.push('/courses')}
              className="btn-primary"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Complete Payment - Mela Pay">
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Complete Your Payment</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Follow the instructions below to complete your purchase
            </p>
          </div>

          <PaymentFlow payment={payment} onComplete={handlePaymentComplete} />
        </div>
      </div>
    </Layout>
  );
}
