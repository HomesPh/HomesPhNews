"""
HomesPh Global News Engine - Models
Pydantic models for API responses.
"""

from typing import Optional, List
from pydantic import BaseModel


class Article(BaseModel):
    """Full article model."""
    id: str
    country: str
    category: str
    title: str
    content: str
    keywords: Optional[str] = ""
    original_url: Optional[str] = ""
    image_url: Optional[str] = ""
    timestamp: Optional[float] = 0
    

class Restaurant(BaseModel):
    """Restaurant model - Enhanced for real restaurant data."""
    id: str
    name: str  # Actual restaurant name (e.g., "Jollibee BGC", "Kuya J Cebu")
    country: str
    city: Optional[str] = ""
    cuisine_type: str  # Fine Dining, Casual Dining, Fast Food, etc.
    description: str  # Clickbait-friendly, engaging description
    
    # Location & Maps
    address: Optional[str] = ""  # Full street address for Google Maps
    latitude: Optional[float] = None  # Geolocation
    longitude: Optional[float] = None  # Geolocation
    google_maps_url: Optional[str] = ""  # Direct Google Maps link
    
    # Business Info
    is_filipino_owned: Optional[bool] = False  # Is it a Filipino-owned business?
    brand_story: Optional[str] = ""  # About the restaurant/brand history
    owner_info: Optional[str] = ""  # Owner name if mentioned
    
    # Food & Menu
    specialty_dish: Optional[str] = ""
    menu_highlights: Optional[str] = ""  # Comma-separated popular items
    food_topics: Optional[str] = ""  # pork-based, vegetarian, seafood, halal, etc.
    
    # Pricing & Budget (NO PESO SIGNS)
    price_range: Optional[str] = ""  # 1, 2, 3, 4 (1=Budget, 2=Mid-Range, 3=Expensive, 4=Luxury)
    budget_category: Optional[str] = ""  # "Budget Friendly", "Mid-Range", "Expensive", "Luxury"
    avg_meal_cost: Optional[str] = ""  # e.g., "200-400 PHP per person" or "50 USD" (NO peso signs)
    
    # Engagement
    rating: Optional[float] = 0.0
    clickbait_hook: Optional[str] = ""  # One-liner hook for social media
    why_filipinos_love_it: Optional[str] = ""  # Why OFWs/Filipinos should visit
    
    # Contact
    contact_info: Optional[str] = ""
    website: Optional[str] = ""
    social_media: Optional[str] = ""
    
    # Meta
    original_url: Optional[str] = ""
    timestamp: Optional[float] = 0


class ImageGenerationRequest(BaseModel):
    """Request payload for AI image generation."""
    prompt: str
    n: int = 1


class RestaurantSummary(BaseModel):
    """Lightweight restaurant for lists."""
    id: str
    name: str
    country: str
    cuisine_type: str


class ArticleSummary(BaseModel):
    """Lightweight article for lists."""
    id: str
    country: str
    category: str
    title: str
    image_url: Optional[str] = ""


class JobResult(BaseModel):
    """Result of processing a single country."""
    country: str
    category: str
    status: str
    article_id: Optional[str] = None
    title: Optional[str] = None
    error: Optional[str] = None
    duration: float


class JobStatus(BaseModel):
    """Current scheduler status."""
    last_run: Optional[str]
    next_run: Optional[str]
    is_running: bool
    total_runs: int
    total_success: int
    total_errors: int
    last_results: List[dict]


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    redis_connected: bool
    mysql_connected: bool
    scheduler_running: bool
    timestamp: str
    uptime: str


class CountryStats(BaseModel):
    """Country with article count."""
    name: str
    count: int


class CategoryStats(BaseModel):
    """Category with article count."""
    name: str
    count: int


# ═══════════════════════════════════════════════════════════════
# SQLALCHEMY MODELS (MYSQL)
# ═══════════════════════════════════════════════════════════════

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from datetime import datetime
from database import Base

class CategoryDB(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, unique=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CountryDB(Base):
    __tablename__ = "countries"
    
    id = Column(String(10), primary_key=True) # e.g., "PH"
    name = Column(String(255), nullable=False)
    gl = Column(String(10), nullable=False)
    h1 = Column(String(10), nullable=False)
    ceid = Column(String(50), nullable=False)
    is_active = Column(Boolean, default=True)

class CityDB(Base):
    __tablename__ = "cities"
    
    city_id = Column(Integer, primary_key=True, index=True)
    country_id = Column(String(10), nullable=False)
    name = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)


# ═══════════════════════════════════════════════════════════════
# PYDANTIC SCHEMAS FOR DB MODELS
# ═══════════════════════════════════════════════════════════════

class DBCategory(BaseModel):
    id: int
    name: str
    slug: str
    is_active: bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class DBCountry(BaseModel):
    id: str
    name: str
    gl: str
    h1: str
    ceid: str
    is_active: bool

    class Config:
        from_attributes = True
