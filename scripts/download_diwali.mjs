import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CRAFT_FACETS = new Set(['textiles', 'arts', 'jwellery', 'clothing', 'architectures']);

const CRAFT_KEYWORDS = [
  'saree', 'sari', 'ikat', 'dhokra', 'dokra', 'terracotta', 'pottery', 'madhubani', 'mithila',
  'pashmina', 'brass', 'handloom', 'weaving', 'craft', 'wood', 'embroidery', 'silk', 'zari',
  'channapatna', 'toy', 'kosa', 'kasuti', 'lambani', 'bhagalpuri', 'chikankari', 'kantha',
  'phulkari', 'bandhani', 'tanjore', 'patachitra', 'pattachitra', 'kalamkari', 'warli', 'gond',
  'blue pottery', 'metalwork', 'carving', 'jewellery', 'jewelry', 'ornament', 'pendant', 'necklace'
];

async function downloadAndFilterDiwali() {
  console.log('Downloading DIWALI dataset from HuggingFace...');
  const url = 'https://huggingface.co/datasets/nlip/DIWALI/raw/main/DIWALIv1.jsonl';
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download DIWALI dataset: ${response.statusText}`);
  }

  const text = await response.text();
  const lines = text.split('\n');
  
  const filtered = [];
  let totalCount = 0;

  for (const line of lines) {
    if (!line.trim()) continue;
    totalCount++;
    try {
      const record = JSON.parse(line);
      const facet = (record.facet || '').toLowerCase().trim();
      const concept = (record.concept || '').toLowerCase();
      const description = (record.description || '').toLowerCase();
      const combinedText = `${concept} ${description}`;

      const isCraftFacet = CRAFT_FACETS.has(facet);
      const hasCraftKeyword = CRAFT_KEYWORDS.some(kw => combinedText.includes(kw));

      if (isCraftFacet || hasCraftKeyword) {
        filtered.push({
          facet: record.facet,
          state: record.state,
          concept: record.concept,
          description: record.description,
          source: record.source
        });
      }
    } catch (e) {
      // skip invalid json line
    }
  }

  console.log(`Processed ${totalCount} records. Filtered ${filtered.length} craft-relevant records.`);

  const outputPath = path.join(__dirname, '../public/diwali_crafts.json');
  fs.writeFileSync(outputPath, JSON.stringify(filtered, null, 2), 'utf-8');
  console.log(`Saved filtered dataset to ${outputPath}`);
}

downloadAndFilterDiwali().catch(err => {
  console.error('Error downloading dataset:', err);
  process.exit(1);
});
