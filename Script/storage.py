"""
HomesPh Global News Engine - Storage Handler
Handles: Redis metadata storage (organized by country/category), GCP image uploads.
"""

import os
import redis
import json
from google.cloud import storage
from google.oauth2 import service_account
from dotenv import load_dotenv
from config import REDIS_KEYS

load_dotenv()

class StorageHandler:
    def __init__(self):
        # Redis Setup
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        self.redis_client = redis.from_url(redis_url, decode_responses=True)
        self.prefix = os.getenv("REDIS_PREFIX", "homesph:")

        # GCP Storage Setup
        self.bucket_name = os.getenv("GCP_BUCKET_NAME")
        self.gcs_client = None
        self._init_gcp()

    def _init_gcp(self):
        """Initialize GCP Cloud Storage client."""
        credential_data = os.getenv("GCP_SERVICE_ACCOUNT_JSON")
        if not credential_data:
            print("ℹ️ GCP credentials not provided. Cloud uploads disabled.")
            return
            
        try:
            # Clean up: remove outer quotes if present
            credential_data = credential_data.strip()
            if credential_data.startswith("'") and credential_data.endswith("'"):
                credential_data = credential_data[1:-1]
            elif credential_data.startswith('"') and credential_data.endswith('"'):
                credential_data = credential_data[1:-1]
            
            # Check if it's a file path
            if credential_data.endswith(".json") and os.path.exists(credential_data):
                with open(credential_data, 'r') as f:
                    info = json.load(f)
            else:
                # Parse as JSON string
                info = json.loads(credential_data)
                
                # FIX: Convert literal \n to actual newlines in private_key
                # This is needed when .env stores \\n instead of real newlines
                if "private_key" in info and isinstance(info["private_key"], str):
                    if "\\n" in info["private_key"]:
                        info["private_key"] = info["private_key"].replace("\\n", "\n")
            
            credentials = service_account.Credentials.from_service_account_info(info)
            self.gcs_client = storage.Client(credentials=credentials, project=info.get("project_id"))
            print(f"✅ GCP Cloud Storage Initialized (Project: {info.get('project_id')})")
        except json.JSONDecodeError as e:
            print(f"⚠️ GCP JSON Parse Error: {e}")
            print("💡 Tip: Try saving your credentials to a 'service-account.json' file instead.")
        except Exception as e:
            print(f"⚠️ GCP Auth Warning: {e}")




    def save_article(self, article_data):
        """
        Saves an article to Redis with proper indexing.
        Organizes by: country, category, topics, and global list.
        """
        article_id = article_data.get("id")
        country = article_data.get("country", "Global")
        category = article_data.get("category", "General")
        topics = article_data.get("topics", [])
        
        # Save the full article
        main_key = f"{self.prefix}article:{article_id}"
        self.redis_client.set(main_key, json.dumps(article_data))
        
        # Index by country
        country_key = f"{self.prefix}country:{country.lower().replace(' ', '_')}"
        self.redis_client.sadd(country_key, article_id)
        
        # Index by category
        category_key = f"{self.prefix}category:{category.lower().replace(' ', '_')}"
        self.redis_client.sadd(category_key, article_id)
        
        # Index by topics (NEW: AI-detected sub-topics)
        for topic in topics:
            topic_key = f"{self.prefix}topic:{topic.lower().replace(' ', '_').replace('&', 'and')}"
            self.redis_client.sadd(topic_key, article_id)
        
        # Track all unique topics
        for topic in topics:
            self.redis_client.sadd(f"{self.prefix}all_topics", topic)
        
        # Global index
        self.redis_client.sadd(f"{self.prefix}all_articles", article_id)
        
        # Store timestamp for sorting
        self.redis_client.zadd(f"{self.prefix}articles_by_time", {article_id: article_data.get("timestamp", 0)})
        
        return main_key

    def get_articles_by_country(self, country, limit=20):
        """Retrieves articles for a specific country."""
        country_key = f"{self.prefix}country:{country.lower().replace(' ', '_')}"
        article_ids = self.redis_client.smembers(country_key)
        
        articles = []
        for aid in list(article_ids)[:limit]:
            data = self.redis_client.get(f"{self.prefix}article:{aid}")
            if data:
                articles.append(json.loads(data))
        return articles

    def get_articles_by_category(self, category, limit=20):
        """Retrieves articles for a specific category."""
        category_key = f"{self.prefix}category:{category.lower().replace(' ', '_')}"
        article_ids = self.redis_client.smembers(category_key)
        
        articles = []
        for aid in list(article_ids)[:limit]:
            data = self.redis_client.get(f"{self.prefix}article:{aid}")
            if data:
                articles.append(json.loads(data))
        return articles

    def get_articles_by_topic(self, topic, limit=20):
        """Retrieves articles for a specific AI-detected topic."""
        topic_key = f"{self.prefix}topic:{topic.lower().replace(' ', '_').replace('&', 'and')}"
        article_ids = self.redis_client.smembers(topic_key)
        
        articles = []
        for aid in list(article_ids)[:limit]:
            data = self.redis_client.get(f"{self.prefix}article:{aid}")
            if data:
                articles.append(json.loads(data))
        return articles

    def get_all_topics(self):
        """Returns all unique topics discovered by the AI."""
        return list(self.redis_client.smembers(f"{self.prefix}all_topics"))

    def get_latest_articles(self, limit=50):
        """Retrieves the most recent articles across all countries."""
        article_ids = self.redis_client.zrevrange(f"{self.prefix}articles_by_time", 0, limit - 1)
        
        articles = []
        for aid in article_ids:
            data = self.redis_client.get(f"{self.prefix}article:{aid}")
            if data:
                articles.append(json.loads(data))
        return articles

    def get_article(self, article_id):
        """Retrieves a single article by ID."""
        data = self.redis_client.get(f"{self.prefix}article:{article_id}")
        return json.loads(data) if data else None

    def upload_image(self, local_path, destination_path):
        """
        Uploads an image to GCP Cloud Storage.
        Returns the public URL or the local path if upload fails.
        """
        if not self.gcs_client or not self.bucket_name:
            return local_path
            
        try:
            bucket = self.gcs_client.bucket(self.bucket_name)
            blob = bucket.blob(destination_path)
            blob.upload_from_filename(local_path)
            
            # Clean up local file after successful upload
            if os.path.exists(local_path):
                os.remove(local_path)
                
            return blob.public_url
        except Exception as e:
            print(f"❌ GCP Upload Error: {e}")
            return local_path

    def get_stats(self):
        """Returns statistics about stored articles."""
        return {
            "total_articles": self.redis_client.scard(f"{self.prefix}all_articles"),
            "countries": self.redis_client.keys(f"{self.prefix}country:*"),
            "categories": self.redis_client.keys(f"{self.prefix}category:*"),
        }


if __name__ == "__main__":
    storage = StorageHandler()
    stats = storage.get_stats()
    print(f"Total Articles: {stats['total_articles']}")
