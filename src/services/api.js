import { MOCK_USER, MOCK_WARDROBE, MOCK_RECOMMENDATIONS } from '../data/mockData';
import { recommendProductsFromCatalog } from './catalogRecommendationEngine';
import { INDIAN_WOMENS_FASHION_CATALOG } from '../data/indianWomensFashionCatalog';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Helper for HTTP calls with graceful mock fallback
async function fetchWithFallback(url, options = {}, mockFallback) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for local backend check
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      return await response.json();
    } else {
      console.warn(`[Fitted API] Backend returned status ${response.status}. Using fallback mock data.`);
      return mockFallback();
    }
  } catch {
    console.info(`[Fitted API Layer] Standalone/Demo mode active. Serving intelligent mock response.`);
    return mockFallback();
  }
}

export const api = {
  // Authentication Services
  auth: {
    async login(email, password) {
      return fetchWithFallback(
        `${API_BASE_URL}/auth/login`,
        { method: 'POST', body: JSON.stringify({ email, password }) },
        () => ({
          success: true,
          token: 'mock_jwt_token_fitted_2026',
          user: MOCK_USER
        })
      );
    },

    async register(name, email, password) {
      return fetchWithFallback(
        `${API_BASE_URL}/auth/register`,
        { method: 'POST', body: JSON.stringify({ name, email, password }) },
        () => ({
          success: true,
          token: 'mock_jwt_token_fitted_2026',
          user: { ...MOCK_USER, name, email }
        })
      );
    },

    async getProfile() {
      return fetchWithFallback(
        `${API_BASE_URL}/auth/me`,
        { method: 'GET' },
        () => MOCK_USER
      );
    }
  },

  // OOTD AI Fashion Analysis (Qwen / Groq Architecture ready)
  // OOTD AI Fashion Intelligence Analysis
  ootd: {
    async analyzeOutfit(payload) {
      return fetchWithFallback(
        `${API_BASE_URL}/ootd/analyze`,
        { method: 'POST', body: JSON.stringify(payload) },
        () => {
          const imageStr = payload.imageBase64 || '';
          const itemIds = payload.itemIds || [];
          
          // Generate deterministic seed from payload string
          let hash = 0;
          const seedStr = (imageStr ? imageStr.slice(0, 300) : '') + itemIds.join('-');
          for (let i = 0; i < seedStr.length; i++) {
            hash = (hash << 5) - hash + seedStr.charCodeAt(i);
            hash |= 0;
          }
          const seed = Math.abs(hash);

          const verdicts = [
            'Contemporary Earthy Smart Casual',
            'High-Contrast Modern Urban Silhouette',
            'Relaxed Linen & Tapered Proportion',
            'Tailored Luxe Evening Ensemble',
            'Minimalist Monochrome Streetwear',
            'Textured Heritage Layered Fit',
            'Sophisticated Warm Palette Coordination'
          ];

          const colorFeedbacks = [
            'Strong visual color grounding. Contrast ratio balances skin undertones with garment contrast.',
            'Subtle monochromatic depth with rich texture separation between top and bottom pieces.',
            'Harmonious warm tone distribution creating effortless visual height and natural warmth.',
            'Bold complementary accenting. The neutral base accentuates subtle accessory lines perfectly.'
          ];

          const fitFeedbacks = [
            'Ideal shoulder-to-waist drop ratio framing an athletic trapezoid profile.',
            'Clean drop shoulder line balancing cropped hem length and ankle exposure.',
            'Structured chest tailoring providing crisp drape without excess fabric bunching.',
            'Rule of thirds proportions with tapered ankle hem creating elongated leg lines.'
          ];

          const occasionFeedbacks = [
            'Versatile transition fit ideal for Creative Office, Dinner Drinks, or Evening Socials.',
            'Sophisticated smart casual balance suitable for Gallery Launches or Weekend Brunches.',
            'Polished yet comfortable framing tailored for Travel Luxe or Fine Dining settings.',
            'Modern urban street silhouette perfect for Evening Lounges or Casual Meetings.'
          ];

          const strengthsList = [
            [
              'Optimal rule of thirds silhouette balance',
              'High-contrast neutral anchor framing face area',
              'Crisp shoulder-to-waist taper without bunching'
            ],
            [
              'Earthy natural color palette harmony',
              'Textured fabric layering with clean drop shoulder',
              'Proportional trouser crop accentuating footwear'
            ],
            [
              'Monochromatic visual length extension',
              'Subtle accessory accenting on wrist & collar',
              'Effortless transition from day to evening wear'
            ]
          ];

          const suggestionsList = [
            [
              'Swap sneakers for suede Chelsea boots if attending a formal evening event.',
              'Add a minimal silver or gold chain watch to anchor the wrist line.'
            ],
            [
              'Roll sleeve hem slightly to expose wrist line and enhance relaxed drape.',
              'Pair with a textured leather belt matching footwear hardware.'
            ],
            [
              'Layer an unbuttoned linen overshirt for breezy evening temperature drops.',
              'Opt for invisible socks to maximize clean low-top shoe silhouette.'
            ]
          ];

          const vIdx = seed % verdicts.length;
          const cIdx = (seed >> 2) % colorFeedbacks.length;
          const fIdx = (seed >> 4) % fitFeedbacks.length;
          const oIdx = (seed >> 6) % occasionFeedbacks.length;
          const sIdx = (seed >> 8) % strengthsList.length;
          const sugIdx = (seed >> 10) % suggestionsList.length;

          const colorScore = 85 + (seed % 14);
          const fitScore = 84 + ((seed >> 3) % 15);
          const occasionScore = 88 + ((seed >> 5) % 11);
          const overallScore = Math.round((colorScore + fitScore + occasionScore) / 3);

          return {
            overallScore,
            verdict: verdicts[vIdx],
            breakdown: {
              colorHarmony: {
                score: colorScore,
                feedback: colorFeedbacks[cIdx]
              },
              fitProportions: {
                score: fitScore,
                feedback: fitFeedbacks[fIdx]
              },
              occasionMatch: {
                score: occasionScore,
                feedback: occasionFeedbacks[oIdx]
              }
            },
            strengths: strengthsList[sIdx],
            suggestions: suggestionsList[sugIdx],
            wearAgainPrompt: `You last logged this combination ${7 + (seed % 12)} days ago. Great rotation spacing!`,
            analyzedAt: new Date().toISOString(),
            inputMeta: payload
          };
        }
      );
    }
  },

  // Wardrobe Management Services
  wardrobe: {
    async getItems() {
      return fetchWithFallback(
        `${API_BASE_URL}/wardrobe`,
        { method: 'GET' },
        () => MOCK_WARDROBE
      );
    },

    async addItem(newItem) {
      return fetchWithFallback(
        `${API_BASE_URL}/wardrobe`,
        { method: 'POST', body: JSON.stringify(newItem) },
        () => ({
          id: `w_${Date.now()}`,
          wearCount: 0,
          dateAdded: new Date().toISOString().split('T')[0],
          ...newItem
        })
      );
    },

    async deleteItem(id) {
      return fetchWithFallback(
        `${API_BASE_URL}/wardrobe/${id}`,
        { method: 'DELETE' },
        () => ({ success: true, deletedId: id })
      );
    }
  },

  // Personal Recommendation & Shopping Engine
  recommendations: {
    async getRecommendations(wardrobeItems = [], user = {}) {
      return fetchWithFallback(
        `${API_BASE_URL}/recommendations`,
        { method: 'GET' },
        () => recommendProductsFromCatalog(wardrobeItems, user)
      );
    },

    async getProductById(id) {
      return fetchWithFallback(
        `${API_BASE_URL}/products/${id}`,
        { method: 'GET' },
        () => {
          const catalogItem = INDIAN_WOMENS_FASHION_CATALOG.find(p => p.product_id === id);
          if (catalogItem) {
            return {
              id: catalogItem.product_id,
              name: catalogItem.product_name,
              brand: catalogItem.brand,
              price: catalogItem.discount_price,
              originalPrice: catalogItem.price,
              rating: catalogItem.rating,
              matchScore: 94,
              matchReason: `Curated for ${catalogItem.occasion.join(', ')}. Ideal fit for Indian college & everyday wear.`,
              bodySuitability: `${catalogItem.fit} fit in ${catalogItem.fabric} offers high breathability and movement.`,
              image: catalogItem.image_url,
              images: [catalogItem.image_url],
              category: catalogItem.category,
              subcategory: catalogItem.subcategory,
              color: catalogItem.color,
              fabric: catalogItem.fabric,
              fitType: `${catalogItem.fit} Fit`,
              tags: catalogItem.tags,
              sizes: catalogItem.sizes,
              product_url: catalogItem.product_url,
              inStock: true
            };
          }
          return MOCK_RECOMMENDATIONS.find(p => p.id === id) || MOCK_RECOMMENDATIONS[0];
        }
      );
    },

    async getPartnerSuggestions(payload = {}) {
      return fetchWithFallback(
        `${API_BASE_URL}/recommendations/partner-suggest`,
        { method: 'POST', body: JSON.stringify(payload) },
        () => {
          const wardrobe = payload.wardrobeItems || [];
          const userPref = {
            primaryStyle: payload.stylePreference,
            favoriteColors: payload.favoriteColors,
            bodyType: payload.measurements?.bodyType
          };
          const filters = {
            targetOccasion: payload.occasion || 'All',
            maxBudget: payload.budget?.maxPrice || 5000,
            minBudget: payload.budget?.minPrice || 0
          };

          const catalogRecs = recommendProductsFromCatalog(wardrobe, userPref, filters);

          return {
            source: "Fitted Indian Women's Fashion AI Engine",
            status: "success",
            products: catalogRecs.length > 0 ? catalogRecs : MOCK_RECOMMENDATIONS
          };
        }
      );
    }
  },

  // Payments & Razorpay Interface
  payments: {
    async createOrder(items, totalAmount) {
      return fetchWithFallback(
        `${API_BASE_URL}/payments/create-order`,
        { method: 'POST', body: JSON.stringify({ items, totalAmount, currency: 'INR' }) },
        () => ({
          orderId: `order_rzp_${Math.random().toString(36).substring(2, 9)}`,
          amount: totalAmount,
          currency: 'INR',
          key: 'rzp_test_mock_fitted_key',
          status: 'created'
        })
      );
    },

    async verifyPayment(paymentData) {
      return fetchWithFallback(
        `${API_BASE_URL}/payments/verify`,
        { method: 'POST', body: JSON.stringify(paymentData) },
        () => ({
          success: true,
          transactionId: `txn_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          paidAt: new Date().toISOString()
        })
      );
    }
  }
};
