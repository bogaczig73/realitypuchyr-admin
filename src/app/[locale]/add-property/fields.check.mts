// Self-check for the form <-> API mapping. Run: node src/app/\[locale\]/add-property/fields.check.mts
import assert from 'node:assert/strict';
import { ALL_FIELDS, emptyForm, toPayload, validate } from './fields.ts';

// Field names are unique - a duplicate would make two inputs share one state key.
const names = ALL_FIELDS.map(f => f.name);
assert.equal(new Set(names).size, names.length, 'duplicate field name');

// Empty form: required fields are flagged, nothing else is.
const empty = emptyForm();
const emptyErrors = validate(empty);
assert.deepEqual(
    Object.keys(emptyErrors).sort(),
    ALL_FIELDS.filter(f => f.required).map(f => f.name).sort()
);

const filled = {
    ...empty,
    name: 'Prodej bytu 3+kk',
    categoryId: '2',
    price: '6950000',
    description: 'Popis',
    size: '78.5',
    beds: '2',
    priceHidden: true,
    latitude: '-49.2'
};

assert.deepEqual(validate(filled), {}, 'valid form should have no errors');

const payload = toPayload(filled);
assert.equal(payload.categoryId, 2, 'categoryId must be a number');
assert.equal(payload.price, 6950000);
assert.equal(payload.size, 78.5, 'areas keep decimals');
assert.equal(payload.beds, 2);
assert.equal(payload.priceHidden, true, 'checkbox stays boolean');
assert.equal(payload.city, null, 'untouched fields go over as null, not ""');
assert.equal(payload.latitude, -49.2, 'negative coordinates survive');
assert.equal(Object.keys(payload).length, ALL_FIELDS.length, 'payload covers every field');

// Rejections
assert.ok(validate({ ...filled, size: '-5' }).size, 'negative area rejected');
assert.ok(validate({ ...filled, reconstructionYearBuilding: '1500' }).reconstructionYearBuilding, 'impossible year rejected');
assert.ok(validate({ ...filled, latitude: '120' }).latitude, 'out-of-range latitude rejected');
assert.ok(!validate({ ...filled, latitude: '-49.2' }).latitude, 'negative latitude allowed');

console.log(`ok - ${ALL_FIELDS.length} fields map cleanly`);
