// Self-check for the shared price logic. Run: node src/lib/pricing.check.mts
import assert from 'node:assert/strict';
import { getCurrentPrice, hasDiscount, toNumber, validateNewPrice } from './pricing.ts';

// toNumber: coerces the Decimal-as-string shape the raw properties-list API
// returns, leaves already-numeric values (post-modal-save) alone.
assert.equal(toNumber('6950000'), 6950000, 'numeric string is coerced');
assert.equal(toNumber(6950000), 6950000, 'number passes through');
assert.equal(toNumber(null), 0, 'null coerces to 0');
assert.equal(toNumber(undefined), 0, 'undefined coerces to 0');
assert.equal(toNumber(''), 0, 'empty string coerces to 0');
assert.equal(toNumber('0'), 0, 'string zero coerces to 0');

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

// validateNewPrice: positive numbers only
assert.equal(validateNewPrice(0, 500), 'notPositive', 'old price must be positive');
assert.equal(validateNewPrice(1000000, 0), 'notPositive', 'new price must be positive');
assert.equal(validateNewPrice(1000000, -500), 'notPositive', 'new price cannot be negative');

// validateNewPrice: new price must be strictly lower than old price (discount, never a markup)
assert.equal(validateNewPrice(1000000, 1000000), 'notLower', 'equal price is rejected');
assert.equal(validateNewPrice(1000000, 1200000), 'notLower', 'a higher price is rejected');
assert.equal(validateNewPrice(1000000, 900000), null, 'a lower price is valid');

console.log('ok - pricing rules hold');
