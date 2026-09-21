// Plain-node assert check for the price logic in src/lib/pricing.ts.
// No test runner in this repo; run directly: node scripts/check-pricing.mjs
//
// Mirrors src/lib/pricing.ts exactly (plain .mjs can't import .ts without a
// loader). If you change the rules there, change them here too.
import assert from 'node:assert/strict'

function getCurrentPrice(price, discountedPrice) {
    return discountedPrice ?? price
}

function validateNewPrice(oldPrice, newPrice) {
    if (newPrice === null || Number.isNaN(newPrice)) return 'required'
    if (!(oldPrice > 0) || !(newPrice > 0)) return 'notPositive'
    if (!(newPrice < oldPrice)) return 'notLower'
    return null
}

// getCurrentPrice: discounted price wins when set, else the asking price.
assert.equal(getCurrentPrice(1000000, 800000), 800000, 'discounted price should be current')
assert.equal(getCurrentPrice(1000000, null), 1000000, 'asking price should be current when no discount')

// validateNewPrice: required
assert.equal(validateNewPrice(1000000, null), 'required', 'missing new price is required')

// validateNewPrice: positive numbers only
assert.equal(validateNewPrice(0, 500), 'notPositive', 'old price must be positive')
assert.equal(validateNewPrice(1000000, 0), 'notPositive', 'new price must be positive')
assert.equal(validateNewPrice(1000000, -500), 'notPositive', 'new price cannot be negative')

// validateNewPrice: new price must be strictly lower than old price (discount, never a markup)
assert.equal(validateNewPrice(1000000, 1000000), 'notLower', 'equal price is rejected')
assert.equal(validateNewPrice(1000000, 1200000), 'notLower', 'a higher price is rejected')
assert.equal(validateNewPrice(1000000, 900000), null, 'a lower price is valid')

console.log('check-pricing: all assertions passed')
