'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import { reviewService } from '@/api/services/reviews'
import { Review } from '@/types/property'
import EditReview from './editReview'

export default function Client() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditReview, setShowEditReview] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | undefined>(undefined);
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);

  const fetchReviews = async () => {
    try {
      const data = await reviewService.getReviews();
      setReviews(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
      setReviews([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReviewSaved = () => {
    setShowEditReview(false);
    setEditingReview(undefined);
    fetchReviews(); // Refresh the reviews list
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowEditReview(true);
  };

  const handleAddReview = () => {
    setEditingReview(undefined);
    setShowEditReview(true);
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    setDeletingReviewId(reviewId);
    try {
      await reviewService.deleteReview(reviewId);
      fetchReviews(); // Refresh the reviews list
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    } finally {
      setDeletingReviewId(null);
    }
  };

  if (loading) {
    return <div className="text-center">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h6 className="text-lg font-semibold">All Reviews ({reviews.length})</h6>
        <button
          onClick={handleAddReview}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <i className="mdi mdi-plus"></i>
          Add New Review
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            <i className="mdi mdi-star-outline text-4xl"></i>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">No reviews found</p>
          <button
            onClick={handleAddReview}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Add First Review
          </button>
        </div>
      ) : (
        <ResponsiveMasonry
          columnsCountBreakPoints={{350: 1, 750: 2, 900: 3, 1200: 4}}
        >
          <Masonry>
            {reviews.map((review) => (
              <div className="picture-item p-3" key={review.id}>
                <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm dark:shadow-gray-800 p-6">
                  <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center">
                      <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-2xl text-gray-500 dark:text-gray-400">
                          {review.name.charAt(0)}
                        </span>
                      </div>

                      <div className="ps-4">
                        <Link href="" className="text-lg hover:text-green-600 duration-500 ease-in-out">{review.name}</Link>
                        <p className="text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Edit review"
                      >
                        <i className="mdi mdi-pencil text-lg"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        disabled={deletingReviewId === review.id}
                        className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Delete review"
                      >
                        <i className={`mdi ${deletingReviewId === review.id ? 'mdi-loading mdi-spin' : 'mdi-delete'} text-lg`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-slate-400">{review.description}</p>
                    <ul className="list-none mb-0 text-amber-400 mt-2">
                      {[...Array(review.rating)].map((_, i) => (
                        <li key={i} className="inline"><i className="mdi mdi-star"></i></li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      )}

      {showEditReview && (
        <EditReview
          review={editingReview}
          onReviewSaved={handleReviewSaved}
          onCancel={() => {
            setShowEditReview(false);
            setEditingReview(undefined);
          }}
        />
      )}
    </div>
  )
}
