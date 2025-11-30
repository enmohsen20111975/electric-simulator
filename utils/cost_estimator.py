"""
Cost Estimation Engine
Professional project cost analysis and optimization
Includes labor, components, PCB fabrication, and overhead
"""

from typing import Dict, List, Any, Optional
from enum import Enum
from datetime import datetime
import math


class CostCategory(Enum):
    """Cost category types"""
    COMPONENTS = "components"
    PCB_FABRICATION = "pcb_fabrication"
    ASSEMBLY = "assembly"
    LABOR = "labor"
    TESTING = "testing"
    OVERHEAD = "overhead"
    SHIPPING = "shipping"
    MARGIN = "margin"


class PCBComplexity(Enum):
    """PCB complexity levels"""
    SIMPLE = "simple"  # 1-2 layers, basic components
    MODERATE = "moderate"  # 4 layers, SMD components
    COMPLEX = "complex"  # 6+ layers, BGA, high-density
    ADVANCED = "advanced"  # 8+ layers, HDI, impedance control


class CostItem:
    """Individual cost item"""
    
    def __init__(
        self,
        name: str,
        category: CostCategory,
        unit_cost: float,
        quantity: int = 1,
        currency: str = "USD"
    ):
        self.name = name
        self.category = category
        self.unit_cost = unit_cost
        self.quantity = quantity
        self.currency = currency
        self.notes = ""
    
    def get_total(self) -> float:
        """Calculate total cost"""
        return self.unit_cost * self.quantity
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "name": self.name,
            "category": self.category.value,
            "unit_cost": self.unit_cost,
            "quantity": self.quantity,
            "total_cost": self.get_total(),
            "currency": self.currency,
            "notes": self.notes
        }


