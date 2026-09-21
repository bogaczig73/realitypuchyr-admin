/**
 * Price semantics shared by the properties list, detail page, and the
 * change-price modal: `price` is the original asking price, `discountedPrice`
 * (when set) is what the property costs now.
 */

/** The price to show as "current" — the discount if there is one, else the asking price. */
export function getCurrentPrice(price: number, discountedPrice: number | null): number {
    return discountedPrice ?? price;
}

export type PriceValidationError = 'required' | 'notPositive' | 'notLower';

/**
 * Validates a new price against the old one for the change-price modal.
 * Both must be positive; the new price must be lower than the old price
 * (discountedPrice is a discount, never a markup).
 */
export function validateNewPrice(oldPrice: number, newPrice: number | null): PriceValidationError | null {
    if (newPrice === null || Number.isNaN(newPrice)) return 'required';
    if (!(oldPrice > 0) || !(newPrice > 0)) return 'notPositive';
    if (!(newPrice < oldPrice)) return 'notLower';
    return null;
}
