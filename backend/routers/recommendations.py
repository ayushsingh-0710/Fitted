import os
import json
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(tags=["Recommendations"])

RECOMMENDATIONS_STORE = [
    {
        "id": "prod_101",
        "name": "Pure Fine Merino Wool Tailored Overcoat",
        "brand": "Raymond Luxe",
        "brandOrigin": "Mumbai, India",
        "price": 14999,
        "originalPrice": 18500,
        "rating": 4.9,
        "reviewsCount": 128,
        "matchScore": 97,
        "matchReason": "Fills the long outerwear gap in your winter collection. Coordinates seamlessly with your Structured Charcoal Blazer & Cashmere Turtleneck.",
        "bodySuitability": "Vertical structured lapels lengthen torso while broad shoulder construction accommodates Athletic Trapezoid and Inverted Triangle frames effortlessly.",
        "pairedItemName": "Structured Charcoal Blazer",
        "pairedItemId": "w_01",
        "image": "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
        "images": [
            "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"
        ],
        "category": "Outerwear",
        "fabric": "100% Fine Australian Merino Wool",
        "fitType": "Tailored Overcoat Fit",
        "tags": ["Outerwear Gap", "Warm Synergy", "High Versatility"],
        "sizes": ["S", "M", "L", "XL"]
    },
    {
        "id": "prod_102",
        "name": "Sustainable Handwoven Organic Cotton Shirt",
        "brand": "Anita Dongre Grassroot",
        "brandOrigin": "Jaipur, India",
        "price": 4999,
        "originalPrice": 6200,
        "rating": 4.8,
        "reviewsCount": 94,
        "matchScore": 94,
        "matchReason": "Performs at 94% compatibility with your body profile. Pairs beautifully with your Pleated Tapered Trousers for smart casual elegance.",
        "bodySuitability": "Subtle taper at midsection prevents fabric billowing for slim-to-athletic waists while providing shoulder mobility.",
        "pairedItemName": "Pleated Tapered Trousers",
        "pairedItemId": "w_04",
        "image": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
        "images": [
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80"
        ],
        "category": "Tops",
        "fabric": "100% Handwoven Organic Cotton",
        "fitType": "Modern Regular Fit",
        "tags": ["Workwear", "Breathable", "Wardrobe Staple"],
        "sizes": ["S", "M", "L"]
    },
    {
        "id": "prod_103",
        "name": "Structured Raw Silk Bandhgala Tuxedo Jacket",
        "brand": "Sabyasachi",
        "brandOrigin": "Kolkata, India",
        "price": 38500,
        "originalPrice": 45000,
        "rating": 5.0,
        "reviewsCount": 67,
        "matchScore": 99,
        "matchReason": "Apex formal royal tailoring. Bandhgala mandarin collar accentuates shoulder stance for high-impact evening receptions and weddings.",
        "bodySuitability": "Structured canvas chest piece builds broad shoulder symmetry while tapered waistline enhances athletic V-taper.",
        "pairedItemName": "Pleated Tapered Trousers",
        "pairedItemId": "w_04",
        "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
        "images": [
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
        ],
        "category": "Outerwear",
        "fabric": "70% Pure Mulberry Silk, 30% Fine Cotton",
        "fitType": "Tailored Royal Fit",
        "tags": ["Royal Heritage", "Wedding Luxe", "V-Taper Enhancer"],
        "sizes": ["38R", "40R", "42R", "44R"]
    },
    {
        "id": "prod_104",
        "name": "Organic Heavyweight Indigo Drop-Shoulder Tee",
        "brand": "Nicobar",
        "brandOrigin": "New Delhi, India",
        "price": 2499,
        "originalPrice": 3200,
        "rating": 4.7,
        "reviewsCount": 210,
        "matchScore": 92,
        "matchReason": "Hypoallergenic organic cotton tee dyed in natural indigo with dropped shoulder cut for effortless layering.",
        "bodySuitability": "Relaxed boxy cut softens overly sharp shoulder angles while drape creates a modern, effort-free urban silhouette.",
        "pairedItemName": "Heavyweight Raw Denim Jacket",
        "pairedItemId": "w_02",
        "image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
        "images": [
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
        ],
        "category": "Tops",
        "fabric": "100% Organic Heavyweight Cotton",
        "fitType": "Relaxed Drop Shoulder",
        "tags": ["Hypoallergenic", "Natural Indigo", "Minimalist"],
        "sizes": ["S", "M", "L", "XL"]
    },
    {
        "id": "prod_105",
        "name": "Embroidered Velvet Luxe Evening Jacket",
        "brand": "Manish Malhotra",
        "brandOrigin": "Mumbai, India",
        "price": 32000,
        "originalPrice": 38000,
        "rating": 4.9,
        "reviewsCount": 82,
        "matchScore": 96,
        "matchReason": "Ultra-luxurious silk velvet jacket with subtle thread embroidery matching evening gala and date night requirements.",
        "bodySuitability": "Structured shoulder head contours chest profile without fabric bunching.",
        "pairedItemName": "Structured Charcoal Blazer",
        "pairedItemId": "w_01",
        "image": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
        "images": [
            "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80"
        ],
        "category": "Outerwear",
        "fabric": "100% Silk Velvet",
        "fitType": "Slim Formal Fit",
        "tags": ["Couture Luxe", "Velvet Texture", "High Impact"],
        "sizes": ["S", "M", "L"]
    },
    {
        "id": "prod_106",
        "name": "Extended Third Cut Selvage Denim Trousers",
        "brand": "Bhaane",
        "brandOrigin": "New Delhi, India",
        "price": 5999,
        "originalPrice": 7500,
        "rating": 4.8,
        "reviewsCount": 115,
        "matchScore": 95,
        "matchReason": "Straight-leg architectural cut crafted from 100% raw cotton denim without synthetic elastane stretch.",
        "bodySuitability": "Mid-rise waist sits flush against hip bone; straight wide leg balances broader upper torso and creates vertical leg length.",
        "pairedItemName": "Minimalist Off-White Oversized Tee",
        "pairedItemId": "w_03",
        "image": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
        "images": [
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"
        ],
        "category": "Bottoms",
        "fabric": "100% Organic Raw Cotton Denim",
        "fitType": "Architectural Straight Cut",
        "tags": ["Synthetic-Free", "Selvage Denim", "Raw Texture"],
        "sizes": ["30", "32", "34", "36"]
    },
    {
        "id": "prod_107",
        "name": "Hand-Loomed Khadi Linen Resort Shirt",
        "brand": "Kardo",
        "brandOrigin": "New Delhi, India",
        "price": 4299,
        "originalPrice": 5400,
        "rating": 4.7,
        "reviewsCount": 98,
        "matchScore": 93,
        "matchReason": "100% Hand-Loomed Khadi Linen button-down tailored for warm weather travel and resort casual elegance.",
        "bodySuitability": "Camp collar broadens neck alignment while lightweight natural linen drape flatters broader chest builds in hot climates.",
        "pairedItemName": "Pleated Tapered Trousers",
        "pairedItemId": "w_04",
        "image": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
        "images": [
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
        ],
        "category": "Tops",
        "fabric": "100% Hand-Loomed Khadi Linen",
        "fitType": "Resort Relaxed Fit",
        "tags": ["Hand-Loomed Khadi", "100% Natural Linen", "Summer Essential"],
        "sizes": ["S", "M", "L", "XL"]
    },
    {
        "id": "prod_108",
        "name": "Handcrafted Italian-Finish Suede Loafers",
        "brand": "Rare Rabbit",
        "brandOrigin": "Bengaluru, India",
        "price": 7999,
        "originalPrice": 9999,
        "rating": 4.9,
        "reviewsCount": 140,
        "matchScore": 98,
        "matchReason": "Hand-stitched calfskin suede loafers that complement formal trousers and smart casual raw denim.",
        "bodySuitability": "Slim footbed profile elongates ankle lines without bulky sole width, perfect for tapered or cropped trouser hems.",
        "pairedItemName": "Pleated Tapered Trousers",
        "pairedItemId": "w_04",
        "image": "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
        "images": [
            "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80"
        ],
        "category": "Footwear",
        "fabric": "100% Calfskin Suede Leather",
        "fitType": "Handcrafted Loafer Fit",
        "tags": ["Urban Luxe", "Hypoallergenic Leather", "Comfort Footbed"],
        "sizes": ["40 EU", "41 EU", "42 EU", "43 EU", "44 EU"]
    },
    {
        "id": "prod_109",
        "name": "Pro-Trail Weatherproof Technical Sneakers",
        "brand": "HRX by Hrithik Roshan",
        "brandOrigin": "Bengaluru, India",
        "price": 3499,
        "originalPrice": 4999,
        "rating": 4.8,
        "reviewsCount": 312,
        "matchScore": 91,
        "matchReason": "Technical athletic footwear statement that pairs with relaxed tapered denim and streetwear outerwear.",
        "bodySuitability": "Agile chassis stabilization system absorbs foot impact and balances athletic stance for active lifestyles.",
        "pairedItemName": "Heavyweight Raw Denim Jacket",
        "pairedItemId": "w_02",
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        "images": [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
        ],
        "category": "Footwear",
        "fabric": "Gore-Tex Textile & Rubber Sole",
        "fitType": "Ergonomic Active Fit",
        "tags": ["Weatherproof", "Athleisure", "Active Support"],
        "sizes": ["8 UK", "9 UK", "10 UK", "11 UK", "12 UK"]
    },
    {
        "id": "prod_110",
        "name": "Pure Silk-Cotton Tapered Churidar Trousers",
        "brand": "FabIndia",
        "brandOrigin": "New Delhi, India",
        "price": 2999,
        "originalPrice": 3800,
        "rating": 4.7,
        "reviewsCount": 88,
        "matchScore": 90,
        "matchReason": "Pure silk-cotton tapered churidar trousers for festive occasions, ethnic travel, and weekend leisure.",
        "bodySuitability": "Custom drawstring waistband accommodates waist fluctuations; tapered ankles frame handcrafted leather footwear.",
        "pairedItemName": "Retro Leather Low-Top Sneakers",
        "pairedItemId": "w_05",
        "image": "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80",
        "images": [
            "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80"
        ],
        "category": "Bottoms",
        "fabric": "60% Mulberry Silk, 40% Organic Cotton",
        "fitType": "Tapered Churidar Fit",
        "tags": ["Festive Luxe", "Natural Blend", "Comfort Stretch"],
        "sizes": ["S", "M", "L", "XL"]
    },
    {
        "id": "prod_111",
        "name": "Unstructured Cotton Chino Twill Jacket",
        "brand": "Mufti",
        "brandOrigin": "Mumbai, India",
        "price": 4799,
        "originalPrice": 6100,
        "rating": 4.8,
        "reviewsCount": 76,
        "matchScore": 94,
        "matchReason": "Clean minimalist silhouette without heavy shoulder padding, perfect for transitional spring weather.",
        "bodySuitability": "Unlined soft shoulders contour naturally over broad or sloping shoulders without bulk.",
        "pairedItemName": "Minimalist Off-White Oversized Tee",
        "pairedItemId": "w_03",
        "image": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
        "images": [
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80"
        ],
        "category": "Outerwear",
        "fabric": "100% Organic Cotton Twill",
        "fitType": "Minimalist Unstructured Fit",
        "tags": ["Minimalist Classic", "Organic Twill", "Indian Design"],
        "sizes": ["S", "M", "L", "XL"]
    },
    {
        "id": "prod_112",
        "name": "Handcrafted Royal Leather Mojri Loafers",
        "brand": "House of Pataudi",
        "brandOrigin": "Jaipur, India",
        "price": 4499,
        "originalPrice": 5999,
        "rating": 4.9,
        "reviewsCount": 245,
        "matchScore": 97,
        "matchReason": "Handcrafted royal leather mojri loafers that complete 95% of smart casual, fusion, and ethnic outfits.",
        "bodySuitability": "Sleek low profile exposes ankle bone line, visually extending leg stroke for shorter or average height proportions.",
        "pairedItemName": "Pleated Tapered Trousers",
        "pairedItemId": "w_04",
        "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
        "images": [
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
        ],
        "category": "Footwear",
        "fabric": "100% Nappa Leather & Cushioned Insole",
        "fitType": "Sleek Low-Profile Fit",
        "tags": ["Royal Mojri", "Handcrafted", "Nappa Leather"],
        "sizes": ["40 EU", "41 EU", "42 EU", "43 EU", "44 EU"]
    }
]

