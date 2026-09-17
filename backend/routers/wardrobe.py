import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from backend.database import db_manager

router = APIRouter(prefix="/wardrobe", tags=["Wardrobe Vault"])

class WardrobeItem(BaseModel):
    id: str
    name: str
    category: str
    brand: str
    color: str
    season: str
    wearCount: int = 0
    image: str
    tags: Optional[List[str]] = []
    fitNote: Optional[str] = ""

# In-memory storage fallback for demo execution
WARDROBE_STORE: List[dict] = [
    {
        "id": "w_01",
        "name": "Structured Charcoal Blazer",
        "category": "Outerwear",
        "brand": "Acne Studios",
        "color": "Charcoal Gray",
        "season": "Autumn/Winter",
        "wearCount": 12,
        "image": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80",
        "tags": ["Formal", "Smart Casual"],
        "fitNote": "Tailored fit; complements athletic shoulder line."
    },
    {
        "id": "w_02",
        "name": "Heavyweight Raw Denim Jacket",
        "category": "Outerwear",
        "brand": "A.P.C.",
        "color": "Indigo Blue",
        "season": "All Season",
        "wearCount": 24,
        "image": "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=600&q=80",
        "tags": ["Casual", "Streetwear"],
        "fitNote": "Slightly boxy silhouette; pairs great with beige trousers."
    },
    {
        "id": "w_03",
        "name": "Minimalist Off-White Oversized Tee",
        "category": "Tops",
        "brand": "COS",
        "color": "Cream / Off-White",
        "season": "Summer/Spring",
        "wearCount": 38,
        "image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
        "tags": ["Essential", "Minimalist"],
        "fitNote": "Clean drop shoulder; balances warm undertones."
    }
]

@router.get("", response_model=List[dict])
async def get_wardrobe():
    if db_manager.is_connected and db_manager.db is not None:
        try:
            cursor = db_manager.db["wardrobe"].find({}, {"_id": 0})
            items = await cursor.to_list(length=100)
            if items:
                return items
            # Seed default items into MongoDB collection on first load
            await db_manager.db["wardrobe"].insert_many([dict(i) for i in WARDROBE_STORE])
            return WARDROBE_STORE
        except Exception as e:
            print(f"[Wardrobe MongoDB Error]: {e}. Using in-memory fallback.")
    return WARDROBE_STORE

@router.post("", response_model=dict)
async def add_wardrobe_item(item: dict):
    item_id = item.get("id") or f"w_{int(time.time() * 1000)}"
    item["id"] = item_id
    item["wearCount"] = item.get("wearCount", 1)
    
    if db_manager.is_connected and db_manager.db is not None:
        try:
            item_record = {k: v for k, v in item.items() if k != "_id"}
            await db_manager.db["wardrobe"].insert_one(item_record)
            item.pop("_id", None)
        except Exception as e:
            print(f"[Wardrobe MongoDB Insert Error]: {e}")

    WARDROBE_STORE.insert(0, item)
    return item

@router.delete("/{item_id}")
async def delete_wardrobe_item(item_id: str):
    global WARDROBE_STORE
    WARDROBE_STORE = [i for i in WARDROBE_STORE if i.get("id") != item_id]
    
    if db_manager.is_connected and db_manager.db is not None:
        try:
            await db_manager.db["wardrobe"].delete_one({"id": item_id})
        except Exception as e:
            print(f"[Wardrobe MongoDB Delete Error]: {e}")

    return {"success": True, "deletedId": item_id}

