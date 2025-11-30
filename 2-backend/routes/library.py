"""
Component Library Routes
Browse and manage component library
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models.simulation import ComponentLibrary
from models.user import User
from schemas.library import ComponentCreate, ComponentResponse
from middleware.auth import get_current_user, get_current_user_optional

router = APIRouter()


@router.get("/", response_model=List[ComponentResponse])
async def get_components(
    category: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get component library"""
    
    query = db.query(ComponentLibrary)
    
    if category:
        query = query.filter(ComponentLibrary.category == category)
    
    if search:
        query = query.filter(
            (ComponentLibrary.name.ilike(f"%{search}%")) |
            (ComponentLibrary.manufacturer.ilike(f"%{search}%")) |
            (ComponentLibrary.part_number.ilike(f"%{search}%"))
        )
    
    components = query.order_by(ComponentLibrary.rating.desc()).offset(skip).limit(limit).all()
    
    return [comp.to_dict() for comp in components]


@router.get("/{component_id}", response_model=ComponentResponse)
async def get_component(
    component_id: int,
    db: Session = Depends(get_db)
):
    """Get specific component"""
    
    component = db.query(ComponentLibrary).filter(ComponentLibrary.id == component_id).first()
    
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")
    
    component.downloads += 1
    db.commit()
    
    return component.to_dict()


@router.get("/categories/list")
async def get_categories(db: Session = Depends(get_db)):
    """Get all component categories"""
    
    categories = db.query(ComponentLibrary.category).distinct().all()
    return [cat[0] for cat in categories]


@router.post("/", response_model=ComponentResponse)
async def create_component(
    component_data: ComponentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create custom component (requires authentication)"""
    
    component = ComponentLibrary(
        name=component_data.name,
        category=component_data.category,
        type=component_data.type,
        manufacturer=component_data.manufacturer,
        part_number=component_data.part_number,
        specifications=component_data.specifications,
        datasheet_url=component_data.datasheet_url,
        default_properties=component_data.default_properties,
        is_custom=True,
        created_by=current_user.id
    )
    
    db.add(component)
    db.commit()
    db.refresh(component)
    
    return component.to_dict()
