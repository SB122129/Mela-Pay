import { useState } from 'react';
import { coursesAPI, authAPI } from '../../lib/api';

export default function DebugConnection() {
  const [debugData, setDebugData] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    try {
      console.log('🔍 Testing API URL:', API_URL);
      
      // Test 1: Health endpoint (direct fetch)
      console.log('📡 Testing health endpoint...');
      const healthResponse = await fetch(`${API_URL}/api/health`);
      const healthData = await healthResponse.json();
      console.log('✅ Health check:', healthData);
      
      // Test 2: Courses endpoint (using your API service)
      console.log('📡 Testing courses endpoint...');
      const coursesResponse = await coursesAPI.getAll({ page: 1, limit: 5 });
      console.log('✅ Courses data:', coursesResponse.data);
      
      setDebugData({
        success: true,
        timestamp: new Date().toISOString(),
        apiUrl: API_URL,
        tests: {
          health: {
            status: healthResponse.status,
            ok: healthResponse.ok,
            data: healthData
          },
          courses: {
            status: coursesResponse.status,
            data: coursesResponse.data.data,
            count: coursesResponse.data.data?.length || 0,
            pagination: coursesResponse.data.pagination
          }
        }
      });
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      setDebugData({
        success: false,
        timestamp: new Date().toISOString(),
        apiUrl: API_URL,
        error: {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          stack: error.stack
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-primary-500 p-6 max-w-2xl max-h-96 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            🔧 API Connection Debug
          </h3>
          <button
            onClick={() => setDebugData(null)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <button
          onClick={testConnection}
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg mb-4 transition-colors"
        >
          {loading ? '🔄 Testing Connection...' : '🚀 Test API Connection'}
        </button>

        {debugData && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${debugData.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{debugData.success ? '✅' : '❌'}</span>
                <span className={`font-bold ${debugData.success ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {debugData.success ? 'Connection Successful!' : 'Connection Failed'}
                </span>
              </div>
              
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <div><strong>API URL:</strong> {debugData.apiUrl}</div>
                <div><strong>Time:</strong> {new Date(debugData.timestamp).toLocaleString()}</div>
              </div>
            </div>

            {debugData.success && debugData.tests && (
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                  <div className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                    Health Check
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Status: {debugData.tests.health.status} {debugData.tests.health.ok ? '✅' : '❌'}
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                  <div className="font-semibold text-purple-900 dark:text-purple-300 mb-1">
                    Courses API
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <div>Status: {debugData.tests.courses.status} ✅</div>
                    <div>Courses Found: {debugData.tests.courses.count}</div>
                    {debugData.tests.courses.pagination && (
                      <div>Total Pages: {debugData.tests.courses.pagination.pages}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!debugData.success && debugData.error && (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                <div className="font-semibold text-red-900 dark:text-red-300 mb-2">
                  Error Details
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <div><strong>Message:</strong> {debugData.error.message}</div>
                  {debugData.error.status && (
                    <div><strong>Status:</strong> {debugData.error.status}</div>
                  )}
                  {debugData.error.response && (
                    <div><strong>Response:</strong> {JSON.stringify(debugData.error.response)}</div>
                  )}
                </div>
              </div>
            )}

            <details className="text-xs">
              <summary className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                View Full Debug Data
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-900 rounded overflow-auto max-h-48 text-xs">
                {JSON.stringify(debugData, null, 2)}
              </pre>
            </details>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
          <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
          <div><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not Set'}</div>
        </div>
      </div>
    </div>
  );
}
