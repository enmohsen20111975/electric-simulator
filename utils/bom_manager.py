"""
Bill of Materials (BOM) Management System
Professional BOM creation, tracking, and export
Integrates with component pricing for cost analysis
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
from enum import Enum
import json
import csv
import io


class BOMItemStatus(Enum):
    """BOM item procurement status"""
    PENDING = "pending"
    ORDERED = "ordered"
    IN_STOCK = "in_stock"
    DISCONTINUED = "discontinued"
    SUBSTITUTE_NEEDED = "substitute_needed"


class BOMItem:
    """Individual component in Bill of Materials"""
    
    def __init__(
        self,
        reference_designator: str,
        mpn: str,
        manufacturer: str,
        description: str,
        quantity: int = 1,
        unit_price: float = 0.0,
        currency: str = "USD"
    ):
        self.reference_designator = reference_designator  # e.g., R1, C2, U3
        self.mpn = mpn  # Manufacturer Part Number
        self.manufacturer = manufacturer
        self.description = description
        self.quantity = quantity
        self.unit_price = unit_price
        self.currency = currency
        self.status = BOMItemStatus.PENDING
        
        # Additional metadata
        self.package = ""
        self.value = ""
        self.tolerance = ""
        self.notes = ""
        self.datasheet_url = ""
        self.supplier = ""
        self.supplier_sku = ""
        self.lead_time = ""
    
    def get_total_price(self) -> float:
        """Calculate total price for this item"""
        return self.unit_price * self.quantity
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "reference_designator": self.reference_designator,
            "mpn": self.mpn,
            "manufacturer": self.manufacturer,
            "description": self.description,
            "quantity": self.quantity,
            "unit_price": self.unit_price,
            "total_price": self.get_total_price(),
            "currency": self.currency,
            "status": self.status.value,
            "package": self.package,
            "value": self.value,
            "tolerance": self.tolerance,
            "notes": self.notes,
            "datasheet_url": self.datasheet_url,
            "supplier": self.supplier,
            "supplier_sku": self.supplier_sku,
            "lead_time": self.lead_time
        }


class BOM:
    """Bill of Materials manager"""
    
    def __init__(self, project_name: str, revision: str = "1.0"):
        self.project_name = project_name
        self.revision = revision
        self.created_date = datetime.now()
        self.modified_date = datetime.now()
        self.items: List[BOMItem] = []
        self.metadata = {
            "author": "",
            "company": "",
            "description": "",
            "notes": ""
        }
    
    def add_item(self, item: BOMItem):
        """Add component to BOM"""
        self.items.append(item)
        self.modified_date = datetime.now()
    
    def remove_item(self, reference_designator: str) -> bool:
        """Remove component from BOM"""
        for i, item in enumerate(self.items):
            if item.reference_designator == reference_designator:
                del self.items[i]
                self.modified_date = datetime.now()
                return True
        return False
    
    def find_item(self, reference_designator: str) -> Optional[BOMItem]:
        """Find component by reference designator"""
        for item in self.items:
            if item.reference_designator == reference_designator:
                return item
        return None
    
    def get_total_cost(self) -> float:
        """Calculate total BOM cost"""
        return sum(item.get_total_price() for item in self.items)
    
    def get_unique_parts(self) -> int:
        """Count unique part numbers"""
        unique_mpns = set(item.mpn for item in self.items)
        return len(unique_mpns)
    
    def get_consolidated_bom(self) -> List[Dict[str, Any]]:
        """
        Consolidate BOM by grouping identical parts
        Returns list with combined quantities
        """
        consolidated = {}
        
        for item in self.items:
            key = f"{item.mpn}_{item.manufacturer}"
            
            if key in consolidated:
                # Combine quantities and reference designators
                consolidated[key]["quantity"] += item.quantity
                consolidated[key]["reference_designators"].append(item.reference_designator)
            else:
                consolidated[key] = {
                    "mpn": item.mpn,
                    "manufacturer": item.manufacturer,
                    "description": item.description,
                    "quantity": item.quantity,
                    "unit_price": item.unit_price,
                    "total_price": item.get_total_price(),
                    "currency": item.currency,
                    "package": item.package,
                    "value": item.value,
                    "reference_designators": [item.reference_designator],
                    "supplier": item.supplier,
                    "supplier_sku": item.supplier_sku
                }
        
        # Update total prices
        for key, data in consolidated.items():
            data["total_price"] = data["unit_price"] * data["quantity"]
            data["ref_des"] = ", ".join(sorted(data["reference_designators"]))
        
        return list(consolidated.values())
    
    def get_items_by_category(self) -> Dict[str, List[BOMItem]]:
        """Group items by component category"""
        categories = {}
        
        for item in self.items:
            # Determine category from reference designator prefix
            prefix = ''.join(c for c in item.reference_designator if c.isalpha())
            
            category_map = {
                "R": "Resistors",
                "C": "Capacitors",
                "L": "Inductors",
                "D": "Diodes",
                "Q": "Transistors",
                "U": "Integrated Circuits",
                "J": "Connectors",
                "SW": "Switches",
                "LED": "LEDs",
                "F": "Fuses",
                "T": "Transformers",
                "X": "Crystals"
            }
            
            category = category_map.get(prefix, "Other")
            
            if category not in categories:
                categories[category] = []
            
            categories[category].append(item)
        
        return categories
    
    def export_to_csv(self) -> str:
        """Export BOM to CSV format"""
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Header
        writer.writerow([
            "Ref Des",
            "Quantity",
            "Manufacturer",
            "MPN",
            "Description",
            "Value",
            "Package",
            "Unit Price",
            "Total Price",
            "Currency",
            "Supplier",
            "Supplier SKU",
            "Status"
        ])
        
        # Consolidated items
        consolidated = self.get_consolidated_bom()
        
        for item in sorted(consolidated, key=lambda x: x["ref_des"]):
            writer.writerow([
                item["ref_des"],
                item["quantity"],
                item["manufacturer"],
                item["mpn"],
                item["description"],
                item["value"],
                item["package"],
                f"{item['unit_price']:.4f}",
                f"{item['total_price']:.2f}",
                item["currency"],
                item["supplier"],
                item["supplier_sku"],
                "Pending"
            ])
        
        # Summary
        writer.writerow([])
        writer.writerow(["Total Unique Parts", self.get_unique_parts()])
        writer.writerow(["Total Cost", f"{self.get_total_cost():.2f}", self.items[0].currency if self.items else "USD"])
        
        return output.getvalue()
    
    def export_to_json(self) -> str:
        """Export BOM to JSON format"""
        data = {
            "project_name": self.project_name,
            "revision": self.revision,
            "created_date": self.created_date.isoformat(),
            "modified_date": self.modified_date.isoformat(),
            "metadata": self.metadata,
            "items": [item.to_dict() for item in self.items],
            "consolidated_items": self.get_consolidated_bom(),
            "summary": {
                "total_items": len(self.items),
                "unique_parts": self.get_unique_parts(),
                "total_cost": self.get_total_cost(),
                "currency": self.items[0].currency if self.items else "USD"
            }
        }
        
        return json.dumps(data, indent=2)
    
    def export_to_excel_compatible(self) -> List[List[Any]]:
        """
        Export BOM to 2D array format compatible with Excel/OpenPyXL
        Returns list of rows
        """
        rows = []
        
        # Title row
        rows.append([f"Bill of Materials - {self.project_name}"])
        rows.append([f"Revision: {self.revision}"])
        rows.append([f"Date: {self.modified_date.strftime('%Y-%m-%d')}"])
        rows.append([])
        
        # Header row
        rows.append([
            "Ref Des",
            "Qty",
            "Manufacturer",
            "MPN",
            "Description",
            "Value",
            "Package",
            "Unit Price",
            "Total Price",
            "Supplier",
            "SKU",
            "Status"
        ])
        
        # Data rows
        consolidated = self.get_consolidated_bom()
        
        for item in sorted(consolidated, key=lambda x: x["ref_des"]):
            rows.append([
                item["ref_des"],
                item["quantity"],
                item["manufacturer"],
                item["mpn"],
                item["description"],
                item["value"],
                item["package"],
                item["unit_price"],
                item["total_price"],
                item["supplier"],
                item["supplier_sku"],
                "Pending"
            ])
        
        # Summary rows
        rows.append([])
        rows.append(["Total Unique Parts:", self.get_unique_parts()])
        rows.append(["Total Cost:", self.get_total_cost()])
        
        return rows
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert BOM to dictionary"""
        return {
            "project_name": self.project_name,
            "revision": self.revision,
            "created_date": self.created_date.isoformat(),
            "modified_date": self.modified_date.isoformat(),
            "metadata": self.metadata,
            "items": [item.to_dict() for item in self.items],
            "summary": {
                "total_items": len(self.items),
                "unique_parts": self.get_unique_parts(),
                "total_cost": self.get_total_cost()
            }
        }


