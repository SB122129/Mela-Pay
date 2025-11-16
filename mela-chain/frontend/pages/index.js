import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import CourseCard from '../components/mela/CourseCard';
import Button from '../components/ui/Button';
import { coursesAPI } from '../lib/api';

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCourses();
  }, []);

  const fetchFeaturedCourses = async () => {
    try {
      const response = await coursesAPI.getFeatured();
      setFeaturedCourses(response.data.data);
    } catch (error) {
      console.error('Error fetching featured courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Mela Pay - Learn Smarter, Pay with Crypto">
      {/* Hero Section */}
      <section className="mela-hero">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl text-gray-900 dark:text-white md:text-6xl font-bold mb-6">
              Learn Smarter, <br />
              <span className="gradient-text">Pay with Crypto</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Access world-class EdX courses and pay with Polkadot (DOT). 
              The future of education is here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse Courses
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  How It Works
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16">
              <div>
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">1000+</div>
                <div className="text-gray-600 dark:text-gray-300 mt-2">Courses Available</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-secondary-600 dark:text-secondary-400">Fast</div>
                <div className="text-gray-600 dark:text-gray-300 mt-2">Payment Processing</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">Secure</div>
                <div className="text-gray-600 dark:text-gray-300 mt-2">Blockchain Powered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="mela-section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Featured Courses</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Top-rated courses from leading universities
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="mela-skeleton h-96 rounded-xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/courses">
              <Button variant="outline" size="lg">
                View All Courses →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="mela-section bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Browse Courses"
              description="Explore thousands of courses from top universities and institutions on EdX."
              icon="🔍"
            />
            <StepCard
              number="2"
              title="Pay with DOT"
              description="Add courses to cart and checkout securely using Polkadot cryptocurrency."
              icon="💳"
            />
            <StepCard
              number="3"
              title="Start Learning"
              description="Get instant access to your courses and start your learning journey."
              icon="🎓"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mela-section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Why Mela Pay?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              The best way to invest in your education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon="⚡"
              title="Fast Payments"
              description="Lightning-fast transactions powered by Polkadot blockchain"
            />
            <FeatureCard
              icon="🔒"
              title="Secure"
              description="Bank-level security with blockchain technology"
            />
            <FeatureCard
              icon="🌍"
              title="Global Access"
              description="Access courses from anywhere in the world"
            />
            <FeatureCard
              icon="💰"
              title="Low Fees"
              description="Minimal transaction fees compared to traditional payments"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mela-section bg-gradient-to-br from-primary-600 to-secondary-600 text-white ">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students already learning with Mela Pay
          </p>
          <Link href="/courses">
            <Button size="lg" className=" text-primary-600 hover:bg-gray-100">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

function StepCard({ number, title, description, icon }) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-4xl">{icon}</span>
      </div>
      <div className="text-primary-600 dark:text-primary-400 font-bold text-lg mb-2">Step {number}</div>
      <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="mela-card p-6 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}
