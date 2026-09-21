// Self-check for the shared price logic. Run: node src/lib/pricing.check.mts
import assert from 'node:assert/strict';
import {
    getCurrentPrice, hasDiscount, toNumber, validateNewPrice,
    buildPriceChangePayload, buildClearDiscountPayload
} from './pricing.ts';

// toNumber: coerces the Decimal-as-string shape the raw properties-list API
// returns, leaves already-numeric values (post-modal-save) alone.
assert.equal(toNumber('6950000'), 6950000, 'numeric string is coerced');
assert.equal(toNumber(6950000), 6950000, 'number passes through');
assert.equal(toNumber(null), 0, 'null coerces to 0');
assert.equal(toNumber(undefined), 0, 'undefined coerces to 0');
assert.equal(toNumber(''), 0, 'empty string coerces to 0');
assert.equal(toNumber('0'), 0, 'string zero coerces to 0');
assert.equal(toNumber('abc'), 0, 'non-numeric string coerces to 0');

// hasDiscount: a stored 0 (string or number) is not an active discount.
assert.equal(hasDiscount('0'), false, 'string zero is not a discount');
assert.equal(hasDiscount(0), false, 'numeric zero is not a discount');
assert.equal(hasDiscount(null), false, 'null is not a discount');
assert.equal(hasDiscount('500000'), true, 'a positive stored string is a discount');
assert.equal(hasDiscount(500000), true, 'a positive number is a discount');

// getCurrentPrice: discounted price wins when active, else the asking price;
// works across the string (list API) and number (post-save) shapes.
assert.equal(getCurrentPrice('1000000', '800000'), 800000, 'discounted price should be current (strings)');
assert.equal(getCurrentPrice(1000000, 800000), 800000, 'discounted price should be current (numbers)');
assert.equal(getCurrentPrice(1000000, null), 1000000, 'asking price should be current when no discount');
assert.equal(getCurrentPrice('1000000', '0'), 1000000, 'a stored 0 discount falls back to the asking price');

// validateNewPrice: required
assert.equal(validateNewPrice(1000000, null), 'required', 'missing new price is required');
assert.equal(validateNewPrice(1000000, NaN), 'required', 'a NaN new price is required, not silently treated as invalid-positive');

// validateNewPrice: positive numbers only
assert.equal(validateNewPrice(0, 500), 'notPositive', 'old price must be positive');
assert.equal(validateNewPrice(1000000, 0), 'notPositive', 'new price must be positive');
assert.equal(validateNewPrice(1000000, -500), 'notPositive', 'new price cannot be negative');

// validateNewPrice: new price must be strictly lower than old price (discount, never a markup)
assert.equal(validateNewPrice(1000000, 1000000), 'notLower', 'equal price is rejected');
assert.equal(validateNewPrice(1000000, 1200000), 'notLower', 'a higher price is rejected');
assert.equal(validateNewPrice(1000000, 900000), null, 'a lower price is valid');

// validateNewPrice must be called against the *current* price, not the
// original asking price - the bug this session fixed. A property asking
// 5,000,000 already discounted to 4,500,000: 4,800,000 reads as "lower than
// asking" but is a markup over what the buyer pays today, and must be
// rejected once validated against the actual current price.
{
    const current = getCurrentPrice(5000000, 4500000);
    assert.equal(current, 4500000, 'sanity: current price is the active discount');
    assert.equal(validateNewPrice(current, 4800000), 'notLower', 'a price between the discount and the asking price is still a markup');
    assert.equal(validateNewPrice(current, 4200000), null, 'a price below the active discount is a valid further discount');
}

// buildPriceChangePayload: before any discount exists, the current-price field
// *is* the asking price, so it is still writable alongside the new discount.
assert.deepEqual(
    buildPriceChangePayload(false, 5000000, 4500000),
    { price: 5000000, discountedPrice: 4500000 },
    'first discount writes both price and discountedPrice'
);

// Once a discount is already active, saving must never send `price` - even a
// current-price value equal to the real one would collapse the original
// asking price the moment a caller forgets to omit it.
{
    const payload = buildPriceChangePayload(true, 4500000, 4200000);
    assert.deepEqual(payload, { discountedPrice: 4200000 }, 'a further discount only ever writes discountedPrice');
    assert.equal('price' in payload, false, 'price must be absent, not just unchanged, once a discount is active');
}

// buildClearDiscountPayload: discountedPrice must be an explicit null, not
// omitted - the server's partial-update fix leaves absent fields untouched,
// so only an explicit null actually clears the column. Check it survives
// JSON serialization the way axios sends it (JSON.stringify drops undefined
// keys but keeps null ones).
{
    const payload = buildClearDiscountPayload();
    assert.equal('discountedPrice' in payload, true, 'discountedPrice key must be present');
    assert.equal(payload.discountedPrice, null, 'discountedPrice must be explicitly null');
    assert.equal('price' in payload, false, 'clearing a discount must not touch price');
    assert.equal(JSON.stringify(payload), '{"discountedPrice":null}', 'the null must survive JSON serialization, not get dropped like undefined would');
}

console.log('ok - pricing rules hold');
