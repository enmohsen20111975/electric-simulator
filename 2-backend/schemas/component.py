"""
Component Library Schemas - Pydantic Models for API
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Any
from datetime import datetime

class ManufacturerResponse(BaseModel):
    id: int
    name: str
    country: Optional[str]
    website: Optional[str]
    logo_url: Optional[str]
    
    class Config:
        from_attributes = True

class ComponentBase(BaseModel):
    part_number: str = Field(..., description="Manufacturer part number")
    name: str
    description: Optional[str]
    category: str
    subcategory: Optional[str]
    series: Optional[str]
    
    electrical_specs: Optional[Dict[str, Any]] = Field(default_factory=dict)
    mechanical_specs: Optional[Dict[str, Any]] = Field(default_factory=dict)
    environmental_specs: Optional[Dict[str, Any]] = Field(default_factory=dict)
    certification: Optional[Dict[str, Any]] = Field(default_factory=dict)
    
    symbol_type: Optional[str] = "IEEE"
    svg_symbol: Optional[str]
    canvas_width: int = 80
    canvas_height: int = 80
    ports_definition: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    
    base_price: Optional[float]
    currency: str = "USD"
    stock_status: Optional[str] = "Unknown"
    
    datasheet_url: Optional[str]
    manual_url: Optional[str]
    cad_model_url: Optional[str]

class ComponentCreate(ComponentBase):
    manufacturer_id: int

class ComponentResponse(ComponentBase):
    id: int
    manufacturer: Optional[ManufacturerResponse]
    is_active: bool
    is_discontinued: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ComponentSearchRequest(BaseModel):
    category: Optional[str]
    manufacturer: Optional[str]
    voltage_min: Optional[float]
    voltage_max: Optional[float]
    current_min: Optional[float]
    current_max: Optional[float]
    price_min: Optional[float]
    price_max: Optional[float]
    search_text: Optional[str]

class BOMRequest(BaseModel):
    components: List[int] = Field(..., description="List of component IDs")
    
class BOMResponse(BaseModel):
    items: List[Dict[str, Any]]
    total_cost: float
    currency: str
    item_count: int
