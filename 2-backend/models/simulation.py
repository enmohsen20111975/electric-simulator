"""
Simulation Model - Simulation Results Storage
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON, Float, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Simulation(Base):
    __tablename__ = "simulations"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    circuit_id = Column(Integer, ForeignKey("circuits.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Simulation parameters
    simulation_type = Column(String(50))  # DC, AC, Transient, etc.
    duration = Column(Float)  # Simulation duration in seconds
    time_step = Column(Float)  # Time step for transient analysis
    
    # Results stored as JSON
    results = Column(JSON)  # Voltage, current, power data
    component_states = Column(JSON)  # Component-specific states
    wire_states = Column(JSON)  # Wire current/voltage data
    
    # Metadata
    status = Column(String(20), default="completed")  # pending, running, completed, failed
    error_message = Column(Text)
    execution_time = Column(Float)  # Time taken to run simulation
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)

    # Relationships
    circuit = relationship("Circuit", back_populates="simulations")

    def to_dict(self):
        return {
            "id": self.id,
            "circuit_id": self.circuit_id,
            "user_id": self.user_id,
            "simulation_type": self.simulation_type,
            "duration": self.duration,
            "time_step": self.time_step,
            "results": self.results,
            "component_states": self.component_states,
            "wire_states": self.wire_states,
            "status": self.status,
            "error_message": self.error_message,
            "execution_time": self.execution_time,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None
        }


class ComponentLibrary(Base):
    __tablename__ = "component_library"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    type = Column(String(50), nullable=False)
    manufacturer = Column(String(100))
    part_number = Column(String(100))
    
    # Component specifications
    specifications = Column(JSON)
    datasheet_url = Column(String(500))
    image_url = Column(String(500))
    
    # Default properties for simulation
    default_properties = Column(JSON)
    
    # Metadata
    is_verified = Column(Boolean, default=False)
    is_custom = Column(Boolean, default=False)
    created_by = Column(Integer, ForeignKey("users.id"))
    downloads = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "type": self.type,
            "manufacturer": self.manufacturer,
            "part_number": self.part_number,
            "specifications": self.specifications,
            "datasheet_url": self.datasheet_url,
            "image_url": self.image_url,
            "default_properties": self.default_properties,
            "is_verified": self.is_verified,
            "is_custom": self.is_custom,
            "created_by": self.created_by,
            "downloads": self.downloads,
            "rating": self.rating,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
