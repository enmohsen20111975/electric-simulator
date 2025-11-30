"""
Seed Component Library Database
Populate with real industrial components from major manufacturers
"""

import sys
sys.path.append('..')

from sqlalchemy.orm import Session
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import engine, SessionLocal, Base
from models.component_library import Manufacturer, Component, ComponentAlternative

# Create all tables
Base.metadata.create_all(bind=engine)

def seed_manufacturers(db: Session):
    """Add major industrial manufacturers"""
    manufacturers = [
        {
            "name": "Siemens",
            "country": "Germany",
            "website": "https://www.siemens.com",
            "api_endpoint": "https://mall.industry.siemens.com/api",
            "logo_url": "https://www.siemens.com/logo.svg"
        },
        {
            "name": "ABB",
            "country": "Switzerland",
            "website": "https://new.abb.com",
            "api_endpoint": "https://new.abb.com/products/api",
            "logo_url": "https://new.abb.com/logo.svg"
        },
        {
            "name": "Schneider Electric",
            "country": "France",
            "website": "https://www.se.com",
            "api_endpoint": "https://exchange.se.com/api",
            "logo_url": "https://www.se.com/logo.svg"
        },
        {
            "name": "Omron",
            "country": "Japan",
            "website": "https://www.omron.com",
            "api_endpoint": "https://industrial.omron.com/api",
            "logo_url": "https://www.omron.com/logo.svg"
        },
        {
            "name": "Allen-Bradley (Rockwell)",
            "country": "USA",
            "website": "https://www.rockwellautomation.com",
            "api_endpoint": "https://www.rockwellautomation.com/api",
            "logo_url": "https://www.rockwellautomation.com/logo.svg"
        },
        {
            "name": "Eaton",
            "country": "Ireland/USA",
            "website": "https://www.eaton.com",
            "api_endpoint": "https://www.eaton.com/api",
            "logo_url": "https://www.eaton.com/logo.svg"
        }
    ]
    
    for mfg_data in manufacturers:
        existing = db.query(Manufacturer).filter(Manufacturer.name == mfg_data["name"]).first()
        if not existing:
            mfg = Manufacturer(**mfg_data)
            db.add(mfg)
    
    db.commit()
    print(f"✓ Added {len(manufacturers)} manufacturers")

def seed_siemens_components(db: Session):
    """Add Siemens SIRIUS components"""
    siemens = db.query(Manufacturer).filter(Manufacturer.name == "Siemens").first()
    
    components = [
        # 3-Pole Contactors
        {
            "part_number": "3RT2015-1BB41",
            "name": "SIRIUS 3RT2 Contactor 7A 3-Pole",
            "description": "Power contactor, AC-3 7 A, 3 kW / 400 V 1 NC, 24 V DC, Screw terminal",
            "category": "contactor",
            "subcategory": "3-pole",
            "manufacturer_id": siemens.id,
            "series": "SIRIUS 3RT2",
            "electrical_specs": {
                "rated_current": 7,
                "voltage_ac3": 400,
                "power_ac3": 3,
                "coil_voltage": 24,
                "coil_type": "DC",
                "poles": 3,
                "aux_contacts": "1NC"
            },
            "mechanical_specs": {
                "width_mm": 45,
                "height_mm": 63,
                "depth_mm": 74,
                "weight_kg": 0.22,
                "mounting": "Screw/DIN Rail"
            },
            "environmental_specs": {
                "ip_rating": "IP20",
                "temp_min": -25,
                "temp_max": 60
            },
            "certification": {
                "ce": True,
                "ul": "UL 508",
                "iec": "IEC 60947-4-1"
            },
            "base_price": 28.50,
            "stock_status": "In Stock",
            "datasheet_url": "https://cache.industry.siemens.com/dl/files/3RT2015-1BB41.pdf"
        },
        {
            "part_number": "3RT2023-1BB40",
            "name": "SIRIUS 3RT2 Contactor 9A 3-Pole",
            "description": "Power contactor, AC-3 9 A, 4 kW / 400 V 1 NO, 24 V DC",
            "category": "contactor",
            "subcategory": "3-pole",
            "manufacturer_id": siemens.id,
            "series": "SIRIUS 3RT2",
            "electrical_specs": {
                "rated_current": 9,
                "voltage_ac3": 400,
                "power_ac3": 4,
                "coil_voltage": 24,
                "coil_type": "DC",
                "poles": 3,
                "aux_contacts": "1NO"
            },
            "base_price": 32.75,
            "stock_status": "In Stock",
            "datasheet_url": "https://cache.industry.siemens.com/dl/files/3RT2023-1BB40.pdf"
        },
        # Motors
        {
            "part_number": "1LE1001-1CB23-4AA4",
            "name": "SIMOTICS GP Motor 3kW 4-Pole",
            "description": "Low-voltage motor, IEC squirrel-cage motor, 3 kW, 4-pole, 1500 rpm, Frame 100",
            "category": "motor",
            "subcategory": "3-phase-ac",
            "manufacturer_id": siemens.id,
            "series": "SIMOTICS GP",
            "electrical_specs": {
                "power_kw": 3,
                "voltage": 400,
                "current": 6.8,
                "frequency": 50,
                "poles": 4,
                "rpm": 1440,
                "efficiency": 89.1,
                "power_factor": 0.81
            },
            "mechanical_specs": {
                "frame": "100L",
                "mounting": "B3 foot",
                "weight_kg": 24
            },
            "environmental_specs": {
                "ip_rating": "IP55",
                "temp_ambient_max": 40
            },
            "base_price": 485.00,
            "stock_status": "In Stock",
            "datasheet_url": "https://cache.industry.siemens.com/dl/files/1LE1001-1CB23-4AA4.pdf"
        },
        # Circuit Breakers
        {
            "part_number": "5SL6310-7",
            "name": "5SL6 MCB 10A 1-Pole C-Curve",
            "description": "Miniature circuit breaker 230/400 V 10kA, 1-pole, C, 10A",
            "category": "circuit_breaker",
            "subcategory": "mcb",
            "manufacturer_id": siemens.id,
            "series": "5SL6",
            "electrical_specs": {
                "rated_current": 10,
                "poles": 1,
                "trip_curve": "C",
                "breaking_capacity": 10000,
                "voltage": 230
            },
            "base_price": 8.90,
            "stock_status": "In Stock"
        }
    ]
    
    for comp_data in components:
        existing = db.query(Component).filter(Component.part_number == comp_data["part_number"]).first()
        if not existing:
            comp = Component(**comp_data)
            db.add(comp)
    
    db.commit()
    print(f"✓ Added Siemens components")

