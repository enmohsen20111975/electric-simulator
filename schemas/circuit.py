"""
Circuit Schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class CircuitCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    is_public: bool = False
    category: Optional[str] = None
    tags: Optional[List[str]] = []
    components: List[Dict[str, Any]] = []
    wires: List[Dict[str, Any]] = []
    settings: Optional[Dict[str, Any]] = {}


class CircuitUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    is_public: Optional[bool] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    components: Optional[List[Dict[str, Any]]] = None
    wires: Optional[List[Dict[str, Any]]] = None
    settings: Optional[Dict[str, Any]] = None


class CircuitResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    owner_id: int
    is_public: bool
    is_template: bool
    category: Optional[str]
    tags: Optional[List[str]]
    components: List[Dict[str, Any]]
    wires: List[Dict[str, Any]]
    settings: Dict[str, Any]
    views: int
    likes: int
    fork_count: int
    forked_from: Optional[int]
    created_at: datetime
    updated_at: datetime
    last_simulated: Optional[datetime]
    
    class Config:
        from_attributes = True


class CircuitListResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    owner_id: int
    is_public: bool
    category: Optional[str]
    tags: Optional[List[str]]
    views: int
    likes: int
    fork_count: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
