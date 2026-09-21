/**
 * Price semantics shared by the properties list, detail page, and the
 * change-price modal: `price` is the original asking price, `discountedPrice`
 * (when set and greater than zero) is what the property costs now.
 *
 * `getProperties` returns raw API data where a Prisma `Decimal` serializes to
 * a JSON string (e.g. "6950000"), while a row updated in-memory through the
 * change-price modal already holds numbers. Every price value coming from
 * either source must go through `toNumber` before it's displayed or compared.
 */

type PriceInput = number | string | null | undefined;

/** Coerces a raw price value (number, numeric string, or absent) to a number. */
export function toNumber(value: PriceInput): number {
    if (typeof value === 'number') return value;
    if (value === null || value === undefined || value === '') return 0;
    const n = parseFloat(value);
    return Number.isNaN(n) ? 0 : n;
}

/** True when the property has an active discount (a stored 0 does not count). */
export function hasDiscount(discountedPrice: PriceInput): boolean {
    return toNumber(discountedPrice) > 0;
}

/** The price to show as "current" — the discount if there is one, else the asking price. */
export function getCurrentPrice(price: PriceInput, discountedPrice: PriceInput): number {
    return hasDiscount(discountedPrice) ? toNumber(discountedPrice) : toNumber(price);
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
