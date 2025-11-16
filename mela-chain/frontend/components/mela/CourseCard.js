import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { formatPrice, formatDOT, getLevelColor } from '../../lib/utils';
import Button from '../ui/Button';

export default function CourseCard({ course }) {
  const { addToCart, isInCart, removeFromCart } = useCart();
  const inCart = isInCart(course._id);

  const handleCartAction = (e) => {
    e.preventDefault();
    if (inCart) {
      removeFromCart(course._id);
    } else {
      addToCart(course);
    }
  };

  // Generate consistent gradient based on course ID
  const getPlaceholderGradient = () => {
    const gradients = [
      'from-orange-400 via-red-400 to-pink-500',
      'from-blue-400 via-indigo-400 to-purple-500',
      'from-green-400 via-teal-400 to-cyan-500',
      'from-yellow-400 via-orange-400 to-red-500',
      'from-purple-400 via-pink-400 to-red-500',
      'from-indigo-400 via-blue-400 to-cyan-500',
    ];
    const index = course._id ? course._id.charCodeAt(0) % gradients.length : 0;
    return gradients[index];
  };

  return (
    <div className="mela-card group">
      {/* Course Image */}
      <Link href={`/course/${course._id}`}>
        <div className="relative h-48 overflow-hidden">
          {course.imageUrl ? (
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${getPlaceholderGradient()} flex items-center justify-center relative overflow-hidden`}>
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
                <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full -translate-x-12 -translate-y-12"></div>
              </div>
              
              {/* Icon */}
              <div className="relative z-10 text-white">
                <svg className="w-24 h-24 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </div>
          )}
          
          {/* Level Badge */}
          <div className="absolute top-3 right-3">
            <span className={`badge ${getLevelColor(course.level)}`}>
              {course.level}
            </span>
          </div>
        </div>
      </Link>

      {/* Course Info */}
      <div className="p-5">
        {/* Institution */}
        <p className="text-sm text-secondary-600 dark:text-secondary-400 font-medium mb-2">
          {course.institution}
        </p>

        {/* Title */}
        <Link href={`/course/${course._id}`}>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {course.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Subjects */}
        {course.subjects && course.subjects.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {course.subjects.slice(0, 2).map((subject, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
              >
                {subject}
              </span>
            ))}
          </div>
        )}

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPrice(course.price)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formatDOT(course.priceInDOT)}</p>
          </div>
          
          <Button
            variant={inCart ? 'outline' : 'primary'}
            size="sm"
            onClick={handleCartAction}
          >
            {inCart ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                In Cart
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
