'use client'
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { propertyService } from '@/api/services/property'
import { validateNewPrice } from '@/lib/pricing'
import { Property } from '@/types/property'
import { ApiError } from '@/api/errors'

interface ChangePriceModalProps {
    property: Property
    locale: string
    onSaved: (updated: Property) => void
    onCancel: () => void
}

export default function ChangePriceModal({ property, locale, onSaved, onCancel }: ChangePriceModalProps) {
    const t = useTranslations('properties.changePrice')
    const [oldPrice, setOldPrice] = useState(String(property.price))
    const [newPrice, setNewPrice] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const oldValue = parseFloat(oldPrice)
        const newValue = newPrice === '' ? null : parseFloat(newPrice)
        const validationError = validateNewPrice(oldValue, newValue)

        if (validationError) {
            setError(t(`errors.${validationError}`))
            return
        }

        setSaving(true)
        try {
            const updated = await propertyService.updateProperty(property.id, {
                price: oldValue,
                discountedPrice: newValue
            }, locale)
            onSaved(updated)
        } catch (err) {
            const message = err instanceof ApiError ? err.message : t('errors.saveFailed')
            setError(message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('title')}
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
                        <label htmlFor="oldPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('oldPrice')}
                        </label>
                        <input
                            type="number"
                            id="oldPrice"
                            name="oldPrice"
                            min="0"
                            step="0.01"
                            value={oldPrice}
                            onChange={(e) => setOldPrice(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:text-white"
                        />
                    </div>

                    <div>
                        <label htmlFor="newPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('newPrice')}
                        </label>
                        <input
                            type="number"
                            id="newPrice"
                            name="newPrice"
                            min="0"
                            step="0.01"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:text-white"
                        />
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
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {saving ? t('saving') : t('save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