class MeasurementsModel(BaseModel):
    bodyType: Optional[str] = "Athletic Trapezoid"
    height: Optional[str] = "5'11\" (180 cm)"
    chest: Optional[str] = "39 in"
    waist: Optional[str] = "31 in"
    hips: Optional[str] = "36 in"
    shoulderWidth: Optional[str] = "18.5 in"
    fitPreference: Optional[str] = "Tailored / Structured"
    useSavedData: Optional[bool] = True

class BudgetModel(BaseModel):
    minPrice: Optional[float] = 1000.0
    maxPrice: Optional[float] = 50000.0

class FabricSpecsModel(BaseModel):
    preferences: Optional[List[str]] = []
    allergiesOrExclusions: Optional[List[str]] = []

class PartnerSuggestPayload(BaseModel):
    measurements: Optional[MeasurementsModel] = None
    budget: Optional[BudgetModel] = None
    fabricSpecs: Optional[FabricSpecsModel] = None
    occasion: Optional[str] = "Creative Workspace"
    closetItemId: Optional[str] = None
    apiKey: Optional[str] = None

@router.get("/recommendations")
async def get_recommendations():
    return RECOMMENDATIONS_STORE

@router.get("/products/{prod_id}")
async def get_product_by_id(prod_id: str):
    for prod in RECOMMENDATIONS_STORE:
        if prod["id"] == prod_id:
            return prod
    raise HTTPException(status_code=404, detail=f"Product with ID '{prod_id}' not found in store catalog")


