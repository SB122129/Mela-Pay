import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { coursesAPI } from '../../lib/api';
import { formatPrice, formatDOT, getLevelColor } from '../../lib/utils';

export default function AdminCoursesPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin())) {
      router.push('/admin');
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (isAuthenticated && isAdmin()) {
      fetchCourses();
    }
  }, [isAuthenticated, isAdmin]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await coursesAPI.getAll({ limit: 50 });
      setCourses(response.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      // This would call the sync endpoint
      alert('Course sync started. This may take a few minutes.');
      await fetchCourses();
    } catch (error) {
      console.error('Error syncing courses:', error);
      alert('Failed to sync courses');
    } finally {
      setSyncing(false);
    }
  };

  if (authLoading || !isAuthenticated || !isAdmin()) {
    return null;
  }

  return (
    <Layout title="Courses - Admin - Mela Pay">
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="container-custom py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
                <p className="text-gray-600 mt-1">Manage course catalog</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="secondary" onClick={handleSync} disabled={syncing}>
                  {syncing ? 'Syncing...' : '🔄 Sync from EdX'}
                </Button>
                <Button variant="outline" onClick={() => router.push('/admin')}>
                  ← Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container-custom py-8">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold">All Courses ({courses.length})</h2>
            </CardHeader>

            <CardBody>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="spinner"></div>
                </div>
              ) : courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <div key={course._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <span className={`badge ${getLevelColor(course.level)}`}>
                          {course.level}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${course.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {course.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3">{course.institution}</p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-bold text-gray-900">{formatPrice(course.price)}</p>
                          <p className="text-xs text-gray-500">{formatDOT(course.priceInDOT)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600">{course.totalEnrollments}</p>
                          <p className="text-xs text-gray-500">enrollments</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">No courses found</p>
                  <Button onClick={handleSync}>Sync Courses from EdX</Button>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