class BOMManager:
    """Manages multiple BOMs"""
    
    def __init__(self):
        self.boms: Dict[str, BOM] = {}
    
    def create_bom(self, project_name: str, revision: str = "1.0") -> BOM:
        """Create new BOM"""
        bom = BOM(project_name, revision)
        self.boms[project_name] = bom
        return bom
    
    def get_bom(self, project_name: str) -> Optional[BOM]:
        """Get BOM by project name"""
        return self.boms.get(project_name)
    
    def delete_bom(self, project_name: str) -> bool:
        """Delete BOM"""
        if project_name in self.boms:
            del self.boms[project_name]
            return True
        return False
    
    def list_boms(self) -> List[str]:
        """List all BOM project names"""
        return list(self.boms.keys())
    
    def import_from_circuit(self, circuit_data: Dict[str, Any], project_name: str) -> BOM:
        """
        Create BOM from circuit data
        
        Args:
            circuit_data: Circuit JSON with components
            project_name: Project name for BOM
        
        Returns:
            Created BOM instance
        """
        bom = self.create_bom(project_name)
        
        components = circuit_data.get("components", [])
        
        for comp in components:
            comp_id = comp.get("id", "")
            comp_type = comp.get("type", "Unknown")
            props = comp.get("props", {})
            
            # Extract component properties
            value = props.get("resistance") or props.get("capacitance") or props.get("inductance") or props.get("voltage") or ""
            
            # Create BOM item
            item = BOMItem(
                reference_designator=comp_id,
                mpn=props.get("mpn", f"{comp_type.upper()}-GENERIC"),
                manufacturer=props.get("manufacturer", "Generic"),
                description=f"{comp_type.title()} - {value}",
                quantity=1,
                unit_price=0.0
            )
            
            item.value = str(value)
            item.package = props.get("package", "")
            
            bom.add_item(item)
        
        return bom


def create_bom_manager() -> BOMManager:
    """Factory function to create BOM manager"""
    return BOMManager()
