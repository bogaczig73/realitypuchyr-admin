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
 * Validates a new price against the *current* price for the change-price
 * modal (the asking price if there is no discount yet, the active discount
 * if there is). Both must be positive; the new price must be lower than the
 * current price (discountedPrice is a discount, never a markup) - comparing
 * against the original asking price on an already-discounted property would
 * let a price rise past the current discount while still reading as "lower".
 */
export function validateNewPrice(currentPrice: number, newPrice: number | null): PriceValidationError | null {
    if (newPrice === null || Number.isNaN(newPrice)) return 'required';
    if (!(currentPrice > 0) || !(newPrice > 0)) return 'notPositive';
    if (!(newPrice < currentPrice)) return 'notLower';
    return null;
}

/**
 * What a "change price" save writes. Once a discount is already active, the
 * modal's current-price field is a read-only reference (edits to it are not
 * sent - allowing that would let the "must be lower" check be gamed by
 * inflating the reference), so only discountedPrice moves and the original
 * asking price is left exactly alone. Before any discount exists there's no
 * distinction yet - the current-price field *is* the asking price - so it is
 * still editable and is written as `price` alongside the new discount.
 */
export function buildPriceChangePayload(
    discountAlreadyActive: boolean,
    currentPrice: number,
    newPrice: number
): { price: number; discountedPrice: number } | { discountedPrice: number } {
    return discountAlreadyActive
        ? { discountedPrice: newPrice }
        : { price: currentPrice, discountedPrice: newPrice };
}

/** Clearing a discount nulls discountedPrice and never touches price. */
export function buildClearDiscountPayload(): { discountedPrice: null } {
    return { discountedPrice: null };
}
