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
 * Validates a new price against the *current* price (getCurrentPrice) for
 * the change-price modal - the actual number a buyer pays today, always
 * read from the property and never something the user can edit or inflate.
 * "Change price" only ever lowers what a buyer pays, so the new price must
 * be positive and strictly lower than the current price: a value between an
 * active discount and the original asking price is still a markup and is
 * rejected, exactly like a value at or above an undiscounted asking price.
 */
export function validateNewPrice(currentPrice: number, newPrice: number | null): PriceValidationError | null {
    if (newPrice === null || Number.isNaN(newPrice)) return 'required';
    if (!(currentPrice > 0) || !(newPrice > 0)) return 'notPositive';
    if (!(newPrice < currentPrice)) return 'notLower';
    return null;
}

/**
 * What a "change price" save writes. "Change price" is a discount action
 * only - the modal never lets a user edit the asking price, so `price` is
 * never taken from user input. The first discount on a listing writes
 * `price` once, from the property's own asking price, alongside the new
 * discountedPrice. Every discount after that only moves discountedPrice;
 * `price` is never sent again, so a caller can't accidentally collapse the
 * original asking price into today's price.
 */
export function buildPriceChangePayload(
    discountAlreadyActive: boolean,
    askingPrice: number,
    newPrice: number
): { price: number; discountedPrice: number } | { discountedPrice: number } {
    return discountAlreadyActive
        ? { discountedPrice: newPrice }
        : { price: askingPrice, discountedPrice: newPrice };
}

/** Clearing a discount nulls discountedPrice and never touches price. */
export function buildClearDiscountPayload(): { discountedPrice: null } {
    return { discountedPrice: null };
}
