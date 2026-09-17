// Pure JavaScript Wardrobe Outfit Generator & Compatibility Scoring Engine

// Color compatibility matrix & harmony rules
const COLOR_HARMONY_RULES = {
  neutrals: ['charcoal', 'black', 'white', 'off-white', 'cream', 'beige', 'tan', 'gray', 'grey', 'navy', 'khaki'],
  earthy: ['olive', 'sage', 'terracotta', 'brown', 'cognac', 'camel', 'rust', 'sand', 'amber'],
  accents: ['indigo', 'blue', 'emerald', 'red', 'gold', 'mustard', 'purple', 'burgundy', 'pink']
};

function getColorGroup(colorName = '') {
  const c = colorName.toLowerCase();
  for (const group in COLOR_HARMONY_RULES) {
    if (COLOR_HARMONY_RULES[group].some(term => c.includes(term))) {
      return group;
    }
  }
  return 'neutral';
}

function calculateColorHarmony(colors) {
  if (colors.length < 2) return 85;
  const groups = colors.map(getColorGroup);
  
  const neutralCount = groups.filter(g => g === 'neutrals').length;
  const earthyCount = groups.filter(g => g === 'earthy').length;
  const accentCount = groups.filter(g => g === 'accents').length;

  // 1. All neutrals or neutrals + 1 accent: Excellent harmony (92 - 98)
  if (neutralCount >= 2 && accentCount <= 1) return 96;
  // 2. Earthy tones + neutrals: Very High harmony (90 - 95)
  if (earthyCount >= 1 && neutralCount >= 1 && accentCount === 0) return 93;
  // 3. All earthy: High harmony (88 - 94)
  if (earthyCount >= 2 && accentCount === 0) return 90;
  // 4. Multiple accents: Moderate harmony (80 - 86)
  if (accentCount > 1) return 82;

  return 88;
}

// Categorize items into functional clothing roles
export function categorizeWardrobe(items = []) {
  const roles = {
    tops: [],
    bottoms: [],
    dresses: [],
    outerwear: [],
    shoes: [],
    accessories: []
  };

  items.forEach(item => {
    const cat = (item.category || '').toLowerCase();
    const subCat = (item.subCategory || item.subcategory || '').toLowerCase();
    const name = (item.name || '').toLowerCase();

    if (cat.includes('outerwear') || subCat.includes('blazer') || subCat.includes('jacket') || subCat.includes('cardigan') || subCat.includes('coat') || name.includes('blazer') || name.includes('jacket') || name.includes('cardigan') || name.includes('overcoat')) {
      roles.outerwear.push(item);
    } else if (cat.includes('top') || cat.includes('ethnic') || subCat.includes('kurti') || subCat.includes('shirt') || subCat.includes('tee') || subCat.includes('knit') || name.includes('shirt') || name.includes('tee') || name.includes('kurta') || name.includes('kurti') || name.includes('top') || name.includes('sweater')) {
      roles.tops.push(item);
    } else if (cat.includes('bottom') || subCat.includes('trouser') || subCat.includes('jean') || subCat.includes('pant') || subCat.includes('cargo') || subCat.includes('short') || name.includes('trouser') || name.includes('pant') || name.includes('jean') || name.includes('cargo') || name.includes('churidar')) {
      roles.bottoms.push(item);
    } else if (cat.includes('dress') || subCat.includes('dress') || name.includes('dress') || name.includes('gown')) {
      roles.dresses.push(item);
    } else if (cat.includes('footwear') || cat.includes('shoe') || subCat.includes('sneaker') || subCat.includes('flat') || subCat.includes('sandal') || subCat.includes('loafer') || subCat.includes('boot') || name.includes('sneaker') || name.includes('flat') || name.includes('sandal') || name.includes('loafer') || name.includes('shoe') || name.includes('boot') || name.includes('mojri')) {
      roles.shoes.push(item);
    } else {
      roles.accessories.push(item);
    }
  });

  return roles;
}