class CostEstimator:
    """
    Professional cost estimation engine
    Calculates project costs with volume discounts and optimization
    """
    
    def __init__(self, project_name: str):
        self.project_name = project_name
        self.cost_items: List[CostItem] = []
        self.volume_quantity = 1
        self.currency = "USD"
        
        # Configuration
        self.labor_rate_per_hour = 50.0  # USD/hour
        self.overhead_percentage = 20.0  # 20% overhead
        self.margin_percentage = 30.0  # 30% profit margin
        
        # PCB parameters
        self.pcb_area_cm2 = 100.0
        self.pcb_layers = 2
        self.pcb_complexity = PCBComplexity.SIMPLE
    
    def add_cost_item(self, item: CostItem):
        """Add cost item"""
        self.cost_items.append(item)
    
    def set_volume(self, quantity: int):
        """Set production volume"""
        self.volume_quantity = quantity
    
    def calculate_pcb_cost(self) -> float:
        """
        Calculate PCB fabrication cost
        Based on area, layers, and complexity
        """
        
        # Base cost per square cm
        base_cost_per_cm2 = {
            PCBComplexity.SIMPLE: 0.05,
            PCBComplexity.MODERATE: 0.10,
            PCBComplexity.COMPLEX: 0.20,
            PCBComplexity.ADVANCED: 0.35
        }
        
        # Layer multiplier
        layer_multiplier = {
            1: 1.0,
            2: 1.2,
            4: 1.8,
            6: 2.5,
            8: 3.5,
            10: 5.0
        }
        
        base_cost = base_cost_per_cm2.get(self.pcb_complexity, 0.10)
        layer_mult = layer_multiplier.get(self.pcb_layers, 2.0)
        
        # Setup cost (one-time)
        setup_cost = 50.0
        
        # Unit cost
        unit_cost = self.pcb_area_cm2 * base_cost * layer_mult
        
        # Volume discount
        if self.volume_quantity >= 1000:
            unit_cost *= 0.6  # 40% discount
        elif self.volume_quantity >= 100:
            unit_cost *= 0.75  # 25% discount
        elif self.volume_quantity >= 10:
            unit_cost *= 0.85  # 15% discount
        
        # Total cost
        total_pcb_cost = setup_cost + (unit_cost * self.volume_quantity)
        
        # Cost per unit
        cost_per_unit = total_pcb_cost / self.volume_quantity if self.volume_quantity > 0 else 0
        
        return cost_per_unit
    
    def calculate_assembly_cost(self, num_components: int) -> float:
        """
        Calculate assembly cost
        Based on number of components and complexity
        """
        
        # SMD placement cost per component
        cost_per_component = 0.05
        
        # Through-hole cost per component
        through_hole_surcharge = 0.10
        
        # Setup cost
        setup_cost = 100.0
        
        # Assume 80% SMD, 20% through-hole
        smd_count = int(num_components * 0.8)
        th_count = int(num_components * 0.2)
        
        unit_assembly_cost = (smd_count * cost_per_component) + \
                            (th_count * (cost_per_component + through_hole_surcharge))
        
        # Volume discount
        if self.volume_quantity >= 1000:
            unit_assembly_cost *= 0.5
        elif self.volume_quantity >= 100:
            unit_assembly_cost *= 0.65
        elif self.volume_quantity >= 10:
            unit_assembly_cost *= 0.80
        
        total_assembly_cost = setup_cost + (unit_assembly_cost * self.volume_quantity)
        
        return total_assembly_cost / self.volume_quantity if self.volume_quantity > 0 else 0
    
    def calculate_component_cost_with_volume(self, bom_items: List[Dict[str, Any]]) -> float:
        """
        Calculate total component cost with volume pricing
        
        Args:
            bom_items: List of BOM items with pricing
        
        Returns:
            Total component cost per unit
        """
        total_cost = 0.0
        
        for item in bom_items:
            unit_price = item.get("unit_price", 0.0)
            quantity_per_board = item.get("quantity", 1)
            
            # Apply volume discount tiers
            if self.volume_quantity >= 1000:
                unit_price *= 0.70  # 30% discount at 1K+
            elif self.volume_quantity >= 500:
                unit_price *= 0.75  # 25% discount at 500+
            elif self.volume_quantity >= 100:
                unit_price *= 0.85  # 15% discount at 100+
            elif self.volume_quantity >= 50:
                unit_price *= 0.90  # 10% discount at 50+
            
            total_cost += unit_price * quantity_per_board
        
        return total_cost
    
    def calculate_labor_cost(self, hours: float) -> float:
        """Calculate labor cost"""
        return hours * self.labor_rate_per_hour
    
    def calculate_testing_cost(self) -> float:
        """Calculate testing and quality control cost"""
        
        base_testing_cost = 5.0  # USD per unit
        
        # Volume discount
        if self.volume_quantity >= 1000:
            base_testing_cost *= 0.5
        elif self.volume_quantity >= 100:
            base_testing_cost *= 0.7
        elif self.volume_quantity >= 10:
            base_testing_cost *= 0.85
        
        return base_testing_cost
    
    def estimate_project_cost(
        self,
        bom_items: List[Dict[str, Any]],
        design_hours: float = 40.0,
        testing_hours: float = 8.0
    ) -> Dict[str, Any]:
        """
        Complete project cost estimation
        
        Args:
            bom_items: List of BOM items with pricing
            design_hours: Engineering design hours
            testing_hours: Testing and validation hours
        
        Returns:
            Detailed cost breakdown
        """
        
        num_components = len(bom_items)
        
        # Calculate individual costs
        component_cost = self.calculate_component_cost_with_volume(bom_items)
        pcb_cost = self.calculate_pcb_cost()
        assembly_cost = self.calculate_assembly_cost(num_components)
        testing_cost = self.calculate_testing_cost()
        
        # One-time costs (NRE - Non-Recurring Engineering)
        design_cost = self.calculate_labor_cost(design_hours)
        validation_cost = self.calculate_labor_cost(testing_hours)
        nre_total = design_cost + validation_cost
        nre_per_unit = nre_total / self.volume_quantity if self.volume_quantity > 0 else 0
        
        # Subtotal (manufacturing cost)
        manufacturing_cost = component_cost + pcb_cost + assembly_cost + testing_cost
        
        # Overhead
        overhead_cost = manufacturing_cost * (self.overhead_percentage / 100.0)
        
        # Total cost before margin
        total_cost_before_margin = manufacturing_cost + overhead_cost + nre_per_unit
        
        # Profit margin
        margin_cost = total_cost_before_margin * (self.margin_percentage / 100.0)
        
        # Final selling price
        selling_price = total_cost_before_margin + margin_cost
        
        return {
            "project_name": self.project_name,
            "volume": self.volume_quantity,
            "currency": self.currency,
            "breakdown": {
                "components": {
                    "cost_per_unit": component_cost,
                    "total": component_cost * self.volume_quantity,
                    "percentage": (component_cost / total_cost_before_margin * 100) if total_cost_before_margin > 0 else 0
                },
                "pcb_fabrication": {
                    "cost_per_unit": pcb_cost,
                    "total": pcb_cost * self.volume_quantity,
                    "percentage": (pcb_cost / total_cost_before_margin * 100) if total_cost_before_margin > 0 else 0
                },
                "assembly": {
                    "cost_per_unit": assembly_cost,
                    "total": assembly_cost * self.volume_quantity,
                    "percentage": (assembly_cost / total_cost_before_margin * 100) if total_cost_before_margin > 0 else 0
                },
                "testing": {
                    "cost_per_unit": testing_cost,
                    "total": testing_cost * self.volume_quantity,
                    "percentage": (testing_cost / total_cost_before_margin * 100) if total_cost_before_margin > 0 else 0
                },
                "overhead": {
                    "cost_per_unit": overhead_cost,
                    "total": overhead_cost * self.volume_quantity,
                    "percentage": self.overhead_percentage
                },
                "nre": {
                    "total": nre_total,
                    "cost_per_unit": nre_per_unit,
                    "design_hours": design_hours,
                    "testing_hours": testing_hours
                }
            },
            "summary": {
                "manufacturing_cost_per_unit": manufacturing_cost,
                "total_cost_per_unit": total_cost_before_margin,
                "margin_per_unit": margin_cost,
                "selling_price_per_unit": selling_price,
                "total_manufacturing_cost": manufacturing_cost * self.volume_quantity,
                "total_project_cost": total_cost_before_margin * self.volume_quantity,
                "total_revenue": selling_price * self.volume_quantity,
                "total_profit": margin_cost * self.volume_quantity
            }
        }
    
    def optimize_volume(
        self,
        bom_items: List[Dict[str, Any]],
        target_price: float,
        max_volume: int = 10000
    ) -> Dict[str, Any]:
        """
        Find optimal production volume to meet target price
        
        Args:
            bom_items: List of BOM items
            target_price: Target selling price per unit
            max_volume: Maximum volume to consider
        
        Returns:
            Optimal volume and cost analysis
        """
        
        volumes_to_test = [1, 10, 50, 100, 500, 1000, 2000, 5000, 10000]
        volumes_to_test = [v for v in volumes_to_test if v <= max_volume]
        
        results = []
        
        for volume in volumes_to_test:
            self.set_volume(volume)
            estimate = self.estimate_project_cost(bom_items)
            
            selling_price = estimate["summary"]["selling_price_per_unit"]
            meets_target = selling_price <= target_price
            
            results.append({
                "volume": volume,
                "selling_price": selling_price,
                "manufacturing_cost": estimate["summary"]["manufacturing_cost_per_unit"],
                "meets_target": meets_target,
                "price_difference": target_price - selling_price
            })
        
        # Find best match
        viable_options = [r for r in results if r["meets_target"]]
        
        if viable_options:
            optimal = min(viable_options, key=lambda x: x["volume"])
        else:
            optimal = results[-1]  # Highest volume
        
        return {
            "target_price": target_price,
            "optimal_volume": optimal["volume"],
            "optimal_price": optimal["selling_price"],
            "meets_target": optimal["meets_target"],
            "all_options": results
        }


def create_cost_estimator(project_name: str) -> CostEstimator:
    """Factory function to create cost estimator"""
    return CostEstimator(project_name)
