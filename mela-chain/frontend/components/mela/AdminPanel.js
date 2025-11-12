import { useState, useEffect } from 'react';
import { adminAPI } from '../../lib/api';
import { formatPrice, formatDOT, formatDateTime, getPaymentStatusColor, getPaymentStatusText } from '../../lib/utils';
import Button from '../ui/Button';
import Card, { CardHeader, CardBody } from '../ui/Card';

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Courses"
          value={stats.overview.totalCourses}
          icon="📚"
          color="bg-blue-500"
        />
        <StatCard
          title="Total Payments"
          value={stats.overview.totalPayments}
          icon="💳"
          color="bg-purple-500"
        />
        <StatCard
          title="Successful"
          value={stats.overview.successfulPayments}
          icon="✅"
          color="bg-green-500"
        />
        <StatCard
          title="Revenue"
          value={formatPrice(stats.overview.revenue)}
          subtitle={formatDOT(stats.overview.revenueDOT)}
          icon="💰"
          color="bg-emerald-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Rate */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold">Conversion Rate</h3>
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600">
                  {stats.overview.conversionRate}%
                </div>
                <p className="text-gray-600 mt-2">Payment Success Rate</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Pending Payments */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold">Pending Payments</h3>
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <div className="text-5xl font-bold text-yellow-600">
                  {stats.overview.pendingPayments}
                </div>
                <p className="text-gray-600 mt-2">Awaiting Confirmation</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Recent Payments</h3>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/payments'}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentPayments.map((payment) => (
                  <tr key={payment._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{payment.paymentId}</td>
                    <td className="py-3 px-4 text-sm">{payment.userEmail}</td>
                    <td className="py-3 px-4 text-sm">
                      <div>{formatPrice(payment.totalAmount)}</div>
                      <div className="text-xs text-gray-500">{formatDOT(payment.totalAmountDOT)}</div>
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
        </CardBody>
      </Card>

      {/* Top Courses */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold">Top Courses</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {stats.topCourses.map((course, index) => (
              <div key={course._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{course.title}</h4>
                    <p className="text-sm text-gray-600">{course.institution}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{course.totalEnrollments}</div>
                  <div className="text-sm text-gray-500">enrollments</div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color }) {
  return (
    <div className={`${color} rounded-xl p-6 text-white`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium opacity-90">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      {subtitle && <div className="text-sm opacity-90">{subtitle}</div>}
    </div>
  );
}