// Occasion Suitability Rules
const OCCASION_CONFIGS = [
  {
    key: 'Casual',
    title: 'Casual Everyday Clean',
    targetTags: ['Casual', 'Daily', 'Essential', 'Minimalist'],
    allowedOuterwear: true
  },
  {
    key: 'Smart Casual',
    title: 'Smart Casual Elevation',
    targetTags: ['Smart Casual', 'Formal', 'Layering', 'Versatile'],
    allowedOuterwear: true
  },
  {
    key: 'College',
    title: 'College & Campus Cool',
    targetTags: ['Casual', 'Streetwear', 'Essential', 'Durable'],
    allowedOuterwear: true
  },
  {
    key: 'Party',
    title: 'Night Out Party Luxe',
    targetTags: ['Evening', 'Party', 'Luxe', 'Streetwear', 'High Impact'],
    allowedOuterwear: true
  },
  {
    key: 'Date / Night Out',
    title: 'Date Night Sophistication',
    targetTags: ['Smart Casual', 'Evening', 'Formal', 'Luxe'],
    allowedOuterwear: true
  },
  {
    key: 'Minimal',
    title: 'Monochrome Minimal',
    targetTags: ['Minimalist', 'Essential', 'Classic'],
    allowedOuterwear: true
  },
  {
    key: 'Streetwear',
    title: 'Urban Streetwear Statement',
    targetTags: ['Streetwear', 'Durable', 'Casual', 'Layering'],
    allowedOuterwear: true
  }
];

// Minimum items needed before the engine will generate any combos
const MIN_WARDROBE_ITEMS = 3;
const MIN_COMBO_SCORE = 85;
const MAX_COMBOS = 8;

