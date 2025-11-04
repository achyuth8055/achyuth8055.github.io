import React from 'react';

interface Rating {
  id: number;
  name: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

const ratings: Rating[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Manager",
    rating: 5,
    comment: "Absolutely fantastic tool! I use it daily for converting PDFs and resizing images. It's fast, reliable, and completely free. Highly recommend!",
    date: "2 days ago"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Graphic Designer",
    rating: 5,
    comment: "The image compression tool saved me hours of work. The quality remains excellent even after compression. Best tool I've found online!",
    date: "1 week ago"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Small Business Owner",
    rating: 5,
    comment: "I needed to merge multiple PDFs for a proposal. This tool made it so easy! No watermarks, no signup required. Just perfect.",
    date: "2 weeks ago"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Student",
    rating: 5,
    comment: "Great for school projects! I can convert images, compress PDFs, and split documents all in one place. Super convenient and user-friendly.",
    date: "3 weeks ago"
  },
  {
    id: 5,
    name: "Jessica Taylor",
    role: "Freelance Writer",
    rating: 5,
    comment: "The PDF to Word conversion is spot-on. Formatting stays intact and I can edit my documents easily. This is now my go-to tool!",
    date: "1 month ago"
  },
  {
    id: 6,
    name: "Ahmed Hassan",
    role: "IT Consultant",
    rating: 5,
    comment: "Clean interface, fast processing, and reliable results. I've recommended this to all my clients. Excellent work!",
    date: "1 month ago"
  }
];

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg 
    className={`w-5 h-5 ${filled ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="currentColor"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const UserRatings: React.FC = () => {
  const averageRating = 5.0;
  const totalReviews = ratings.length;

  return (
    <div className="bg-white py-16 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Trusted by thousands of users worldwide
          </h2>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} filled={star <= averageRating} />
              ))}
            </div>
            <span className="text-2xl font-bold text-gray-800">{averageRating}</span>
            <span className="text-gray-600">({totalReviews} reviews)</span>
          </div>
          <p className="text-gray-600">Join millions who trust imageandpdf for their document needs</p>
        </div>

        {/* Ratings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ratings.map((rating) => (
            <div 
              key={rating.id} 
              className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} filled={star <= rating.rating} />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-700 mb-4 leading-relaxed">
                "{rating.comment}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                  {rating.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{rating.name}</p>
                  <p className="text-sm text-gray-600">{rating.role}</p>
                </div>
                <span className="text-xs text-gray-500">{rating.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-12 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-red-500 mb-2">10M+</p>
              <p className="text-gray-600">Documents Processed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-500 mb-2">500K+</p>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-500 mb-2">100%</p>
              <p className="text-gray-600">Free Tools</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-500 mb-2">24/7</p>
              <p className="text-gray-600">Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRatings;
