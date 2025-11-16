import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import AdminPanel from '../../components/mela/AdminPanel';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function AdminPage() {
  const router = useRouter();
  const { user, login, isAuthenticated, isAdmin, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated && !isAdmin()) {
      router.push('/');
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        router.push('/admin');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <Layout title="Admin - Mela Pay">
        <div className="container-custom py-12">
          <div className="flex items-center justify-center h-64">
            <div className="spinner"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !isAdmin()) {
    return (
      <Layout title="Admin Login - Mela Pay">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-xl shadow-2xl p-8">
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">M</span>
                </div>
                <h1 className="text-3xl font-bold gradient-text mb-2">Mela Pay</h1>
                <p className="text-gray-600">Admin Panel</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="admin@melachain.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="spinner w-5 h-5 mr-2 border-2"></div>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Demo Credentials 
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Demo Credentials:</strong>
                </p>
                <p className="text-xs text-blue-700 font-mono">
                  Email: admin@melachain.com<br />
                  Password: admin123
                </p>
              </div>
              */}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Dashboard - Mela Pay">
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="container-custom py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => router.push('/admin/payments')}>
                  View Payments
                </Button>
                <Button variant="outline" onClick={() => router.push('/admin/courses')}>
                  Manage Courses
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="container-custom py-8">
          <AdminPanel />
        </div>
      </div>
    </Layout>
  );
}