// Main Reusable Generator Function
export function generateOutfitRecommendations(wardrobeItems = [], userPreferences = {}, targetOccasion = 'All') {
  if (!Array.isArray(wardrobeItems) || wardrobeItems.length === 0) {
    return {
      recommendations: [],
      hasInsufficientItems: true,
      missingMessage: 'Your wardrobe vault is empty. Digitize your clothes to generate 1-click outfit combos!'
    };
  }

  // Require a minimum number of real clothing pieces before generating any combos
  if (wardrobeItems.length < MIN_WARDROBE_ITEMS) {
    return {
      recommendations: [],
      hasInsufficientItems: true,
      missingMessage: `You only have ${wardrobeItems.length} item${wardrobeItems.length === 1 ? '' : 's'} in your vault. Add at least ${MIN_WARDROBE_ITEMS} clothing pieces to unlock full outfit combinations!`
    };
  }

  const roles = categorizeWardrobe(wardrobeItems);

  // Check if we have minimum base pieces (either Dress or Top + Bottom)
  const hasBaseOutfit = roles.dresses.length > 0 || (roles.tops.length > 0 && roles.bottoms.length > 0);

  if (!hasBaseOutfit) {
    const missing = [];
    if (roles.tops.length === 0 && roles.dresses.length === 0) missing.push('Tops/Shirts');
    if (roles.bottoms.length === 0 && roles.dresses.length === 0) missing.push('Bottoms/Trousers');

    return {
      recommendations: [],
      hasInsufficientItems: true,
      missingMessage: `Add ${missing.join(' & ')} to your wardrobe vault to unlock complete outfit combinations.`
    };
  }

  const generatedCombos = [];
  const comboKeys = new Set();

  // Helper to build and score a combination
  function buildCombo(top, bottom, dress, shoes, outerwear, occasionConfig) {
    const pieces = [top, bottom, dress, shoes, outerwear].filter(Boolean);
    if (pieces.length < 2) return null;

    // Deduplication Key
    const key = pieces.map(p => p.id).sort().join('-');
    if (comboKeys.has(key)) return null;
    comboKeys.add(key);

    // 1. Color Harmony Score
    const colors = pieces.map(p => p.color || p.colorHex || '');
    const colorScore = calculateColorHarmony(colors);

    // 2. Layering & Silhouette Balance
    let layeringScore = 88;
    if (outerwear && top) {
      const topFit = (top.fitNote || '').toLowerCase();
      const outFit = (outerwear.fitNote || '').toLowerCase();
      if (outFit.includes('tailored') || outFit.includes('structured') || topFit.includes('drop') || topFit.includes('oversized')) {
        layeringScore = 95; // Excellent structured-over-relaxed balance
      }
    }

    // 3. Tag & Occasion Match
    let occasionScore = 82;
    const allTags = pieces.flatMap(p => p.tags || []).map(t => t.toLowerCase());
    const matchesTarget = occasionConfig.targetTags.some(t => allTags.includes(t.toLowerCase()));
    if (matchesTarget) occasionScore += 12;

    // 4. User Personalization Boost (favorite colors / primary style)
    let preferenceBoost = 0;
    if (userPreferences.favoriteColors && Array.isArray(userPreferences.favoriteColors)) {
      const hasFavColor = pieces.some(p => 
        userPreferences.favoriteColors.some(fc => (p.colorHex || '').toLowerCase() === fc.toLowerCase())
      );
      if (hasFavColor) preferenceBoost += 4;
    }

    const totalScore = Math.min(98, Math.max(78, Math.round((colorScore * 0.35) + (layeringScore * 0.35) + (occasionScore * 0.3) + preferenceBoost)));

    // Generate Human-Readable "Why this works" explanation
    const pieceNames = pieces.map(p => p.name);
    let whyItWorks = "";
    
    if (outerwear && top && bottom) {
      whyItWorks = `The ${outerwear.name} adds crisp structure over the ${top.name}, perfectly balanced by the ${bottom.name} for effortless ${occasionConfig.key.toLowerCase()} harmony.`;
    } else if (top && bottom && shoes) {
      whyItWorks = `Clean pairing of ${top.name} with ${bottom.name}. The ${shoes.name} grounds the silhouette with high color coherence.`;
    } else if (dress && shoes) {
      whyItWorks = `1-piece elegance of ${dress.name} anchored by ${shoes.name} for a sleek, proportional line.`;
    } else {
      whyItWorks = `Balanced proportions between ${pieceNames.join(' and ')} creating a cohesive, versatile look.`;
    }

    return {
      id: `outfit_${key}`,
      name: `${occasionConfig.title}`,
      occasion: occasionConfig.key,
      score: totalScore,
      explanation: whyItWorks,
      items: pieces,
      pieceCount: pieces.length
    };
  }

  // Filter Occasions to generate
  const targetConfigs = targetOccasion === 'All' 
    ? OCCASION_CONFIGS 
    : OCCASION_CONFIGS.filter(c => c.key.toLowerCase() === targetOccasion.toLowerCase());

  const activeConfigs = targetConfigs.length > 0 ? targetConfigs : OCCASION_CONFIGS;

  // Generate combos across roles and occasions
  activeConfigs.forEach(config => {
    // Top + Bottom + Shoes (+ Optional Outerwear)
    roles.tops.forEach(top => {
      roles.bottoms.forEach(bottom => {
        const shoePool = roles.shoes.length > 0 ? roles.shoes : [null];
        shoePool.forEach(shoe => {
          // Base outfit without outerwear
          const baseCombo = buildCombo(top, bottom, null, shoe, null, config);
          if (baseCombo) generatedCombos.push(baseCombo);

          // With outerwear if available
          roles.outerwear.forEach(outerwear => {
            const layeredCombo = buildCombo(top, bottom, null, shoe, outerwear, config);
            if (layeredCombo) generatedCombos.push(layeredCombo);
          });
        });
      });
    });

    // Dresses + Shoes
    roles.dresses.forEach(dress => {
      const shoePool = roles.shoes.length > 0 ? roles.shoes : [null];
      shoePool.forEach(shoe => {
        const dressCombo = buildCombo(null, null, dress, shoe, null, config);
        if (dressCombo) generatedCombos.push(dressCombo);
      });
    });
  });

  // Sort by compatibility score descending
  generatedCombos.sort((a, b) => b.score - a.score);

  // Deduplicate by item-pair key so the same physical items don't appear across multiple occasions
  const seenItemKeys = new Set();
  const deduped = [];
  for (const combo of generatedCombos) {
    const itemKey = combo.items.map(i => i.id).sort().join('-');
    if (!seenItemKeys.has(itemKey)) {
      seenItemKeys.add(itemKey);
      deduped.push(combo);
    }
  }

  // Only surface combos that meet the minimum quality bar
  const qualified = deduped.filter(c => c.score >= MIN_COMBO_SCORE);

  return {
    recommendations: qualified.slice(0, MAX_COMBOS),
    hasInsufficientItems: qualified.length === 0,
    missingMessage: qualified.length === 0
      ? 'No high-quality outfit matches found for this occasion yet. Try adding more variety to your wardrobe — different colors, tops, and shoes help a lot!'
      : null
  };
}
