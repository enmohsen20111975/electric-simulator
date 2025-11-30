"""
Circuit Routes
CRUD operations for circuits
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database import get_db
from models.circuit import Circuit, CircuitShare
from models.user import User
from schemas.circuit import CircuitCreate, CircuitUpdate, CircuitResponse, CircuitListResponse
from middleware.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=CircuitResponse, status_code=status.HTTP_201_CREATED)
async def create_circuit(
    circuit_data: CircuitCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new circuit"""
    
    new_circuit = Circuit(
        name=circuit_data.name,
        description=circuit_data.description,
        owner_id=current_user.id,
        is_public=circuit_data.is_public,
        category=circuit_data.category,
        tags=circuit_data.tags,
        components=circuit_data.components,
        wires=circuit_data.wires,
        settings=circuit_data.settings
    )
    
    db.add(new_circuit)
    db.commit()
    db.refresh(new_circuit)
    
    return new_circuit.to_dict(include_data=True)


@router.get("/", response_model=List[CircuitListResponse])
async def get_circuits(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    category: Optional[str] = None,
    is_public: Optional[bool] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get list of circuits"""
    
    query = db.query(Circuit)
    
    # Filter by ownership or public circuits
    if is_public is True:
        query = query.filter(Circuit.is_public == True)
    else:
        query = query.filter(
            (Circuit.owner_id == current_user.id) | (Circuit.is_public == True)
        )
    
    # Search filter
    if search:
        query = query.filter(
            (Circuit.name.ilike(f"%{search}%")) | 
            (Circuit.description.ilike(f"%{search}%"))
        )
    
    # Category filter
    if category:
        query = query.filter(Circuit.category == category)
    
    # Order by updated_at descending
    query = query.order_by(Circuit.updated_at.desc())
    
    circuits = query.offset(skip).limit(limit).all()
    
    return [circuit.to_dict(include_data=False) for circuit in circuits]


@router.get("/{circuit_id}", response_model=CircuitResponse)
async def get_circuit(
    circuit_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific circuit by ID"""
    
    circuit = db.query(Circuit).filter(Circuit.id == circuit_id).first()
    
    if not circuit:
        raise HTTPException(status_code=404, detail="Circuit not found")
    
    # Check permissions
    if circuit.owner_id != current_user.id and not circuit.is_public:
        # Check if shared with user
        share = db.query(CircuitShare).filter(
            CircuitShare.circuit_id == circuit_id,
            CircuitShare.user_id == current_user.id
        ).first()
        
        if not share:
            raise HTTPException(status_code=403, detail="Access denied")
    
    # Increment view count
    circuit.views += 1
    db.commit()
    
    return circuit.to_dict(include_data=True)


@router.put("/{circuit_id}", response_model=CircuitResponse)
async def update_circuit(
    circuit_id: int,
    circuit_data: CircuitUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a circuit"""
    
    circuit = db.query(Circuit).filter(Circuit.id == circuit_id).first()
    
    if not circuit:
        raise HTTPException(status_code=404, detail="Circuit not found")
    
    # Check permissions
    if circuit.owner_id != current_user.id:
        share = db.query(CircuitShare).filter(
            CircuitShare.circuit_id == circuit_id,
            CircuitShare.user_id == current_user.id,
            CircuitShare.permission.in_(["edit", "admin"])
        ).first()
        
        if not share:
            raise HTTPException(status_code=403, detail="Permission denied")
    
    # Update fields
    if circuit_data.name is not None:
        circuit.name = circuit_data.name
    if circuit_data.description is not None:
        circuit.description = circuit_data.description
    if circuit_data.is_public is not None:
        circuit.is_public = circuit_data.is_public
    if circuit_data.category is not None:
        circuit.category = circuit_data.category
    if circuit_data.tags is not None:
        circuit.tags = circuit_data.tags
    if circuit_data.components is not None:
        circuit.components = circuit_data.components
    if circuit_data.wires is not None:
        circuit.wires = circuit_data.wires
    if circuit_data.settings is not None:
        circuit.settings = circuit_data.settings
    
    circuit.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(circuit)
    
    return circuit.to_dict(include_data=True)


@router.delete("/{circuit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_circuit(
    circuit_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a circuit"""
    
    circuit = db.query(Circuit).filter(Circuit.id == circuit_id).first()
    
    if not circuit:
        raise HTTPException(status_code=404, detail="Circuit not found")
    
    if circuit.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permission denied")
    
    db.delete(circuit)
    db.commit()
    
    return None


@router.post("/{circuit_id}/fork", response_model=CircuitResponse)
async def fork_circuit(
    circuit_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fork (duplicate) a circuit"""
    
    original = db.query(Circuit).filter(Circuit.id == circuit_id).first()
    
    if not original:
        raise HTTPException(status_code=404, detail="Circuit not found")
    
    if not original.is_public and original.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Cannot fork private circuit")
    
    # Create fork
    forked_circuit = Circuit(
        name=f"{original.name} (Fork)",
        description=original.description,
        owner_id=current_user.id,
        is_public=False,
        category=original.category,
        tags=original.tags,
        components=original.components,
        wires=original.wires,
        settings=original.settings,
        forked_from=original.id
    )
    
    db.add(forked_circuit)
    
    # Increment fork count
    original.fork_count += 1
    
    db.commit()
    db.refresh(forked_circuit)
    
    return forked_circuit.to_dict(include_data=True)


@router.post("/{circuit_id}/share")
async def share_circuit(
    circuit_id: int,
    user_id: int,
    permission: str = "view",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Share circuit with another user"""
    
    circuit = db.query(Circuit).filter(Circuit.id == circuit_id).first()
    
    if not circuit:
        raise HTTPException(status_code=404, detail="Circuit not found")
    
    if circuit.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permission denied")
    
    # Check if already shared
    existing_share = db.query(CircuitShare).filter(
        CircuitShare.circuit_id == circuit_id,
        CircuitShare.user_id == user_id
    ).first()
    
    if existing_share:
        existing_share.permission = permission
    else:
        share = CircuitShare(
            circuit_id=circuit_id,
            user_id=user_id,
            permission=permission
        )
        db.add(share)
    
    db.commit()
    
    return {"message": "Circuit shared successfully"}


@router.get("/{circuit_id}/like", status_code=status.HTTP_200_OK)
async def like_circuit(
    circuit_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Like a circuit"""
    
    circuit = db.query(Circuit).filter(Circuit.id == circuit_id).first()
    
    if not circuit:
        raise HTTPException(status_code=404, detail="Circuit not found")
    
    circuit.likes += 1
    db.commit()
    
    return {"likes": circuit.likes}
