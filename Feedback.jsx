import { useState, useEffect } from 'react';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comments: '',
  });
  const [errors, setErrors] = useState({});
  const [feedbacks, setFeedbacks] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Load feedbacks from localStorage
    const savedFeedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    setFeedbacks(savedFeedbacks);
  }, []);

  const validateName = (name) => {
    // Name should be 2-50 characters, only letters, spaces, hyphens, and apostrophes
    const re = /^[a-zA-Z\s'-]{2,50}$/;
    return re.test(name.trim());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    // Validate on blur for better UX
    if (name === 'name' && value.trim()) {
      if (!validateName(value)) {
        setErrors((prev) => ({
          ...prev,
          name: 'Name should be 2-50 characters and contain only letters, spaces, hyphens, or apostrophes',
        }));
      }
    } else if (name === 'comments' && value.trim()) {
      if (value.trim().length < 10) {
        setErrors((prev) => ({
          ...prev,
          comments: 'Comments must be at least 10 characters long',
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Name should be 2-50 characters and contain only letters, spaces, hyphens, or apostrophes';
    }

    // Comments validation
    if (!formData.comments.trim()) {
      newErrors.comments = 'Comments are required';
    } else if (formData.comments.trim().length < 10) {
      newErrors.comments = 'Comments must be at least 10 characters long';
    } else if (formData.comments.trim().length > 500) {
      newErrors.comments = 'Comments must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const newFeedback = {
        ...formData,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      };

      // Save to localStorage
      const updatedFeedbacks = [newFeedback, ...feedbacks];
      localStorage.setItem('feedbacks', JSON.stringify(updatedFeedbacks));
      setFeedbacks(updatedFeedbacks);

      // Reset form
      setFormData({
        name: '',
        rating: 5,
        comments: '',
      });
      setIsSubmitted(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
      >
        ★
      </span>
    ));
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Feedback
          </h1>
          <p className="text-gray-600">
            We value your opinion! Share your experience with us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feedback Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Share Your Feedback
            </h2>

            {isSubmitted && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                <p className="font-semibold">Thank you for your feedback!</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={50}
                  className={`input-field ${errors.name ? 'border-red-500' : formData.name && !errors.name ? 'border-green-500' : ''}`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="range"
                    id="rating"
                    name="rating"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={handleChange}
                    className="flex-1"
                  />
                  <span className="text-2xl font-bold text-primary-600 w-12 text-center">
                    {formData.rating}
                  </span>
                </div>
                <div className="flex text-2xl">
                  {renderStars(parseInt(formData.rating))}
                </div>
              </div>

              <div>
                <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
                  Comments <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={5}
                  maxLength={500}
                  className={`input-field ${errors.comments ? 'border-red-500' : formData.comments && !errors.comments && formData.comments.trim().length >= 10 ? 'border-green-500' : ''}`}
                  placeholder="Tell us about your experience..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.comments.length}/500 characters
                </p>
                {errors.comments && (
                  <p className="mt-1 text-sm text-red-500">{errors.comments}</p>
                )}
              </div>

              <button type="submit" className="btn-primary w-full">
                Submit Feedback
              </button>
            </form>
          </div>

          {/* Feedback List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Recent Feedback
            </h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {feedbacks.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600">No feedback yet. Be the first to share!</p>
                </div>
              ) : (
                feedbacks.map((feedback) => (
                  <div key={feedback.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">{feedback.name}</h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(feedback.timestamp)}
                        </p>
                      </div>
                      <div className="flex text-lg">
                        {renderStars(parseInt(feedback.rating))}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{feedback.comments}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;

