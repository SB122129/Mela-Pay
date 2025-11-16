import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../lib/api';
import { formatPrice, formatDOT, formatDateTime, getPaymentStatusColor, getPaymentStatusText } from '../../lib/utils';

export default function AdminPaymentsPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    email: '',
  });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin())) {
      router.push('/admin');
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (isAuthenticated && isAdmin()) {
      fetchPayments();
    }
  }, [page, filters, isAuthenticated, isAdmin]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getPayments({
        page,
        limit: 20,
        ...filters,
      });
      setPayments(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  if (authLoading || !isAuthenticated || !isAdmin()) {
    return null;
  }

  return (
    <Layout title="Payments - Admin - Mela Pay">
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="container-custom py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
                <p className="text-gray-600 mt-1">Manage all payment transactions</p>
              </div>
              <Button variant="outline" onClick={() => router.push('/admin')}>
                ← Back to Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container-custom py-8">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-xl font-bold">All Payments</h2>
                
                {/* Filters */}
                <div className="flex gap-3">
                  <select
                    className="input-field"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="waiting">Waiting</option>
                    <option value="confirming">Confirming</option>
                    <option value="finished">Finished</option>
                    <option value="failed">Failed</option>
                    <option value="expired">Expired</option>
                  </select>
                  
                  <input
                    type="text"
                    placeholder="Search by email..."
                    className="input-field"
                    value={filters.email}
                    onChange={(e) => handleFilterChange('email', e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>

            <CardBody>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="spinner"></div>
                </div>
              ) : payments.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment ID</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Courses</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr key={payment._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 font-mono text-sm">{payment.paymentId}</td>
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium text-gray-900">{payment.userName}</p>
                                <p className="text-sm text-gray-600">{payment.userEmail}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm">{payment.courses.length}</td>
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-semibold text-gray-900">{formatPrice(payment.totalAmount)}</p>
                                <p className="text-xs text-gray-500">{formatDOT(payment.totalAmountDOT)}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`badge ${getPaymentStatusColor(payment.status)}`}>
                                {getPaymentStatusText(payment.status)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {formatDateTime(payment.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-gray-600">
                        Page {page} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No payments found</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
