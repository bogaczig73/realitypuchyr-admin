'use client'
import React, { useState, useEffect } from 'react'
import { reviewService } from '@/api/services/reviews'
import { CreateReviewRequest, Review } from '@/types/property'
import { propertyService } from '@/api/services/property'
import { Property } from '@/types/property'

interface EditReviewProps {
  review?: Review;
  onReviewSaved: () => void;
  onCancel: () => void;
}

export default function EditReview({ review, onReviewSaved, onCancel }: EditReviewProps) {
  const [formData, setFormData] = useState<CreateReviewRequest>({
    name: review?.name || '',
    description: review?.description || '',
    rating: review?.rating || 5,
    propertyId: review?.propertyId || undefined
  })
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!review

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await propertyService.getProperties(1, 100, '', 'en')
        setProperties(data.properties)
      } catch (error) {
        console.error('Error fetching properties:', error)
      }
    }
    fetchProperties()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isEditing && review) {
        await reviewService.updateReview(review.id, formData)
      } else {
        await reviewService.createReview(formData)
      }
      onReviewSaved()
    } catch (error) {
      console.error('Error saving review:', error)
      setError(`Failed to ${isEditing ? 'update' : 'create'} review. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' || name === 'propertyId' ? (value ? parseInt(value) : undefined) : value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Review' : 'Add New Review'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <i className="mdi mdi-close text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:text-white"
              placeholder="Enter reviewer name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Review *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:text-white"
              placeholder="Enter your review"
            />
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rating *
            </label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:text-white"
            >
              <option value={5}>5 Stars - Excellent</option>
              <option value={4}>4 Stars - Very Good</option>
              <option value={3}>3 Stars - Good</option>
              <option value={2}>2 Stars - Fair</option>
              <option value={1}>1 Star - Poor</option>
            </select>
          </div>

          <div>
            <label htmlFor="propertyId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Property (Optional)
            </label>
            <select
              id="propertyId"
              name="propertyId"
              value={formData.propertyId || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:text-white"
            >
              <option value="">Select a property (optional)</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Review' : 'Add Review')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 