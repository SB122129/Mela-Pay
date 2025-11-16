import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { usePolkadot } from '../context/PolkadotContext';
import { useAuth } from '../context/AuthContext';
import PolkadotWallet from '../components/mela/PolkadotWallet';
import { paymentsAPI } from '../lib/api';
import { formatPrice, formatDOT, isValidEmail } from '../lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const { selectedAccount, isConnected } = usePolkadot();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState(null);
  const [notification, setNotification] = useState(null);

  const total = getCartTotal();
  const { getBalance } = usePolkadot();

  const handleAccountSelect = async (account) => {
    setWalletAddress(account.address);
    setBalanceError(null);
    
    // Fetch balance for selected account
    if (account && account.address) {
      setBalanceLoading(true);
      try {
        const accountBalance = await getBalance(account.address);
        // Convert from Planck to DOT (1 DOT = 10^10 Planck)
        const dotBalance = parseFloat(accountBalance) / Math.pow(10, 10);
        setBalance(dotBalance);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalanceError('Unable to fetch balance');
        setBalance(null);
      } finally {
        setBalanceLoading(false);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = 'Name is required';
    }

    if (!formData.userEmail.trim()) {
      newErrors.userEmail = 'Email is required';
    } else if (!isValidEmail(formData.userEmail)) {
      newErrors.userEmail = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (cart.length === 0) {
      setNotification({
        type: 'error',
        title: 'Cart is Empty',
        message: 'Please add courses to your cart before checking out.'
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Check if wallet is connected and balance is sufficient
    if (!isConnected || !selectedAccount) {
      setNotification({
        type: 'error',
        title: 'Wallet Not Connected',
        message: 'Please connect your Polkadot wallet to continue with the payment.'
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (balance !== null && balance < total.dot) {
      setNotification({
        type: 'error',
        title: 'Insufficient Funds',
        message: `You need ${formatDOT(total.dot)} but only have ${formatDOT(balance)} in your wallet. Please add ${formatDOT(total.dot - balance)} more DOT to complete this purchase.`,
        action: 'Add funds to your Polkadot wallet and try again.'
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Clear any previous notifications
    setNotification(null);

    setLoading(true);

    try {
      const response = await paymentsAPI.create({
        userName: formData.userName,
        userEmail: formData.userEmail,
        courses: cart.map((c) => c._id),
      });

      const payment = response.data.data;
      
      // Clear cart
      clearCart();
      
      // Redirect to payment page
      router.push(`/payment/${payment.paymentId}`);
    } catch (error) {
      console.error('Error creating payment:', error);
      setNotification({
        type: 'error',
        title: 'Payment Creation Failed',
        message: error.response?.data?.message || 'Failed to create payment. Please try again.',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Redirect to cart if empty - must be in useEffect for SSR compatibility
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart.length, router]);

  // Redirect to home if user logs out while on checkout page
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Don't render if cart is empty
  if (cart.length === 0) {
    return null;
  }

  return (
    <Layout title="Checkout - Mela Pay">
      <div className="container-custom py-12">
        {/* Notification Card */}
        {notification && (
          <div className={`mb-8 rounded-xl shadow-lg overflow-hidden ${
            notification.type === 'error' ? 'bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800' : 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800'
          }`}>
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {notification.type === 'error' ? (
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className={`text-lg font-bold mb-1 ${
                    notification.type === 'error' ? 'text-red-900 dark:text-red-200' : 'text-blue-900 dark:text-blue-200'
                  }`}>
                    {notification.title}
                  </h3>
                  <p className={`text-sm mb-2 ${
                    notification.type === 'error' ? 'text-red-800 dark:text-red-300' : 'text-blue-800 dark:text-blue-300'
                  }`}>
                    {notification.message}
                  </p>
                  {notification.action && (
                    <p className={`text-xs font-medium ${
                      notification.type === 'error' ? 'text-red-700 dark:text-red-400' : 'text-blue-700 dark:text-blue-400'
                    }`}>
                      💡 {notification.action}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setNotification(null)}
                  className={`flex-shrink-0 ml-4 p-1 rounded-lg hover:bg-white/50 transition-colors ${
                    notification.type === 'error' ? 'text-red-600' : 'text-blue-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Contact Information</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    className={`input-field ${errors.userName ? 'border-red-500' : ''}`}
                    placeholder="John Doe"
                  />
                  {errors.userName && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.userName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="userEmail"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleChange}
                    className={`input-field ${errors.userEmail ? 'border-red-500' : ''}`}
                    placeholder="john@example.com"
                  />
                  {errors.userEmail && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.userEmail}</p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    We'll send your course access details to this email
                  </p>
                </div>

                {/* Payment Method Info */}
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Payment Method
                  </h3>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💎</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Polkadot (DOT)</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Secure blockchain payment</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    After clicking "Continue to Payment", you'll receive a payment address and QR code to complete your purchase.
                  </p>
                </div>

                {/* Terms */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1 mr-3"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to the{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-700">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-700">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner w-5 h-5 mr-2 border-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Continue to Payment'
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            {/* Polkadot Wallet */}
            <div className="mb-6">
              <PolkadotWallet onAccountSelect={handleAccountSelect} />
              
              {/* Balance Display */}
              {isConnected && selectedAccount && (
                <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Wallet Balance</span>
                    {balanceLoading && (
                      <div className="spinner w-4 h-4 border-2"></div>
                    )}
                  </div>
                  {balanceError ? (
                    <p className="text-sm text-red-600 dark:text-red-400">{balanceError}</p>
                  ) : balance !== null ? (
                    <div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{formatDOT(balance)}</p>
                      {balance < total.dot && (
                        <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                          <p className="text-xs text-red-800 font-medium flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Insufficient funds! Need {formatDOT(total.dot - balance)} more
                          </p>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Order Summary</h2>

              {/* Course List */}
              <div className="space-y-4 mb-6">
                {cart.map((course) => (
                  <div key={course._id} className="flex justify-between text-sm">
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-gray-900 dark:text-white line-clamp-2">
                        {course.title}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">{course.institution}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(course.price)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDOT(course.priceInDOT)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(total.usd)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Processing Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>{formatPrice(total.usd)}</span>
                  </div>
                  <div className="flex justify-between text-lg text-primary-600 dark:text-primary-400 font-semibold">
                    <span>Pay in DOT</span>
                    <span>{formatDOT(total.dot)}</span>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <div className="flex items-center text-green-800 dark:text-green-300">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
                <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                  Powered by Polkadot blockchain technology
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
