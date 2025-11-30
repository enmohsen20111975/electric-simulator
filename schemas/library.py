"""
Component Library Schemas
"""

from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, Dict, Any
from datetime import datetime


class ComponentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    category: str
    type: str
    manufacturer: Optional[str] = None
    part_number: Optional[str] = None
    specifications: Optional[Dict[str, Any]] = {}
    datasheet_url: Optional[HttpUrl] = None
    default_properties: Optional[Dict[str, Any]] = {}


class ComponentResponse(BaseModel):
    id: int
    name: str
    category: str
    type: str
    manufacturer: Optional[str]
    part_number: Optional[str]
    specifications: Dict[str, Any]
    datasheet_url: Optional[str]
    image_url: Optional[str]
    default_properties: Dict[str, Any]
    is_verified: bool
    is_custom: bool
    downloads: int
    rating: float
    created_at: datetime
    
    class Config:
        from_attributes = True
