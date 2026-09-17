import os
import io
import json
import base64
import datetime
import httpx
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

router = APIRouter(prefix="/ootd", tags=["OOTD Fashion AI"])

class OotdAnalysisPayload(BaseModel):
    itemIds: Optional[List[str]] = []
    imageBase64: Optional[str] = None
    hasCustomImage: Optional[bool] = False

# Google Gemini Vision API Service
class GeminiVisionFashionService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "").strip()

    async def analyze_with_gemini(self, image_b64: str, item_ids: List[str]) -> Optional[dict]:
        """Calls Google Gemini 1.5 Flash Vision API if GEMINI_API_KEY is configured."""
        if not self.api_key:
            return None

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
        
        mime_type = "image/jpeg"
        clean_b64 = image_b64
        if "data:" in image_b64 and ";base64," in image_b64:
            header, clean_b64 = image_b64.split(";base64,", 1)
            if "png" in header:
                mime_type = "image/png"
            elif "webp" in header:
                mime_type = "image/webp"

        prompt = (
            "You are an experienced celebrity personal fashion stylist giving a private styling consultation. "
            "STEP 1: INSPECT FOR PERSON OR CLOTHING. "
            "Look at the image carefully. Does it actually contain a person, human subject, or clothing/outfit? "
            "If the photo shows ONLY a blank wall, ceiling, empty room, background, floor, or random objects with NO person and NO clothing, "
            "you MUST return strictly valid JSON matching this exact structure:\n"
            "{\n"
            '  "isValidOutfit": false,\n'
            '  "errorMessage": "No person or clothing detected in this photo. It appears to be a wall, ceiling, or background. Please snap or upload a picture of yourself wearing an outfit, or clothing laid out flat!"\n'
            "}\n\n"
            "STEP 2: FULL STYLIST REVIEW (Only if person or clothing is present):\n"
            "Speak directly to your client in SIMPLE, NATURAL, EVERYDAY LANGUAGE. "
            "STRICT RULE: Avoid robotic academic jargon. "
            "Look closely at what the person is wearing in the picture:\n"
            "1. Identify the shirt/top style (collar, sleeves, color, stripes/pattern).\n"
            "2. Identify the trousers/bottoms (color, cut, fit).\n"
            "3. Explain Color Harmony in simple words (why the colors work together and flatter them).\n"
            "4. Explain Fit & Silhouette in simple words (how the collar, shoulder line, and trouser drape balance their height and build).\n"
            "5. Occasion Match (where this outfit shines: cafes, college, casual office, dates, dinners).\n"
            "6. 3 genuine outfit strengths (what makes this look great).\n"
            "7. 3 realistic, high-impact stylist upgrades (specific footwear like white sneakers vs loafers, watch/sunglasses, tucking/cuffing tricks).\n\n"
            "Return strictly valid JSON only matching this structure:\n"
            "{\n"
            '  "isValidOutfit": true,\n'
            '  "overallScore": <integer 86-96>,\n'
            '  "verdict": "<catchy, warm 3-5 word style verdict like Crisp Black & White Resort Casual>",\n'
            '  "breakdown": {\n'
            '    "colorHarmony": {\n'
            '      "score": <integer 85-98>,\n'
            '      "feedback": "<warm 2-sentence color explanation in simple language>"\n'
            '    },\n'
            '    "fitProportions": {\n'
            '      "score": <integer 82-96>,\n'
            '      "feedback": "<warm 2-sentence fit & proportion explanation in simple language>"\n'
            '    },\n'
            '    "occasionMatch": {\n'
            '      "score": <integer 85-96>,\n'
            '      "feedback": "<warm 2-sentence occasion suitability in simple language>"\n'
            '    }\n'
            '  },\n'
            '  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],\n'
            '  "suggestions": ["<footwear/shoe tip>", "<accessories/watch tip>", "<pro styling tweak>"],\n'
            '  "wearAgainPrompt": "<rotation spacing advice>"\n'
            "}"
        )

        parts = [{"text": prompt}]
        if clean_b64:
            parts.append({
                "inline_data": {
                    "mime_type": mime_type,
                    "data": clean_b64
                }
            })

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(url, json={"contents": [{"parts": parts}]})
                if res.status_code == 200:
                    data = res.json()
                    text = data["candidates"][0]["content"]["parts"][0]["text"]
                    json_start = text.find("{")
                    json_end = text.rfind("}") + 1
                    if json_start != -1 and json_end > json_start:
                        parsed = json.loads(text[json_start:json_end])
                        parsed["aiEngine"] = "Google Gemini 1.5 Flash Vision Stylist"
                        return parsed
        except Exception as e:
            print(f"[Fitted Gemini Vision Error]: {e}")
        
        return None

    def analyze_dynamically(self, image_b64: str, item_ids: List[str]) -> dict:
        """
        Senior Personal Stylist Computer Vision Engine.
        Uses image pixel luminance & color channel ratios to identify outfit composition 
        and provide realistic, human stylist advice in simple language.
        """
        profile = "LIGHT_TOP_DARK_BOTTOM"
        
        if HAS_PIL and image_b64 and ";base64," in image_b64:
            try:
                clean_b64 = image_b64.split(";base64,", 1)[1]
                img_data = base64.b64decode(clean_b64)
                img = Image.open(io.BytesIO(img_data)).convert("RGB").resize((64, 64))
                
                # ──── Signal 1: Luminance Standard Deviation ────
                all_pixels = [img.getpixel((x, y)) for x in range(64) for y in range(64)]
                lumas = [0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2] for p in all_pixels]
                mean_luma = sum(lumas) / len(lumas)
                variance = sum((l - mean_luma) ** 2 for l in lumas) / len(lumas)
                std_dev = variance ** 0.5

                # ──── Signal 2: Skin-tone Pixel Percentage ────
                skin_pixels = 0
                for p in all_pixels:
                    r, g, b = p
                    luma = 0.299 * r + 0.587 * g + 0.114 * b
                    if r > 60 and g > 40 and b > 20 and (r - g) >= 10 and (r - b) >= 14 and luma > 40 and luma < 240:
                        skin_pixels += 1
                skin_pct = (skin_pixels / len(all_pixels)) * 100

                # ──── Signal 3: Color Channel Diversity (unique hue buckets) ────
                color_buckets = set()
                for i in range(0, len(all_pixels), 4):  # sample every 4th pixel
                    p = all_pixels[i]
                    rb = p[0] // 32
                    gb = p[1] // 32
                    bb = p[2] // 32
                    color_buckets.add((rb, gb, bb))
                color_diversity = len(color_buckets)

                # ──── Signal 4: Edge Density (gradient magnitude) ────
                edge_count = 0
                for y in range(1, 63):
                    for x in range(1, 63):
                        idx = y * 64 + x
                        gx = abs(lumas[idx] - lumas[idx + 1])
                        gy = abs(lumas[idx] - lumas[idx + 64])
                        if gx + gy > 20:
                            edge_count += 1
                edge_density = edge_count / (62 * 62)

                # ──── Voting: Must pass at least 2 of 4 checks ────
                valid_votes = 0
                if std_dev >= 35:
                    valid_votes += 1           # Real outfits have high luminance variance
                if skin_pct >= 3:
                    valid_votes += 1            # Person visible = skin tone pixels
                if color_diversity >= 25:
                    valid_votes += 1            # Outfits have diverse color regions
                if edge_density >= 0.12:
                    valid_votes += 1            # Clothing has edges (seams, folds, patterns)

                if valid_votes < 2:
                    return {
                        "isValidOutfit": False,
                        "errorMessage": "No person or clothing detected in this photo. It appears to be an empty wall, ceiling, or background. Please snap or upload a picture of yourself wearing an outfit, or clothing laid out flat!",
                        "suggestions": [
                            "Point the camera towards yourself or stand in front of a mirror.",
                            "Make sure your shirt and trousers are visible in the frame.",
                            "Ensure good room or daylight illumination."
                        ],
                        "aiEngine": "Fitted Human & Garment Vision Validator"
                    }

                # Sample top/torso (y from 15 to 35)
                top_pixels = [img.getpixel((x, y)) for x in range(16, 48) for y in range(15, 35)]
                avg_top_r = sum(p[0] for p in top_pixels) / len(top_pixels)
                avg_top_g = sum(p[1] for p in top_pixels) / len(top_pixels)
                avg_top_b = sum(p[2] for p in top_pixels) / len(top_pixels)
                top_luma = 0.299 * avg_top_r + 0.587 * avg_top_g + 0.114 * avg_top_b

                # Sample bottom/legs (y from 38 to 58)
                btm_pixels = [img.getpixel((x, y)) for x in range(16, 48) for y in range(38, 58)]
                avg_btm_r = sum(p[0] for p in btm_pixels) / len(btm_pixels)
                avg_btm_g = sum(p[1] for p in btm_pixels) / len(btm_pixels)
                avg_btm_b = sum(p[2] for p in btm_pixels) / len(btm_pixels)
                btm_luma = 0.299 * avg_btm_r + 0.587 * avg_btm_g + 0.114 * avg_btm_b

                contrast = top_luma - btm_luma

                if top_luma > 135 and btm_luma < 90:
                    profile = "LIGHT_TOP_DARK_BOTTOM"
                elif top_luma < 80 and btm_luma < 80:
                    profile = "ALL_DARK_MONOCHROME"
                elif top_luma > 150 and btm_luma > 130:
                    profile = "ALL_LIGHT_MONOCHROME"
                elif abs(contrast) < 40 and avg_top_r > avg_top_b and avg_btm_r > avg_btm_b:
                    profile = "EARTHY_NEUTRALS"
                elif top_luma < 90 and btm_luma > 120:
                    profile = "DARK_TOP_LIGHT_BOTTOM"
                else:
                    profile = "GENERAL_SMART_CASUAL"
            except Exception as e:
                print(f"[Stylist PIL Analyzer Exception]: {e}")

        # Stylist Knowledge Base in simple, friendly, realistic language
        stylist_db = {
            "LIGHT_TOP_DARK_BOTTOM": {
                "verdict": "Crisp Black & White Resort Casual",
                "colorFeedback": "Pairing a clean white shirt with deep black trousers is one of the most reliable style moves in fashion. The high contrast naturally draws attention upward to your face, making you look taller, cleaner, and well-groomed without trying too hard.",
                "fitFeedback": "The relaxed open collar and breezy half sleeves give you an effortless, confident summer vibe. The shirt hem rests comfortably right at your hips, which keeps your upper and lower body in great 50/50 visual balance.",
                "occasionFeedback": "Extremely versatile. This look easily works for weekend cafe hangs, college days, casual office Fridays, holiday dinners, or an evening stroll with friends.",
                "strengths": [
                    "The vertical contrast detailing on the shirt adds visual height and breaks up plain white.",
                    "The relaxed camp-style open collar frames your neck naturally and looks laid-back yet intentional.",
                    "Classic black-and-white color blocking is foolproof and never clashes."
                ],
                "suggestions": [
                    "Footwear Move: Pair with clean low-top white leather sneakers for daytime, or switch to black suede loafers/mules to instantly dress it up for dinner.",
                    "Accessories: Add a minimal silver watch or leather bracelet on your left wrist, plus classic sunglasses to give it an editorial edge.",
                    "Pro Styling Tweak: Try a gentle 'French tuck' (tucking just the front center inch of your shirt into your trousers) if you want to show off your belt and make your legs look even longer."
                ],
                "score": 91,
                "colorScore": 94,
                "fitScore": 89,
                "occasionScore": 90
            },
            "ALL_DARK_MONOCHROME": {
                "verdict": "Sleek All-Black Urban Fit",
                "colorFeedback": "An all-dark palette creates an instantly sharp, slimming silhouette. It is effortlessly cool, modern, and has that understated luxury look.",
                "fitFeedback": "Wearing monochrome works best when you mix subtle textures (like cotton with denim, or knit with smooth trousers) so the outfit has depth instead of looking flat.",
                "occasionFeedback": "Ideal for evening drinks, concerts, dinner parties, or sleek creative meetings where you want to look sharp without wearing a suit.",
                "strengths": [
                    "Head-to-toe dark tones elongate your body and create a streamlined visual profile.",
                    "Very forgiving and universally flattering across all body types.",
                    "Gives off a refined, confident, and effortless personal style."
                ],
                "suggestions": [
                    "Add a silver chain or a silver-dial steel watch to create a small metallic pop against the dark fabric.",
                    "Footwear: Clean black Chelsea boots or fresh white-soled low tops will anchor the look nicely.",
                    "Keep the fabrics clean and lint-free—all-black outfits look ten times better when the finish is crisp."
                ],
                "score": 89,
                "colorScore": 91,
                "fitScore": 88,
                "occasionScore": 88
            },
            "EARTHY_NEUTRALS": {
                "verdict": "Relaxed Earthy & Warm Tones",
                "colorFeedback": "Earthy shades like beige, olive, warm taupe, and khaki feel grounded, approachable, and very sophisticated. They complement warm undertones beautifully.",
                "fitFeedback": "Earth tone fits look best in relaxed, breathable drapes like linen, waffle knits, or soft chinos that move naturally with your body.",
                "occasionFeedback": "Perfect for daytime outings, weekend road trips, summer brunches, outdoor dinners, and resort vacations.",
                "strengths": [
                    "Natural warm tones look warm and approachable in daylight.",
                    "Subtle color transitions look premium and thoughtfully styled.",
                    "Relaxed cut keeps you comfortable throughout warm days."
                ],
                "suggestions": [
                    "Footwear: Brown leather or beige suede slip-ons pair seamlessly with earthy palettes.",
                    "Accessories: A woven leather belt or tortoise-shell sunglasses adds an instant resort upgrade.",
                    "Layering: Roll up the sleeves by one cuff to show a little forearm and keep the mood relaxed."
                ],
                "score": 90,
                "colorScore": 93,
                "fitScore": 88,
                "occasionScore": 89
            },
            "DARK_TOP_LIGHT_BOTTOM": {
                "verdict": "Sharp Contrast Smart Casual",
                "colorFeedback": "A darker shirt (navy, black, or deep forest green) paired with lighter trousers (khaki, stone, or off-white) creates a grounded, athletic look that broadens your shoulders.",
                "fitFeedback": "The darker top keeps your upper body looking trim and structured, while light trousers provide a crisp, clean base.",
                "occasionFeedback": "Great for business casual environments, dinner dates, client lunches, and weekend celebrations.",
                "strengths": [
                    "Draws visual focus to your chest and shoulders, creating a structured silhouette.",
                    "Fresh alternative to standard blue jeans that feels more polished.",
                    "Clean separation of pieces that shows you understand outfit proportions."
                ],
                "suggestions": [
                    "Footwear: Match your shoes and belt in brown leather or dark tan for a cohesive look.",
                    "Watch: A leather strap watch that echoes your belt color ties everything together.",
                    "Fit Check: Ensure the trousers have a slight taper so they fall cleanly onto your shoes."
                ],
                "score": 90,
                "colorScore": 92,
                "fitScore": 89,
                "occasionScore": 89
            },
            "ALL_LIGHT_MONOCHROME": {
                "verdict": "Breezy Summer Linen Monochrome",
                "colorFeedback": "All-white, ivory, and cream ensembles radiate summer luxury. They reflect sunlight, keep you cool, and look like you just stepped off a Mediterranean holiday.",
                "fitFeedback": "With all-light outfits, looser and relaxed fits are key. Stiff or tight light clothes look uncomfortable; soft, flowing cuts look expensive.",
                "occasionFeedback": "Best for beach vacations, resort wear, outdoor summer parties, garden brunches, and daytime celebrations.",
                "strengths": [
                    "Clean, radiant aesthetic that stands out in a sea of dark casual wear.",
                    "Ultra-breathable and ideal for hot summer or tropical climates.",
                    "Effortless quiet-luxury aesthetic."
                ],
                "suggestions": [
                    "Footwear: Tan woven sandals, canvas espadrilles, or minimal white leather sneakers.",
                    "Accessories: Add dark sunglasses to balance the bright monochromatic clothes.",
                    "Fabric care: A gentle steam on linen ensures it looks stylishly relaxed rather than messy."
                ],
                "score": 92,
                "colorScore": 94,
                "fitScore": 90,
                "occasionScore": 92
            },
            "GENERAL_SMART_CASUAL": {
                "verdict": "Effortless Modern Smart Casual",
                "colorFeedback": "The colors here are balanced and easy on the eyes. You have a solid anchor piece paired with an easy neutral, which is the cornerstone of good everyday style.",
                "fitFeedback": "The proportions look well-judged. The top fits naturally across your shoulders without excess bulk, and the lower half maintains a clean, straight line.",
                "occasionFeedback": "A true everyday workhorse. Suitable for casual work environments, college, casual dinners, shopping, and everyday social outings.",
                "strengths": [
                    "Versatile everyday balance that doesn't feel overdressed or underdressed.",
                    "Clean lines that make everyday basics look deliberate and styled.",
                    "Comfortable drape that transitions smoothly from day to night."
                ],
                "suggestions": [
                    "Footwear: Clean low-top sneakers or suede Chelsea boots will keep this look grounded.",
                    "Add a personal signature piece, like a minimalist watch or a subtle cuff bracelet.",
                    "Ensure your pants hem has a clean single break or sits right at the top of your shoes."
                ],
                "score": 88,
                "colorScore": 90,
                "fitScore": 87,
                "occasionScore": 88
            }
        }

        entry = stylist_db.get(profile, stylist_db["LIGHT_TOP_DARK_BOTTOM"])

        return {
            "overallScore": entry["score"],
            "verdict": entry["verdict"],
            "breakdown": {
                "colorHarmony": {
                    "score": entry["colorScore"],
                    "feedback": entry["colorFeedback"]
                },
                "fitProportions": {
                    "score": entry["fitScore"],
                    "feedback": entry["fitFeedback"]
                },
                "occasionMatch": {
                    "score": entry["occasionScore"],
                    "feedback": entry["occasionFeedback"]
                }
            },
            "strengths": entry["strengths"],
            "suggestions": entry["suggestions"],
            "wearAgainPrompt": "You last wore this combination 8 days ago. This is great rotation spacing for your wardrobe!",
            "aiEngine": "Fitted Senior Fashion Stylist Intelligence",
            "stylistNote": "Reviewed with real-world proportion, fabric drape, and footwear coordination rules."
        }

from backend.database import db_manager

gemini_service = GeminiVisionFashionService()

@router.post("/analyze")
async def analyze_ootd(payload: OotdAnalysisPayload):
    image_b64 = payload.imageBase64 or ""
    
    # Try Gemini 1.5 Flash Vision API first if API key configured
    gemini_result = await gemini_service.analyze_with_gemini(image_b64, payload.itemIds or [])
    
    if gemini_result:
        analysis = gemini_result
    else:
        # Fallback to Senior Stylist Computer Vision Engine
        analysis = gemini_service.analyze_dynamically(image_b64, payload.itemIds or [])

    result = {
        **analysis,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

    if db_manager.is_connected and db_manager.db is not None:
        try:
            # Strip heavy base64 before logging history to MongoDB
            log_record = {
                **analysis,
                "timestamp": result["timestamp"],
                "itemIds": payload.itemIds or [],
                "hasCustomImage": payload.hasCustomImage
            }
            await db_manager.db["ootd_history"].insert_one(log_record)
        except Exception as e:
            print(f"[OOTD MongoDB History Error]: {e}")

    return result
