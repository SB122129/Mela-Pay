import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';

export default function AuthCallback() {
  const router = useRouter();
  const { setUserFromStorage } = useAuth();

  useEffect(() => {
    const { token, redirect } = router.query;

    if (token) {
      // Store token
      localStorage.setItem('token', token);

      // Fetch user data
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.data));
            // Update AuthContext immediately
            setUserFromStorage();
            
            // Redirect to specified page or default based on role
            if (redirect) {
              router.push(redirect);
            } else if (data.data.role === 'admin') {
              router.push('/admin');
            } else {
              router.push('/');
            }
          } else {
            router.push('/login');
          }
        })
        .catch(() => {
          router.push('/login');
        });
    }
  }, [router.query]);

  return (
    <Layout title="Authenticating...">
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Completing authentication...</p>
        </div>
      </div>
    </Layout>
  );
}
