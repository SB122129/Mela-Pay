import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { paymentsAPI } from '../../lib/api';
import { formatDOT, formatPrice, copyToClipboard, getPaymentStatusColor, getPaymentStatusText } from '../../lib/utils';
import { usePolkadot } from '../../context/PolkadotContext';
import Button from '../ui/Button';

export default function PaymentFlow({ payment, onComplete }) {
  const { selectedAccount, getBalance, isConnected } = usePolkadot();
  const [status, setStatus] = useState(payment.status);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  // Poll payment status
  useEffect(() => {
    if (!payment || ['finished', 'failed', 'expired'].includes(status)) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const response = await paymentsAPI.getStatus(payment.paymentId);
        const newStatus = response.data.data.status;
        setStatus(newStatus);

        if (['finished', 'confirmed'].includes(newStatus)) {
          clearInterval(interval);
          if (onComplete) {
            onComplete(response.data.data);
          }
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [payment, status, onComplete]);

  // Fetch balance when wallet is connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (selectedAccount && selectedAccount.address && isConnected) {
        setBalanceLoading(true);
        try {
          const accountBalance = await getBalance(selectedAccount.address);
          // Convert from Planck to DOT (1 DOT = 10^10 Planck)
          const dotBalance = parseFloat(accountBalance) / Math.pow(10, 10);
          setBalance(dotBalance);
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance(null);
        } finally {
          setBalanceLoading(false);
        }
      }
    };
    fetchBalance();
  }, [selectedAccount, isConnected, getBalance]);

  // Calculate time left
  useEffect(() => {
    if (!payment?.expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const expires = new Date(payment.expiresAt);
      const diff = expires - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        clearInterval(interval);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [payment]);

  const handleCopy = async () => {
    const success = await copyToClipboard(payment.paymentAddress);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSimulatePayment = async () => {
    setLoading(true);
    try {
      await paymentsAPI.simulate(payment.paymentId);
      setStatus('finished');
      if (onComplete) {
        const response = await paymentsAPI.getStatus(payment.paymentId);
        onComplete(response.data.data);
      }
    } catch (error) {
      console.error('Error simulating payment:', error);
      alert('Failed to simulate payment');
    } finally {
      setLoading(false);
    }
  };

  if (!payment) {
    return <div>Loading payment details...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className={`p-4 rounded-lg ${getPaymentStatusColor(status)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Payment Status: {getPaymentStatusText(status)}</h3>
            <p className="text-sm mt-1">Payment ID: {payment.paymentId}</p>
          </div>
          {timeLeft && status === 'waiting' && (
            <div className="text-right">
              <p className="text-sm font-medium">Time Remaining</p>
              <p className="text-2xl font-bold">{timeLeft}</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Instructions */}
      {['pending', 'waiting', 'confirming'].includes(status) && (
        <div className="payment-card">
          <h3 className="text-xl font-bold mb-4">Send Payment</h3>
          
          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="qr-container">
              <QRCodeSVG
                value={payment.paymentAddress}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount to Send
              </label>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl font-bold text-primary-600">
                  {formatDOT(payment.totalAmountDOT)}
                </span>
                <span className="text-gray-600">{formatPrice(payment.totalAmount)}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Address
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={payment.paymentAddress}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono"
                />
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Balance Warning */}
          {isConnected && selectedAccount && balance !== null && balance < payment.totalAmountDOT && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">⚠️ Insufficient Funds</h4>
                  <p className="text-sm text-red-800 mb-2">
                    Your wallet balance ({formatDOT(balance)}) is less than the required amount ({formatDOT(payment.totalAmountDOT)}).
                  </p>
                  <p className="text-sm text-red-800 font-medium">
                    You need {formatDOT(payment.totalAmountDOT - balance)} more DOT to complete this payment.
                  </p>
                  <p className="text-xs text-red-700 mt-2">
                    Please add funds to your wallet or use a different account with sufficient balance.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">📱 How to Pay</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Open your Polkadot wallet</li>
              <li>Scan the QR code or copy the payment address</li>
              <li>Send exactly {formatDOT(payment.totalAmountDOT)}</li>
              <li>Wait for confirmation (usually 1-2 minutes)</li>
            </ol>
          </div>

          {/* Development: Simulate Payment */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800 mb-3">
                <strong>Development Mode:</strong> Simulate payment confirmation for testing
              </p>
              <Button
                variant="secondary"
                onClick={handleSimulatePayment}
                disabled={loading}
              >
                {loading ? 'Simulating...' : '🧪 Simulate Payment'}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Success State */}
      {['finished', 'confirmed'].includes(status) && (
        <div className="payment-card text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Confirmed!</h3>
          <p className="text-gray-600 mb-6">
            Your payment has been confirmed. You can now access your courses.
          </p>
          
          {/* Course List */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold mb-3">Your Courses:</h4>
            <div className="space-y-2">
              {payment.courses.map((course, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{course.title}</span>
                  <a
                    href={course.courseId?.edxUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Access Course →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Failed State */}
      {['failed', 'expired'].includes(status) && (
        <div className="payment-card text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment {status === 'expired' ? 'Expired' : 'Failed'}</h3>
          <p className="text-gray-600 mb-6">
            {status === 'expired' 
              ? 'This payment has expired. Please create a new payment to continue.'
              : 'There was an issue with your payment. Please try again.'}
          </p>
          <Button variant="primary" onClick={() => window.location.href = '/cart'}>
            Return to Cart
          </Button>
        </div>
      )}
    </div>
  );
}
