import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatDOT } from '../lib/utils';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const [removing, setRemoving] = useState(null);
  
  const total = getCartTotal();

  const handleRemove = async (courseId) => {
    setRemoving(courseId);
    await new Promise((resolve) => setTimeout(resolve, 300));
    removeFromCart(courseId);
    setRemoving(null);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Redirect to login if user is not authenticated
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }
    
    router.push('/checkout');
  };

  if (cart.length === 0) {
    return (
      <Layout title="Shopping Cart - Mela Pay">
        <div className="container-custom py-12">
          <div className="max-w-2xl mx-auto text-center">
            <svg
              className="w-32 h-32 text-gray-300 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Your cart is empty</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Start adding courses to your cart to begin your learning journey
            </p>
            <Link href="/courses">
              <Button size="lg">Browse Courses</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Shopping Cart - Mela Pay">
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((course) => (
              <div
                key={course._id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all ${
                  removing === course._id ? 'opacity-50' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Course Image */}
                  <div className="w-full md:w-48 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg overflow-hidden flex-shrink-0">
                    {course.imageUrl ? (
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-primary-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="flex-1">
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 font-medium mb-1">
                      {course.institution}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatPrice(course.price)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDOT(course.priceInDOT)}
                        </p>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemove(course._id)}
                        disabled={removing === course._id}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={clearCart}
              className="w-full"
            >
              Clear Cart
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({cart.length})</span>
                  <span>{formatPrice(total.usd)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Processing Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    <span>Total (USD)</span>
                    <span>{formatPrice(total.usd)}</span>
                  </div>
                  <div className="flex justify-between text-lg text-primary-600 dark:text-primary-400 font-semibold">
                    <span>Total (DOT)</span>
                    <span>{formatDOT(total.dot)}</span>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full mb-4"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>

              <Link href="/courses">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>

              {/* Payment Info */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  💳 Payment Method
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  Pay securely with Polkadot (DOT) cryptocurrency
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
