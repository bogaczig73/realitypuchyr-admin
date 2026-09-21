'use client'
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { propertyService } from '@/api/services/property'
import {
    validateNewPrice,
    buildPriceChangePayload,
    buildClearDiscountPayload,
    getCurrentPrice,
    hasDiscount,
    toNumber,
    PriceValidationError
} from '@/lib/pricing'
import { Property } from '@/types/property'

interface ChangePriceModalProps {
    property: Property
    locale: string
    onSaved: (updated: Property) => void
    onCancel: () => void
}

export default function ChangePriceModal({ property, locale, onSaved, onCancel }: ChangePriceModalProps) {
    const t = useTranslations('properties.changePrice')

    const askingPrice = toNumber(property.price)
    const discountAlreadyActive = hasDiscount(property.discountedPrice)
    const startingCurrentPrice = getCurrentPrice(property.price, property.discountedPrice)

    const [currentPrice, setCurrentPrice] = useState(String(startingCurrentPrice))
    const [newPrice, setNewPrice] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [busyAction, setBusyAction] = useState<'save' | 'clear' | null>(null)

    // Explicit literal t() calls so scripts/check-i18n.mjs can see every key
    // it needs to verify — a template-literal lookup is invisible to it.
    const validationMessages: Record<PriceValidationError, string> = {
        required: t('errors.required'),
        notPositive: t('errors.notPositive'),
        notLower: t('errors.notLower')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const currentValue = parseFloat(currentPrice)
        const newValue = newPrice === '' ? null : parseFloat(newPrice)
        const validationError = validateNewPrice(currentValue, newValue)

        if (validationError) {
            setError(validationMessages[validationError])
            return
        }

        setBusyAction('save')
        try {
            const payload = buildPriceChangePayload(discountAlreadyActive, currentValue, newValue as number)
            const updated = await propertyService.updateProperty(property.id, payload, locale)
            onSaved(updated)
        } catch (err) {
            console.error('Failed to save property price:', err)
            setError(t('errors.saveFailed'))
        } finally {
            setBusyAction(null)
        }
    }

    const handleClearDiscount = async () => {
        setError(null)
        setBusyAction('clear')
        try {
            const updated = await propertyService.updateProperty(property.id, buildClearDiscountPayload(), locale)
            onSaved(updated)
        } catch (err) {
            console.error('Failed to clear property discount:', err)
            setError(t('errors.saveFailed'))
        } finally {
            setBusyAction(null)
        }
    }

    const busy = busyAction !== null

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
                    {discountAlreadyActive && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {t('askingPrice')}: <span className="font-medium">{askingPrice.toLocaleString()} Kč</span>
                        </div>
                    )}

                    <div>
                        <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('oldPrice')}
                        </label>
                        <input
                            type="number"
                            id="currentPrice"
                            name="currentPrice"
                            min="0"
                            step="0.01"
                            value={currentPrice}
                            onChange={(e) => setCurrentPrice(e.target.value)}
                            disabled={discountAlreadyActive}
                            required
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
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

                    <div className="flex justify-between items-center pt-4">
                        {discountAlreadyActive ? (
                            <button
                                type="button"
                                onClick={handleClearDiscount}
                                disabled={busy}
                                className="px-4 py-2 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {busyAction === 'clear' ? t('clearing') : t('clearDiscount')}
                            </button>
                        ) : <span />}

                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={busy}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {busyAction === 'save' ? t('saving') : t('save')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