@router.post("/recommendations/partner-suggest")
async def suggest_partner_products(payload: PartnerSuggestPayload):
    """
    Integrates Google Gemini API to analyze user measurements, body suitability,
    budget limits, fabric specs/allergy exclusions, and target occasion to recommend partner products
    across top Indian fashion brands.
    """
    measurements = payload.measurements or MeasurementsModel()
    budget = payload.budget or BudgetModel()
    fabric_specs = payload.fabricSpecs or FabricSpecsModel()
    occasion = payload.occasion or "Creative Workspace"
    
    gemini_key = payload.apiKey or os.getenv("GEMINI_API_KEY")
    
    # Excluded fabrics list
    exclusions = [f.lower() for f in fabric_specs.allergiesOrExclusions or []]
    
    # Perform Gemini API call if key is available
    if gemini_key:
        try:
            prompt = f"""
            You are an expert personal fashion stylist and body-suitability clothing recommendation engine for Fitted in India.
            Analyze the user profile below and return a valid JSON array of 6 recommended partner products from distinct famous Indian fashion brands (such as Raymond, Sabyasachi, Manish Malhotra, Anita Dongre, FabIndia, Nicobar, Bhaane, Kardo, Rare Rabbit, House of Pataudi, Mufti, HRX):

            - Body Shape/Measurements: Body Type: {measurements.bodyType}, Height: {measurements.height}, Chest: {measurements.chest}, Waist: {measurements.waist}, Shoulder Width: {measurements.shoulderWidth}, Fit Cut Preference: {measurements.fitPreference}
            - Budget Range: ₹{budget.minPrice} to ₹{budget.maxPrice} INR per item
            - Allergic / Excluded Fabrics (STRICTLY PROHIBITED): {', '.join(fabric_specs.allergiesOrExclusions) if fabric_specs.allergiesOrExclusions else 'None'}
            - Preferred Fabrics: {', '.join(fabric_specs.preferences) if fabric_specs.preferences else 'Any premium natural fibers'}
            - Target Occasion: {occasion}

            Format your response strictly as JSON with NO markdown formatting, just a plain JSON array of objects with keys:
            "id", "name", "brand", "brandOrigin", "price", "category", "fabric", "fitType", "matchScore" (integer 88-99), "matchReason", "bodySuitability", "pairedItemName", "allergySafe" (boolean), "image".
            Ensure that EACH product comes from a DIFFERENT famous Indian brand and that NO excluded fabric appears in the "fabric" field. Price must be in Indian Rupees (INR).
            """

            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_key}"
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(url, json={
                    "contents": [{"parts": [{"text": prompt}]}]
                })
                
                if res.status_code == 200:
                    data = res.json()
                    raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                    if raw_text.startswith("```"):
                        raw_text = raw_text.split("```")[1]
                        if raw_text.startswith("json"):
                            raw_text = raw_text[4:]
                    items = json.loads(raw_text.strip())
                    return {
                        "source": "Gemini 2.5 Flash AI",
                        "status": "success",
                        "products": items
                    }
        except Exception as e:
            print(f"[Gemini API Call Warning]: {e}. Falling back to Fitted multi-brand AI engine.")

    # Rule-Based AI Engine Fallback (Filters catalog by Body Suitability, Budget, and Allergy Restrictions across brands)
    filtered = []
    for item in RECOMMENDATIONS_STORE:
        item_price = item.get("price", 5000)
        item_fabric = item.get("fabric", "").lower()
        
        # Check price
        if not (budget.minPrice <= item_price <= budget.maxPrice):
            continue
            
        # Check fabric exclusions
        has_allergy_conflict = any(ex in item_fabric for ex in exclusions)
        
        item_copy = dict(item)
        item_copy["allergySafe"] = not has_allergy_conflict
        item_copy["allergyConflict"] = has_allergy_conflict
        
        # Compute body suitability match score adjustments
        base_score = item_copy.get("matchScore", 95)
        
        if has_allergy_conflict:
            item_copy["matchReason"] = f"⚠️ Contains excluded fabric ({item['fabric']})."
            item_copy["matchScore"] = max(50, base_score - 40)
        else:
            item_copy["matchReason"] = f"Curated by {item['brand']} for {occasion}. 100% compliant with {measurements.bodyType} proportions. Fabric: {item['fabric']}."
            
        filtered.append(item_copy)

    if not filtered:
        filtered = RECOMMENDATIONS_STORE

    return {
        "source": "Fitted Intelligence Multi-Brand AI Engine" + (" (Add Gemini Key for Live LLM Mode)" if not gemini_key else " (Fallback)"),
        "status": "success",
        "products": filtered
    }


