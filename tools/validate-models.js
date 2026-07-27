#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const filePath = path.join(repoRoot, 'assets', 'models.json');
const requiredNumeric = [
  'latency',
  'accuracy',
  'reasoning',
  'coding',
  'instruction',
  'halluc',
  'calibration',
  'visual',
  'handwriting',
  'codeToTalk',
  'safety',
];

function parseModels(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.models)) return payload.models;
  return [];
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

let payload;
try {
  payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));
} catch (err) {
  console.error(`[validate-models] Failed to read ${filePath}: ${err.message}`);
  process.exit(1);
}

const models = parseModels(payload);
if (!models.length) {
  console.error('[validate-models] No models found in assets/models.json');
  process.exit(1);
}

let fullyNumericRows = 0;
let rowsWithSignal = 0;
let warningCount = 0;

models.forEach((model, index) => {
  const label = model && model.name ? model.name : `#${index + 1}`;
  let numericCount = 0;
  let nonZeroCount = 0;

  requiredNumeric.forEach((field) => {
    const value = model ? model[field] : undefined;
    if (!isFiniteNumber(value)) {
      console.warn(`[warn] ${label}: missing/non-numeric ${field}`);
      warningCount += 1;
      return;
    }

    numericCount += 1;
    if (value === 0) {
      console.warn(`[warn] ${label}: ${field} is 0`);
      warningCount += 1;
    } else {
      nonZeroCount += 1;
    }
  });

  if (numericCount === requiredNumeric.length) fullyNumericRows += 1;
  if (nonZeroCount > 0) rowsWithSignal += 1;
});

console.log(`[validate-models] Checked ${models.length} model(s).`);
console.log(`[validate-models] Fully numeric rows: ${fullyNumericRows}/${models.length}`);
console.log(`[validate-models] Rows with at least one non-zero metric: ${rowsWithSignal}/${models.length}`);
if (warningCount) console.log(`[validate-models] Warnings: ${warningCount}`);

if (rowsWithSignal === 0) {
  console.error('[validate-models] All rows are invalid (no non-zero numeric metrics found).');
  process.exit(1);
}
