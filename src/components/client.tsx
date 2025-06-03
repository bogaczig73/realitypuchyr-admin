'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

interface Review {
    id: number;
    name: string;
    description: string;
    rating: number;
    createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Client() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_URL}/reviews`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Ensure data is an array
        if (!Array.isArray(data)) {
          throw new Error('Received data is not an array');
        }
        
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

    fetchReviews();
  }, []);

  if (loading) {
    return <div className="text-center">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!reviews.length) {
    return <div className="text-center">No reviews found</div>;
  }

  return (
    <div className="">
      <ResponsiveMasonry
        columnsCountBreakPoints={{350: 1, 750: 2, 900: 3, 1200: 4}}
      >
        <Masonry>
          {reviews.map((review) => (
            <div className="picture-item p-3" key={review.id}>
              <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm dark:shadow-gray-800 p-6">
                <div className="flex items-center pb-6 border-b border-gray-100 dark:border-gray-800">
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
    </div>
  )
}
