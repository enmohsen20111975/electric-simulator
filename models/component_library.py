"""
Component Library Models - Industrial Components Database
Manufacturers: Siemens, ABB, Schneider Electric, Omron, Allen-Bradley, Eaton
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
import enum

class ComponentCategory(str, enum.Enum):
    MOTOR = "motor"
    CONTACTOR = "contactor"
    RELAY = "relay"
    CIRCUIT_BREAKER = "circuit_breaker"
    FUSE = "fuse"
    OVERLOAD_RELAY = "overload_relay"
    PUSHBUTTON = "pushbutton"
    SELECTOR_SWITCH = "selector_switch"
    EMERGENCY_STOP = "emergency_stop"
    VFD = "vfd"
    SOFT_STARTER = "soft_starter"
    TRANSFORMER = "transformer"
    PLC = "plc"
    SENSOR = "sensor"
    INDICATOR = "indicator"
    RESISTOR = "resistor"
    CAPACITOR = "capacitor"
    INDUCTOR = "inductor"
    DIODE = "diode"
    TRANSISTOR = "transistor"
    IC = "integrated_circuit"

class Manufacturer(Base):
    __tablename__ = "manufacturers"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)  # Siemens, ABB, etc.
    country = Column(String(50))
    website = Column(String(200))
    api_endpoint = Column(String(200))  # For fetching live data
    api_key_required = Column(Boolean, default=False)
    logo_url = Column(String(300))
    
    # Relationships
    components = relationship("Component", back_populates="manufacturer")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "country": self.country,
            "website": self.website,
            "logo_url": self.logo_url
        }

class Component(Base):
    __tablename__ = "components"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)    # Basic Info
    part_number = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    category = Column(String(50), nullable=False, index=True)
    subcategory = Column(String(50))
    
    # Manufacturer
    manufacturer_id = Column(Integer, ForeignKey("manufacturers.id"), nullable=False)
    series = Column(String(100))  # Product series (e.g., SIRIUS 3RT)
    
    # Electrical Specifications (JSON for flexibility)
    electrical_specs = Column(JSON)  # voltage, current, power, frequency, phases, etc.
    mechanical_specs = Column(JSON)  # dimensions, weight, mounting, etc.
    environmental_specs = Column(JSON)  # IP rating, temperature, humidity, etc.
    certification = Column(JSON)  # UL, CE, IEC standards
    
    # Symbol & Drawing
    symbol_type = Column(String(50))  # IEEE, IEC, ANSI
    svg_symbol = Column(Text)  # SVG path for drawing
    canvas_width = Column(Integer, default=80)
    canvas_height = Column(Integer, default=80)
    ports_definition = Column(JSON)  # Port positions and labels
    
    # Pricing & Availability
    base_price = Column(Float)  # USD
    currency = Column(String(3), default="USD")
    lead_time_days = Column(Integer)  # Delivery time
    stock_status = Column(String(20))  # In Stock, Low Stock, Out of Stock
    min_order_quantity = Column(Integer, default=1)
    
    # Documentation
    datasheet_url = Column(String(300))
    manual_url = Column(String(300))
    cad_model_url = Column(String(300))
    
    # API Integration
    external_id = Column(String(100))  # ID in manufacturer's system
    last_price_update = Column(DateTime)
    last_stock_update = Column(DateTime)
    
    # Metadata
    is_active = Column(Boolean, default=True)
    is_discontinued = Column(Boolean, default=False)
    replacement_part_id = Column(Integer, ForeignKey("components.id"), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    manufacturer = relationship("Manufacturer", back_populates="components")
    replacement_part = relationship("Component", remote_side=[id])
    alternatives = relationship("ComponentAlternative", foreign_keys="ComponentAlternative.component_id", back_populates="component")
    
    def to_dict(self, include_specs=True):
        result = {
            "id": self.id,
            "part_number": self.part_number,
            "name": self.name,
            "description": self.description,
            "category": self.category,
            "subcategory": self.subcategory,
            "manufacturer": self.manufacturer.to_dict() if self.manufacturer else None,
            "series": self.series,
            "base_price": self.base_price,
            "currency": self.currency,
            "stock_status": self.stock_status,
            "datasheet_url": self.datasheet_url,
            "is_active": self.is_active,
            "is_discontinued": self.is_discontinued
        }
        
        if include_specs:
            result.update({
                "electrical_specs": self.electrical_specs or {},
                "mechanical_specs": self.mechanical_specs or {},
                "environmental_specs": self.environmental_specs or {},
                "certification": self.certification or {},
                "ports_definition": self.ports_definition or []
            })
        
        return result

class ComponentAlternative(Base):
    __tablename__ = "component_alternatives"
    
    id = Column(Integer, primary_key=True, index=True)
    component_id = Column(Integer, ForeignKey("components.id"), nullable=False)
    alternative_id = Column(Integer, ForeignKey("components.id"), nullable=False)
    compatibility_score = Column(Float)  # 0.0 to 1.0
    notes = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    component = relationship("Component", foreign_keys=[component_id], back_populates="alternatives")
    alternative = relationship("Component", foreign_keys=[alternative_id])
    
    def to_dict(self):
        return {
            "id": self.id,
            "component_id": self.component_id,
            "alternative": self.alternative.to_dict(include_specs=False) if self.alternative else None,
            "compatibility_score": self.compatibility_score,
            "notes": self.notes
        }

class PriceHistory(Base):
    __tablename__ = "price_history"
    
    id = Column(Integer, primary_key=True, index=True)
    component_id = Column(Integer, ForeignKey("components.id"), nullable=False)
    price = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    source = Column(String(100))  # DigiKey, Mouser, Manufacturer
    recorded_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    component = relationship("Component")
    
    def to_dict(self):
        return {
            "price": self.price,
            "currency": self.currency,
            "source": self.source,
            "recorded_at": self.recorded_at.isoformat()
        }
