const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { hasPermission, isAdminRole } = require('../middleware/permissions');
const ApiError = require('../utils/ApiError');

describe('permissions', () => {
  it('super_admin has all permissions', () => {
    assert.equal(hasPermission('super_admin', 'orders'), true);
    assert.equal(hasPermission('super_admin', 'anything'), true);
  });

  it('catalog_manager has product permissions only', () => {
    assert.equal(hasPermission('catalog_manager', 'products'), true);
    assert.equal(hasPermission('catalog_manager', 'orders'), false);
  });

  it('isAdminRole identifies admin roles', () => {
    assert.equal(isAdminRole('admin'), true);
    assert.equal(isAdminRole('customer'), false);
  });
});

describe('ApiError', () => {
  it('creates error with status and code', () => {
    const err = new ApiError('Not found', 404, 'NOT_FOUND');
    assert.equal(err.message, 'Not found');
    assert.equal(err.statusCode, 404);
    assert.equal(err.code, 'NOT_FOUND');
  });
});

describe('gold pricing', () => {
  it('returns fixed price for non-dynamic products', async () => {
    const { calculateGoldPrice } = require('../services/goldPricingService');
    const product = { pricingMode: 'fixed', price: 50000, mrp: 55000 };
    const result = await calculateGoldPrice(product);
    assert.equal(result.price, 50000);
    assert.equal(result.mrp, 55000);
    assert.equal(result.breakdown, null);
  });
});
