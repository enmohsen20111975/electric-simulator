"""
Circuit Model - Circuit Storage and Management
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Circuit(Base):
    __tablename__ = "circuits"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_public = Column(Boolean, default=False)
    is_template = Column(Boolean, default=False)
    category = Column(String(50))
    tags = Column(JSON)  # List of tags
    
    # Circuit data stored as JSON
    components = Column(JSON)  # List of components
    wires = Column(JSON)  # List of wire connections
    settings = Column(JSON)  # Circuit settings (zoom, pan, etc.)
    
    # Metadata
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    fork_count = Column(Integer, default=0)
    forked_from = Column(Integer, ForeignKey("circuits.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_simulated = Column(DateTime)

    # Relationships
    owner = relationship("User", back_populates="circuits")
    shared_with = relationship("CircuitShare", back_populates="circuit", cascade="all, delete-orphan")
    simulations = relationship("Simulation", back_populates="circuit", cascade="all, delete-orphan")

    def to_dict(self, include_data=False):
        result = {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "owner_id": self.owner_id,
            "is_public": self.is_public,
            "is_template": self.is_template,
            "category": self.category,
            "tags": self.tags,
            "views": self.views,
            "likes": self.likes,
            "fork_count": self.fork_count,
            "forked_from": self.forked_from,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "last_simulated": self.last_simulated.isoformat() if self.last_simulated else None
        }
        
        if include_data:
            result.update({
                "components": self.components or [],
                "wires": self.wires or [],
                "settings": self.settings or {}
            })
        
        return result


class CircuitShare(Base):
    __tablename__ = "circuit_shares"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    circuit_id = Column(Integer, ForeignKey("circuits.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    permission = Column(String(20), default="view")  # view, edit, admin
    shared_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    circuit = relationship("Circuit", back_populates="shared_with")
    user = relationship("User", back_populates="shared_circuits")

    def to_dict(self):
        return {
            "id": self.id,
            "circuit_id": self.circuit_id,
            "user_id": self.user_id,
            "permission": self.permission,
            "shared_at": self.shared_at.isoformat() if self.shared_at else None
        }
