import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeRiskScore } from './riskScore.js';

test('normalizes numeric risk scores within 0-100', () => {
  assert.equal(normalizeRiskScore(45, 'Unsafe'), 45);
  assert.equal(normalizeRiskScore('72', 'Unsafe'), 72);
  assert.equal(normalizeRiskScore(150, 'Unsafe'), 100);
  assert.equal(normalizeRiskScore(-10, 'Unsafe'), 0);
});

test('falls back to safe/unsafe defaults when the API score is missing', () => {
  assert.equal(normalizeRiskScore(null, 'Safe'), 0);
  assert.equal(normalizeRiskScore(undefined, 'Unsafe'), 100);
  assert.equal(normalizeRiskScore('not-a-number', 'Unsafe'), 100);
});
