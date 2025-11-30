"""
Component Library API Routes
GET component data, pricing, datasheets from database
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database import get_db
from models.component_library import Component, Manufacturer, ComponentAlternative, PriceHistory
from schemas.component import ComponentResponse, ComponentCreate, ManufacturerResponse

router = APIRouter(prefix="/api/components", tags=["components"])

# ============================================
# GET COMPONENTS
# ============================================

@router.get("/", response_model=List[ComponentResponse])
def get_components(
    category: Optional[str] = None,
    manufacturer_id: Optional[int] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    in_stock_only: bool = False,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get components with filters
    - category: Filter by component category (motor, contactor, etc.)
    - manufacturer_id: Filter by manufacturer
    - search: Search in part number, name, description
    - min_price, max_price: Price range filter
    - in_stock_only: Show only in-stock items
    """
    query = db.query(Component).filter(Component.is_active == True)
    
    if category:
        query = query.filter(Component.category == category)
    
    if manufacturer_id:
        query = query.filter(Component.manufacturer_id == manufacturer_id)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Component.part_number.ilike(search_filter)) |
            (Component.name.ilike(search_filter)) |
            (Component.description.ilike(search_filter))
        )
    
    if min_price is not None:
        query = query.filter(Component.base_price >= min_price)
    
    if max_price is not None:
        query = query.filter(Component.base_price <= max_price)
    
    if in_stock_only:
        query = query.filter(Component.stock_status == "In Stock")
    
    components = query.offset(skip).limit(limit).all()
    return [comp.to_dict(include_specs=True) for comp in components]

@router.get("/{component_id}", response_model=ComponentResponse)
def get_component(component_id: int, db: Session = Depends(get_db)):
    """Get single component with full specifications"""
    component = db.query(Component).filter(Component.id == component_id).first()
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")
    
    return component.to_dict(include_specs=True)

@router.get("/part/{part_number}", response_model=ComponentResponse)
def get_component_by_part(part_number: str, db: Session = Depends(get_db)):
    """Get component by manufacturer part number"""
    component = db.query(Component).filter(Component.part_number == part_number).first()
    if not component:
        raise HTTPException(status_code=404, detail=f"Part {part_number} not found")
    
    return component.to_dict(include_specs=True)

# ============================================
# MANUFACTURERS
# ============================================

@router.get("/manufacturers/", response_model=List[ManufacturerResponse])
def get_manufacturers(db: Session = Depends(get_db)):
    """Get all manufacturers"""
    manufacturers = db.query(Manufacturer).all()
    return [m.to_dict() for m in manufacturers]

# ============================================
# ALTERNATIVES & SUBSTITUTIONS
# ============================================

@router.get("/{component_id}/alternatives")
def get_component_alternatives(component_id: int, db: Session = Depends(get_db)):
    """Get alternative/compatible components"""
    alternatives = db.query(ComponentAlternative).filter(
        ComponentAlternative.component_id == component_id
    ).all()
    
    return [alt.to_dict() for alt in alternatives]

# ============================================
# PRICING
# ============================================

@router.get("/{component_id}/price-history")
def get_price_history(
    component_id: int,
    days: int = 30,
    db: Session = Depends(get_db)
):
    """Get price history for component"""
    from datetime import timedelta
    
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    history = db.query(PriceHistory).filter(
        PriceHistory.component_id == component_id,
        PriceHistory.recorded_at >= cutoff_date
    ).order_by(PriceHistory.recorded_at.desc()).all()
    
    return [h.to_dict() for h in history]

# ============================================
# BOM CALCULATION
# ============================================

@router.post("/calculate-bom")
def calculate_bom(component_ids: List[int], db: Session = Depends(get_db)):
    """
    Calculate Bill of Materials total cost
    Input: List of component IDs
    Output: Total price, breakdown by component
    """
    components = db.query(Component).filter(Component.id.in_(component_ids)).all()
    
    if not components:
        raise HTTPException(status_code=404, detail="No components found")
    
    bom = []
    total = 0.0
    
    for comp in components:
        price = comp.base_price or 0.0
        bom.append({
            "part_number": comp.part_number,
            "name": comp.name,
            "manufacturer": comp.manufacturer.name if comp.manufacturer else "Unknown",
            "price": price,
            "currency": comp.currency,
            "stock_status": comp.stock_status,
            "datasheet": comp.datasheet_url
        })
        total += price
    
    return {
        "items": bom,
        "total_cost": total,
        "currency": "USD",
        "item_count": len(bom)
    }

# ============================================
# ADMIN - ADD COMPONENTS
# ============================================

@router.post("/", response_model=ComponentResponse)
def create_component(component: ComponentCreate, db: Session = Depends(get_db)):
    """Add new component to library (admin only)"""
    
    # Check if part number already exists
    existing = db.query(Component).filter(Component.part_number == component.part_number).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Part {component.part_number} already exists")
    
    new_component = Component(**component.dict())
    db.add(new_component)
    db.commit()
    db.refresh(new_component)
    
    return new_component.to_dict(include_specs=True)
