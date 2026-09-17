import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env if present
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/fitted_db")

class DatabaseManager:
    def __init__(self):
        self.db = None
        self.client = None
        self.is_connected = False

    async def connect(self):
        try:
            import motor.motor_asyncio
            
            client_options = {
                "serverSelectionTimeoutMS": 5000
            }
            # Provide certifi CA bundle for secure SSL/TLS connections (e.g. MongoDB Atlas)
            try:
                import certifi
                if "ssl=true" in MONGODB_URL.lower() or "tls=true" in MONGODB_URL.lower() or "mongodb+srv" in MONGODB_URL.lower():
                    client_options["tlsCAFile"] = certifi.where()
            except ImportError:
                pass

            self.client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL, **client_options)
            try:
                self.db = self.client.get_default_database()
            except Exception:
                self.db = self.client.get_database("fitted_db")
            if self.db is None:
                self.db = self.client.get_database("fitted_db")

            # Ping to verify connection
            await self.client.admin.command('ping')
            self.is_connected = True
            masked_url = MONGODB_URL.split('@')[-1] if '@' in MONGODB_URL else MONGODB_URL
            print(f"[Fitted Backend] Connected to MongoDB ({masked_url})")
        except Exception as e:
            self.is_connected = False
            print(f"[Fitted Backend] MongoDB connection offline ({e}). Operating with fast async memory store.")

    async def disconnect(self):
        if self.client:
            self.client.close()

db_manager = DatabaseManager()

