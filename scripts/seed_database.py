"""
Database Seed Script
Populate database with initial component library and example circuits
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal, engine, Base
from models.simulation import ComponentLibrary
from models.user import User
from models.circuit import Circuit
from datetime import datetime
import bcrypt


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def seed_component_library(db):
    """Seed component library with common electronic components"""
    
    components = [
        # Resistors
        {
            "name": "Carbon Film Resistor 1/4W",
            "category": "Passive",
            "type": "resistor",
            "specifications": {"power": 0.25, "tolerance": 5, "temperature_coefficient": 100},
            "default_properties": {"resistance": 1000, "power": 0.25}
        },
        {
            "name": "Metal Film Resistor 1/2W",
            "category": "Passive",
            "type": "resistor",
            "specifications": {"power": 0.5, "tolerance": 1, "temperature_coefficient": 50},
            "default_properties": {"resistance": 10000, "power": 0.5}
        },
        # Capacitors
        {
            "name": "Ceramic Capacitor",
            "category": "Passive",
            "type": "capacitor",
            "specifications": {"voltage": 50, "tolerance": 10, "dielectric": "ceramic"},
            "default_properties": {"capacitance": 0.0001, "voltage": 50}
        },
        {
            "name": "Electrolytic Capacitor",
            "category": "Passive",
            "type": "capacitor",
            "specifications": {"voltage": 25, "tolerance": 20, "polarity": "polarized"},
            "default_properties": {"capacitance": 0.001, "voltage": 25}
        },
        # Inductors
        {
            "name": "Axial Inductor",
            "category": "Passive",
            "type": "inductor",
            "specifications": {"current": 1.0, "resistance": 0.5},
            "default_properties": {"inductance": 0.001, "resistance": 0.5}
        },
        # Diodes
        {
            "name": "1N4148 Signal Diode",
            "category": "Semiconductors",
            "type": "diode",
            "manufacturer": "Various",
            "part_number": "1N4148",
            "specifications": {"forward_voltage": 0.7, "max_current": 0.3, "reverse_voltage": 100},
            "default_properties": {"forwardVoltage": 0.7}
        },
        {
            "name": "1N4007 Rectifier Diode",
            "category": "Semiconductors",
            "type": "diode",
            "manufacturer": "Various",
            "part_number": "1N4007",
            "specifications": {"forward_voltage": 0.7, "max_current": 1.0, "reverse_voltage": 1000},
            "default_properties": {"forwardVoltage": 0.7}
        },
        # LEDs
        {
            "name": "Red LED 5mm",
            "category": "Semiconductors",
            "type": "led",
            "specifications": {"forward_voltage": 2.0, "max_current": 0.02, "color": "red"},
            "default_properties": {"forwardVoltage": 2.0, "color": "#ff0000"}
        },
        {
            "name": "Blue LED 5mm",
            "category": "Semiconductors",
            "type": "led",
            "specifications": {"forward_voltage": 3.2, "max_current": 0.02, "color": "blue"},
            "default_properties": {"forwardVoltage": 3.2, "color": "#0000ff"}
        },
        # Transistors
        {
            "name": "2N2222 NPN Transistor",
            "category": "Semiconductors",
            "type": "transistor",
            "manufacturer": "Various",
            "part_number": "2N2222",
            "specifications": {"type": "NPN", "max_current": 0.8, "max_voltage": 40, "hfe": 100},
            "default_properties": {"type": "npn", "gain": 100}
        },
        # Power Sources
        {
            "name": "9V Battery",
            "category": "Power",
            "type": "battery",
            "specifications": {"voltage": 9, "capacity": 500},
            "default_properties": {"voltage": 9}
        },
    ]
    
    for comp_data in components:
        component = ComponentLibrary(
            name=comp_data["name"],
            category=comp_data["category"],
            type=comp_data["type"],
            manufacturer=comp_data.get("manufacturer"),
            part_number=comp_data.get("part_number"),
            specifications=comp_data["specifications"],
            default_properties=comp_data["default_properties"],
            is_verified=True,
            is_custom=False,
            rating=4.5
        )
        db.add(component)
    
    print("✓ Component library seeded")


def seed_demo_user(db):
    """Create demo user account"""
    
    demo_user = User(
        username="demo",
        email="demo@circuit-simulator.com",
        password_hash=hash_password("demo123"),
        full_name="Demo User",
        is_active=True,
        is_verified=True
    )
    
    db.add(demo_user)
    db.commit()
    db.refresh(demo_user)
    
    print("✓ Demo user created (username: demo, password: demo123)")
    
    return demo_user


def seed_example_circuits(db, user):
    """Create example circuits"""
    
    circuits = [
        {
            "name": "Simple LED Circuit",
            "description": "Basic LED with current-limiting resistor",
            "category": "Basic",
            "is_public": True,
            "is_template": True,
            "tags": ["led", "basic", "beginner"],
            "components": [
                {"id": 1, "type": "battery", "x": 100, "y": 100, "props": {"voltage": 9}},
                {"id": 2, "type": "resistor", "x": 200, "y": 100, "props": {"resistance": 470}},
                {"id": 3, "type": "led", "x": 300, "y": 100, "props": {"forwardVoltage": 2.0, "color": "#ff0000"}},
                {"id": 4, "type": "ground", "x": 100, "y": 200}
            ],
            "wires": [
                {"from": {"comp": 1, "terminal": 0}, "to": {"comp": 2, "terminal": 0}},
                {"from": {"comp": 2, "terminal": 1}, "to": {"comp": 3, "terminal": 0}},
                {"from": {"comp": 3, "terminal": 1}, "to": {"comp": 4, "terminal": 0}},
                {"from": {"comp": 1, "terminal": 1}, "to": {"comp": 4, "terminal": 0}}
            ]
        },
        {
            "name": "Voltage Divider",
            "description": "Two resistors in series for voltage division",
            "category": "Basic",
            "is_public": True,
            "is_template": True,
            "tags": ["resistor", "voltage", "divider"],
            "components": [
                {"id": 1, "type": "battery", "x": 100, "y": 100, "props": {"voltage": 12}},
                {"id": 2, "type": "resistor", "x": 200, "y": 100, "props": {"resistance": 1000}},
                {"id": 3, "type": "resistor", "x": 200, "y": 200, "props": {"resistance": 1000}},
                {"id": 4, "type": "ground", "x": 100, "y": 300}
            ],
            "wires": [
                {"from": {"comp": 1, "terminal": 0}, "to": {"comp": 2, "terminal": 0}},
                {"from": {"comp": 2, "terminal": 1}, "to": {"comp": 3, "terminal": 0}},
                {"from": {"comp": 3, "terminal": 1}, "to": {"comp": 4, "terminal": 0}},
                {"from": {"comp": 1, "terminal": 1}, "to": {"comp": 4, "terminal": 0}}
            ]
        }
    ]
    
    for circuit_data in circuits:
        circuit = Circuit(
            name=circuit_data["name"],
            description=circuit_data["description"],
            owner_id=user.id,
            category=circuit_data["category"],
            is_public=circuit_data["is_public"],
            is_template=circuit_data["is_template"],
            tags=circuit_data["tags"],
            components=circuit_data["components"],
            wires=circuit_data["wires"],
            settings={"zoom": 1.0, "pan": {"x": 0, "y": 0}}
        )
        db.add(circuit)
    
    print("✓ Example circuits created")


def main():
    """Main seed function"""
    
    print("Starting database seed...")
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created")
    
    # Create session
    db = SessionLocal()
    
    try:
        # Seed component library
        seed_component_library(db)
        
        # Create demo user
        demo_user = seed_demo_user(db)
        
        # Seed example circuits
        seed_example_circuits(db, demo_user)
        
        db.commit()
        print("\n✓ Database seeding completed successfully!")
        print("\nYou can now login with:")
        print("  Username: demo")
        print("  Password: demo123")
        
    except Exception as e:
        print(f"\n✗ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
