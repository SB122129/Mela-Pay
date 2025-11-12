import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { paymentsAPI } from '../lib/api';
import { formatPrice, formatDOT, isValidEmail } from '../lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const total = getCartTotal();

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
      alert('Your cart is empty');
      return;
    }

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
      alert(error.response?.data?.message || 'Failed to create payment. Please try again.');
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

  if (cart.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <Layout title="Checkout - Mela Chain">
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
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
                    <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-2">
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
                    <p className="text-red-500 text-sm mt-1">{errors.userEmail}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    We'll send your course access details to this email
                  </p>
                </div>

                {/* Payment Method Info */}
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center">
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
                      <p className="font-semibold text-gray-900">Polkadot (DOT)</p>
                      <p className="text-sm text-gray-600">Secure blockchain payment</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
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
                  <label htmlFor="terms" className="text-sm text-gray-600">
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
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              {/* Course List */}
              <div className="space-y-4 mb-6">
                {cart.map((course) => (
                  <div key={course._id} className="flex justify-between text-sm">
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-gray-900 line-clamp-2">
                        {course.title}
                      </p>
                      <p className="text-gray-500 text-xs">{course.institution}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(course.price)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDOT(course.priceInDOT)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(total.usd)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Processing Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold mb-2">
                    <span>Total</span>
                    <span>{formatPrice(total.usd)}</span>
                  </div>
                  <div className="flex justify-between text-lg text-primary-600 font-semibold">
                    <span>Pay in DOT</span>
                    <span>{formatDOT(total.dot)}</span>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center text-green-800">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
                <p className="text-xs text-green-700 mt-1">
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
