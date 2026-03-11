"""
HomesPh Global News Engine - Storage Handler
Handles: Redis metadata storage (organized by country/category), Cloud image uploads (GCP or AWS S3).
"""

import os
import redis
import json
import boto3
from concurrent.futures import ThreadPoolExecutor
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

        # Storage Provider Setup
        self.storage_provider = os.getenv("STORAGE_PROVIDER", "gcp").lower()
        
        # GCP Storage Setup
        self.gcp_bucket_name = os.getenv("GCP_BUCKET_NAME")
        self.gcs_client = None
        
        # AWS S3 Setup
        self.s3_bucket_name = os.getenv("AWS_BUCKET")
        self.s3_folder = os.getenv("AWS_FOLDER", "")
        self.s3_client = None

        if self.storage_provider == "aws":
            self._init_s3()
        else:
            self._init_gcp()

    def _init_s3(self):
        """Initialize AWS S3 client."""
        aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
        aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
        aws_region = os.getenv("AWS_DEFAULT_REGION", "ap-southeast-1")

        if not aws_access_key or not aws_secret_key:
            print("ℹ️ AWS credentials not provided. S3 uploads disabled.")
            return

        try:
            self.s3_client = boto3.client(
                's3',
                aws_access_key_id=aws_access_key,
                aws_secret_access_key=aws_secret_key,
                region_name=aws_region
            )
            print(f"✅ AWS S3 Initialized (Bucket: {self.s3_bucket_name})")
        except Exception as e:
            print(f"⚠️ AWS S3 Init Error: {e}")

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
        Uploads an image to the configured cloud storage (GCP or AWS).
        Returns the public URL or the local path if upload fails.
        """
        if self.storage_provider == "aws":
            return self._upload_to_s3(local_path, destination_path)
        else:
            return self._upload_to_gcp(local_path, destination_path)

    def _upload_to_s3(self, local_path, destination_path):
        """Uploads an image to AWS S3."""
        if not self.s3_client or not self.s3_bucket_name:
            return local_path

        try:
            # prefix with folder if provided
            if self.s3_folder:
                # Ensure the folder ends with a slash and the destination doesn't start with one
                folder = self.s3_folder.strip('/')
                destination = destination_path.lstrip('/')
                s3_path = f"{folder}/{destination}"
            else:
                s3_path = destination_path

            self.s3_client.upload_file(
                local_path, 
                self.s3_bucket_name, 
                s3_path,
                ExtraArgs={'ACL': 'public-read', 'ContentType': 'image/jpeg'}
            )
            
            region = os.getenv("AWS_DEFAULT_REGION", "ap-southeast-1")
            public_url = f"https://{self.s3_bucket_name}.s3.{region}.amazonaws.com/{s3_path}"
            
            # Clean up local file after successful upload
            if os.path.exists(local_path):
                os.remove(local_path)
                
            return public_url
        except Exception as e:
            print(f"❌ AWS S3 Upload Error: {e}")
            return local_path

    def _upload_to_gcp(self, local_path, destination_path):
        """Uploads an image to GCP Cloud Storage."""
        if not self.gcs_client or not self.gcp_bucket_name:
            return local_path
            
        try:
            bucket = self.gcs_client.bucket(self.gcp_bucket_name)
            blob = bucket.blob(destination_path)
            blob.upload_from_filename(local_path)
            
            # Clean up local file after successful upload
            if os.path.exists(local_path):
                os.remove(local_path)
                
            return blob.public_url
        except Exception as e:
            print(f"❌ GCP Upload Error: {e}")
            return local_path

    def delete_article(self, article_id):
        """
        Deletes an article from Redis and its associated image from Cloud Storage.
        Returns True if successful, False otherwise.
        """
        try:
            # 1. Get article data to find image URL
            article_key = f"{self.prefix}article:{article_id}"
            data = self.redis_client.get(article_key)
            if not data:
                print(f"⚠️ Article {article_id} not found in Redis.")
                return False
                
            article = json.loads(data)
            image_url = article.get("image_url")
            country = article.get("country", "Global")
            category = article.get("category", "General")
            topics = article.get("topics", [])
            
            # 2. Delete image from Cloud Storage
            if image_url and not image_url.startswith("https://placehold.co"):
                self._delete_cloud_image(image_url)
                
            # 3. Remove from all Redis indexes
            # Main article data
            self.redis_client.delete(article_key)
            
            # Global index
            self.redis_client.srem(f"{self.prefix}all_articles", article_id)
            
            # Time-based index
            self.redis_client.zrem(f"{self.prefix}articles_by_time", article_id)
            
            # Country index
            country_key = f"{self.prefix}country:{country.lower().replace(' ', '_')}"
            self.redis_client.srem(country_key, article_id)
            
            # Category index
            category_key = f"{self.prefix}category:{category.lower().replace(' ', '_')}"
            self.redis_client.srem(category_key, article_id)
            
            # Topic indexes
            for topic in topics:
                topic_key = f"{self.prefix}topic:{topic.lower().replace(' ', '_').replace('&', 'and')}"
                self.redis_client.srem(topic_key, article_id)
                
            print(f"🗑️ Article {article_id} and its assets deleted successfully.")
            return True
            
        except Exception as e:
            print(f"❌ Deletion Error: {e}")
            return False

    def _delete_cloud_image(self, image_url):
        """Extracts the path from the URL and deletes the file from Cloud Storage."""
        try:
            if self.storage_provider == "aws" and self.s3_client:
                # Extract S3 Key from URL: https://bucket.s3.region.amazonaws.com/path/to/image.png
                # We need: path/to/image.png
                parts = image_url.split(".amazonaws.com/")
                if len(parts) > 1:
                    s3_path = parts[1]
                    self.s3_client.delete_object(Bucket=self.s3_bucket_name, Key=s3_path)
                    print(f"🧹 S3 Image Deleted: {s3_path}")
                    
            elif self.storage_provider == "gcp" and self.gcs_client:
                # Extract blob name from GCP URL: https://storage.googleapis.com/bucket/path/to/image.png
                parts = image_url.split(f"{self.gcp_bucket_name}/")
                if len(parts) > 1:
                    blob_name = parts[1]
                    bucket = self.gcs_client.bucket(self.gcp_bucket_name)
                    blob = bucket.blob(blob_name)
                    blob.delete()
                    print(f"🧹 GCP Image Deleted: {blob_name}")
                    
        except Exception as e:
            print(f"⚠️ Cloud Cleanup Warning: {e}")

    def clear_all_articles(self):
        """
        Deletes ALL articles from Redis and their associated images from Cloud Storage.
        Uses parallel threads to speed up cloud image deletions.
        """
        try:
            # 1. Get all article IDs
            article_ids = list(self.redis_client.smembers(f"{self.prefix}all_articles"))
            if not article_ids:
                return 0
                
            print(f"🧹 Starting parallel purge of {len(article_ids)} articles...")
            
            # 2. Use ThreadPoolExecutor for parallel deletion (especially for S3/GCP)
            # Parallelizing this makes it much faster for large datasets
            with ThreadPoolExecutor(max_workers=10) as executor:
                results = list(executor.map(self.delete_article, article_ids))
            
            count = sum(1 for r in results if r)
            
            # 3. Final cleanup of global metadata sets
            self.redis_client.delete(f"{self.prefix}all_articles")
            self.redis_client.delete(f"{self.prefix}articles_by_time")
            self.redis_client.delete(f"{self.prefix}all_topics")
            self.redis_client.delete(f"{self.prefix}scraped_urls")
            self.redis_client.delete(f"{self.prefix}title_hashes")
            
            # Additional keys that might exist
            keys_to_clear = self.redis_client.keys(f"{self.prefix}country:*")
            keys_to_clear += self.redis_client.keys(f"{self.prefix}category:*")
            keys_to_clear += self.redis_client.keys(f"{self.prefix}topic:*")
            
            if keys_to_clear:
                self.redis_client.delete(*keys_to_clear)
            
            print(f"💥 DATABASE PURGED: {count} articles and images deleted.")
            return count
        except Exception as e:
            print(f"❌ Clear All Error: {e}")
            return 0

    def purge_old_articles(self, max_age_hours=24):
        """
        Deletes articles older than max_age_hours from Redis.
        Helps keep the news feed fresh as per user request.
        """
        try:
            # 1. Get current time
            import time
            now = time.time()
            max_age_seconds = max_age_hours * 3600
            
            # 2. Get all article IDs and their timestamps from the sorted set
            # ZREVRANGEBYSCORE might be more efficient, but let's get all and filter
            old_articles = self.redis_client.zrangebyscore(
                f"{self.prefix}articles_by_time", 
                0, 
                now - max_age_seconds
            )
            
            if not old_articles:
                print(f"✨ No articles older than {max_age_hours}h found.")
                return 0
                
            print(f"🧹 Found {len(old_articles)} articles older than {max_age_hours}h. Purging...")
            
            # 3. Use parallel threads for cloud deletion if needed
            count = 0
            with ThreadPoolExecutor(max_workers=5) as executor:
                results = list(executor.map(self.delete_article, old_articles))
                count = sum(1 for r in results if r)
            
            print(f"🗑️ Successfully purged {count} outdated articles.")
            return count
            
        except Exception as e:
            print(f"❌ Purge Error: {e}")
            return 0

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