def seed_abb_components(db: Session):
    """Add ABB components"""
    abb = db.query(Manufacturer).filter(Manufacturer.name == "ABB").first()
    
    components = [
        {
            "part_number": "AF09-30-10-13",
            "name": "ABB AF Contactor 9A 3-Pole",
            "description": "Contactor, 3-pole, 100-250 V AC/DC operated, 9 A, 4 kW",
            "category": "contactor",
            "subcategory": "3-pole",
            "manufacturer_id": abb.id,
            "series": "AF",
            "electrical_specs": {
                "rated_current": 9,
                "voltage_ac3": 400,
                "power_ac3": 4,
                "coil_voltage_min": 100,
                "coil_voltage_max": 250,
                "poles": 3
            },
            "base_price": 45.20,
            "stock_status": "In Stock",
            "datasheet_url": "https://library.abb.com/AF09-30-10-13.pdf"
        },
        {
            "part_number": "M2BAX 100LA 2",
            "name": "ABB M2BAX Motor 3kW 2-Pole",
            "description": "Cast iron motor, IE3 efficiency, 3 kW, 2-pole, 400V 50Hz",
            "category": "motor",
            "subcategory": "3-phase-ac",
            "manufacturer_id": abb.id,
            "series": "M2BAX",
            "electrical_specs": {
                "power_kw": 3,
                "voltage": 400,
                "frequency": 50,
                "poles": 2,
                "rpm": 2880,
                "efficiency": 91.7
            },
            "base_price": 520.00,
            "stock_status": "In Stock"
        }
    ]
    
    for comp_data in components:
        existing = db.query(Component).filter(Component.part_number == comp_data["part_number"]).first()
        if not existing:
            comp = Component(**comp_data)
            db.add(comp)
    
    db.commit()
    print(f"✓ Added ABB components")

def seed_schneider_components(db: Session):
    """Add Schneider Electric components"""
    schneider = db.query(Manufacturer).filter(Manufacturer.name == "Schneider Electric").first()
    
    components = [
        {
            "part_number": "LC1D09BD",
            "name": "TeSys D Contactor 9A 3-Pole",
            "description": "Contactor, TeSys D, 3P(3 NO), AC-3, <= 440 V 9A, 24 V DC coil",
            "category": "contactor",
            "subcategory": "3-pole",
            "manufacturer_id": schneider.id,
            "series": "TeSys D",
            "electrical_specs": {
                "rated_current": 9,
                "voltage_ac3": 440,
                "power_ac3": 4,
                "coil_voltage": 24,
                "poles": 3
            },
            "base_price": 38.50,
            "stock_status": "In Stock",
            "datasheet_url": "https://www.se.com/LC1D09BD.pdf"
        }
    ]
    
    for comp_data in components:
        existing = db.query(Component).filter(Component.part_number == comp_data["part_number"]).first()
        if not existing:
            comp = Component(**comp_data)
            db.add(comp)
    
    db.commit()
    print(f"✓ Added Schneider Electric components")

def main():
    """Run all seed functions"""
    db = SessionLocal()
    
    try:
        print("🌱 Seeding component library database...")
        seed_manufacturers(db)
        seed_siemens_components(db)
        seed_abb_components(db)
        seed_schneider_components(db)
        print("✅ Database seeded successfully!")
        
        # Print summary
        total_components = db.query(Component).count()
        total_manufacturers = db.query(Manufacturer).count()
        print(f"\n📊 Summary:")
        print(f"  Manufacturers: {total_manufacturers}")
        print(f"  Components: {total_components}")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
