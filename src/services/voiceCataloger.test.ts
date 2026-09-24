/**
 * SHILP-AI VoiceCataloger Unit Tests
 *
 * Tests multilingual (English, Hindi, Roman Hindi/Hinglish, Telugu) extraction
 * for all five required test cases.
 *
 * Run with: npx vitest run  (or: npx jest)
 * These are plain TypeScript so they work without a build.
 */

import { VoiceCatalogerEngine } from './voiceCataloger';

// Helper to check an extracted attribute by name (no test runner assertion)
function assertEqual(label: string, actual: unknown, expected: unknown): void {
  const pass = actual === expected;
  if (pass) {
    console.log(`  ✅ ${label}: ${JSON.stringify(actual)}`);
  } else {
    console.error(`  ❌ ${label}: got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
  }
}

function assertNotEqual(label: string, actual: unknown, notExpected: unknown): void {
  const pass = actual !== notExpected;
  if (pass) {
    console.log(`  ✅ ${label}: ${JSON.stringify(actual)} (is NOT ${JSON.stringify(notExpected)})`);
  } else {
    console.error(`  ❌ ${label}: should NOT be ${JSON.stringify(notExpected)}, but got ${JSON.stringify(actual)}`);
  }
}

function assertContains(label: string, actual: string | null, needle: string): void {
  const pass = !!actual && actual.toLowerCase().includes(needle.toLowerCase());
  if (pass) {
    console.log(`  ✅ ${label} contains "${needle}": ${JSON.stringify(actual)}`);
  } else {
    console.error(`  ❌ ${label} should contain "${needle}": got ${JSON.stringify(actual)}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST A — Hinglish Kanchipuram saree
// Transcript: Roman Hindi mixed with English product terms
// ─────────────────────────────────────────────────────────────────────────────
function testA() {
  console.log('\n── TEST A: Hinglish Kanchipuram saree ──');
  const transcript =
    'yah Neeli Rang ki Kanchipuram silk saree Hai ismein sunhara Jari ka kam aur paramparik Phoolon ke design hai iska border sunahre Jari se banaa hai';

  const result = VoiceCatalogerEngine.extractAttributesFromSpeech(transcript);

  assertEqual('productType', result.productType, 'Saree');
  assertEqual('style', result.style, 'Kanchipuram');
  // Material: silk is mentioned → extracted as 'Silk' (fabricType) or primaryMaterial = 'Silk'
  const silkExtracted =
    result.fabricType?.toLowerCase().includes('silk') ||
    result.primaryMaterial?.toLowerCase().includes('silk');
  assertEqual('material = Silk (via fabricType or primaryMaterial)', silkExtracted, true);
  assertEqual('color', result.color, 'Blue');
  assertContains('zariType', result.zariType, 'golden zari');
  assertContains('pattern', result.pattern, 'floral');
  assertContains('borderColor', result.borderColor, 'zari');
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST B — Cream handwoven shawl with floral border
// ─────────────────────────────────────────────────────────────────────────────
function testB() {
  console.log('\n── TEST B: Cream handwoven shawl ──');
  const transcript =
    'This is a cream-colored handwoven shawl with golden and pink floral designs and a pink-and-gold border.';

  const result = VoiceCatalogerEngine.extractAttributesFromSpeech(transcript);

  assertEqual('color', result.color, 'Cream');
  assertEqual('weavingMethod', result.weavingMethod, 'Handwoven');
  assertContains('pattern', result.pattern, 'floral');
  assertContains('borderColor', result.borderColor, 'Pink');
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST C — 100% zari + mulberry silk
// ─────────────────────────────────────────────────────────────────────────────
function testC() {
  console.log('\n── TEST C: 100% zari and mulberry silk ──');
  const transcript = 'This Banarasi saree is made with 100% zari and mulberry silk.';

  const result = VoiceCatalogerEngine.extractAttributesFromSpeech(transcript);

  assertContains('zariType', result.zariType, '100%');
  assertContains('fabricType', result.fabricType, 'Mulberry');
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST D — Hand embroidered + natural dye
// ─────────────────────────────────────────────────────────────────────────────
function testD() {
  console.log('\n── TEST D: Hand embroidered + natural dye ──');
  const transcript =
    'This is a hand embroidered cotton kurta using natural dye made from turmeric.';

  const result = VoiceCatalogerEngine.extractAttributesFromSpeech(transcript);

  assertContains('constructionMethod', result.constructionMethod, 'embroidered');
  assertContains('dyeType', result.dyeType, 'Natural');
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST E — Generic murti must NOT be classified as Dhokra
// ─────────────────────────────────────────────────────────────────────────────
function testE() {
  console.log('\n── TEST E: Generic murti — must NOT be Dhokra ──');
  const transcript = 'Yeh ek murti hai. Ganesha ki murti.';

  const result = VoiceCatalogerEngine.extractAttributesFromSpeech(transcript);

  assertNotEqual('category must NOT be Metalcraft & Dhokra', result.category, 'Metalcraft & Dhokra');
  console.log(`     category: ${result.category}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Run all tests
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n=== Shilp-AI VoiceCataloger Tests ===');
testA();
testB();
testC();
testD();
testE();
console.log('\n=== Done ===\n');
