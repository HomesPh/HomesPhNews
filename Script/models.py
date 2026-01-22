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
