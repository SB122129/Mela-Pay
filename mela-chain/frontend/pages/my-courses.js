import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { formatPrice, formatDOT } from '../lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function MyCoursesPage() {
  const router = useRouter();
  const { user: authUser, logout, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      fetchPurchasedCourses(token);
    }
  }, [isAuthenticated]);

  const fetchPurchasedCourses = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setCourses(response.data.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      if (err.response?.status === 401) {
        logout();
        router.push('/login');
      } else {
        setError('Failed to load your courses');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return (
      <Layout title="My Courses - Mela Pay">
        <div className="container-custom py-12">
          <div className="flex items-center justify-center h-64">
            <div className="spinner"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Courses - Mela Pay">
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="container-custom py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Courses</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, {authUser?.name}!</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => router.push('/courses')}>
                  Browse Courses
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container-custom py-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {courses.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Courses Yet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You haven't purchased any courses yet. Start learning today!
              </p>
              <Button onClick={() => router.push('/courses')}>
                Browse Courses
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((item, index) => {
                const course = item.course;
                const payment = item.payment;

                if (!course) return null;

                return (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Course Image */}
                    {course.imageUrl && (
                      <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Course Info */}
                    <div className="p-6">
                      <div className="mb-4">
                        {course.category && (
                          <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-semibold rounded-full mb-2">
                            {course.category}
                          </span>
                        )}
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        {course.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                            {course.description}
                          </p>
                        )}
                      </div>

                      {/* Purchase Info */}
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span>Purchased:</span>
                          <span>{new Date(item.purchasedAt).toLocaleDateString()}</span>
                        </div>
                        {payment && (
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Paid:</span>
                            <span className="font-semibold text-primary-600 dark:text-primary-400">
                              {formatDOT(payment.totalAmountDOT)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Access Button */}
                      <a
                        href={course.edxUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button size="sm" className="w-full">
                          Access Course →
                        </Button>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
