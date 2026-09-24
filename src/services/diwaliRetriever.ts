export interface DiwaliRecord {
  facet: string;
  state: string;
  concept: string;
  description: string;
  source?: string;
}

export interface DiwaliRetrievalResult {
  records: DiwaliRecord[];
  contextString: string;
  matchedConcept: string;
  score: number;
}

let cachedDiwaliData: DiwaliRecord[] | null = null;
let isFetching = false;
let fetchPromise: Promise<DiwaliRecord[]> | null = null;

/**
 * Load the bundled DIWALI craft dataset from public/diwali_crafts.json
 */
export async function loadDiwaliData(): Promise<DiwaliRecord[]> {
  if (cachedDiwaliData) {
    return cachedDiwaliData;
  }
  if (fetchPromise) {
    return fetchPromise;
  }

  isFetching = true;
  fetchPromise = (async () => {
    try {
      const response = await fetch('/diwali_crafts.json');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      cachedDiwaliData = data;
      return data;
    } catch (err) {
      console.warn('Failed to load DIWALI dataset from public/diwali_crafts.json:', err);
      return [];
    } finally {
      isFetching = false;
    }
  })();

  return fetchPromise;
}

/**
 * Retrieve cultural context from DIWALI dataset based on extracted product attributes
 */
export async function retrieveCulturalContext(attributes: {
  category?: string;
  craftTechnique?: string;
  primaryMaterial?: string;
  state?: string;
  titleEn?: string;
  titleHi?: string;
  visualObjectType?: string;
  keywords?: string[];
}): Promise<DiwaliRetrievalResult | null> {
  const dataset = await loadDiwaliData();
  if (!dataset || dataset.length === 0) {
    return null;
  }

  // Combine query terms
  const queryTerms = [
    attributes.visualObjectType,
    attributes.craftTechnique,
    attributes.primaryMaterial,
    attributes.category,
    attributes.state,
    attributes.titleEn,
    attributes.titleHi,
    ...(attributes.keywords || [])
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'with', 'for', 'to', 'from',
    'by', 'traditional', 'handcrafted', 'artisan', 'heritage', 'product', 'pure',
    '100%', 'authentic', 'hastnirmit', 'shuddha', 'handloom', 'weaving', 'craft',
    'crafting', 'made', 'material', 'item', 'dyes', 'textiles', 'natural', 'custom',
    'sculpture', 'statue', 'art', 'decor', 'figure', 'figurine', 'murti', 'murtis'
  ]);

  // Specific domain tokens that indicate a real handicraft concept
  const domainConceptKeywords = new Set([
    'nandi', 'dhokra', 'dokra', 'brass', 'bell-metal', 'terracotta', 'pottery',
    'madhubani', 'mithila', 'pashmina', 'sozni', 'cashmere', 'wood', 'teakwood',
    'sheesham', 'carving', 'pochampally', 'ikat', 'saree', 'sari', 'patachitra',
    'pattachitra', 'kalamkari', 'warli', 'gond', 'channapatna', 'bandhani',
    'kantha', 'phulkari', 'chikankari', 'bhagalpuri', 'tanchoi', 'zari', 'kasuti'
  ]);

  const tokens = Array.from(
    new Set(
      queryTerms
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(t => t.length > 2 && !stopWords.has(t))
    )
  );

  if (tokens.length === 0) {
    return null;
  }

  const hasSpecificDomainToken = tokens.some(t => domainConceptKeywords.has(t));
  if (!hasSpecificDomainToken) {
    // If the input doesn't contain a specific craft concept token, do not attempt broad fuzzy match
    return null;
  }

  let bestMatches: { record: DiwaliRecord; score: number }[] = [];

  for (const item of dataset) {
    const conceptText = (item.concept || '').toLowerCase();
    const descText = (item.description || '').toLowerCase();
    const stateText = (item.state || '').toLowerCase();

    let score = 0;
    let matchedSpecificKeyword = false;

    for (const token of tokens) {
      if (conceptText.includes(token)) {
        score += 6; // Higher weight for concept title match
        if (domainConceptKeywords.has(token)) matchedSpecificKeyword = true;
      }
      if (stateText.includes(token)) {
        score += 2;
      }
      if (descText.includes(token)) {
        score += 2;
        if (domainConceptKeywords.has(token)) matchedSpecificKeyword = true;
      }
    }

    // Minimum relevance threshold: score >= 8 AND must match at least one domain concept keyword
    if (score >= 8 && matchedSpecificKeyword) {
      bestMatches.push({ record: item, score });
    }
  }

  if (bestMatches.length === 0) {
    return null;
  }

  // Sort descending by score
  bestMatches.sort((a, b) => b.score - a.score);

  // Take top 2 unique concepts
  const topRecords: DiwaliRecord[] = [];
  const seenConcepts = new Set<string>();

  for (const m of bestMatches) {
    if (!seenConcepts.has(m.record.concept)) {
      seenConcepts.add(m.record.concept);
      topRecords.push(m.record);
    }
    if (topRecords.length >= 2) break;
  }

  const contextLines = topRecords.map(
    r => `• Concept: ${r.concept} (State: ${r.state || 'India'}, Facet: ${r.facet}): ${r.description}`
  );

  return {
    records: topRecords,
    contextString: contextLines.join('\n'),
    matchedConcept: topRecords[0].concept,
    score: bestMatches[0].score
  };
}
