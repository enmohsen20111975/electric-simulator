"""
Cost Estimation API Routes
Professional project cost analysis and optimization
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.cost_estimator import create_cost_estimator, PCBComplexity


router = APIRouter(prefix="/api/cost", tags=["Cost Estimation"])


# Request/Response Models
class PCBParameters(BaseModel):
    area_cm2: float = Field(..., ge=1, description="PCB area in square centimeters")
    layers: int = Field(..., ge=1, le=12, description="Number of PCB layers")
    complexity: str = Field(default="simple", description="PCB complexity: simple, moderate, complex, advanced")


class CostEstimationRequest(BaseModel):
    project_name: str
    volume: int = Field(..., ge=1, description="Production volume")
    bom_items: List[Dict[str, Any]] = Field(..., description="BOM items with pricing")
    pcb: PCBParameters
    design_hours: float = Field(default=40.0, ge=0, description="Engineering design hours")
    testing_hours: float = Field(default=8.0, ge=0, description="Testing hours")
    labor_rate: float = Field(default=50.0, ge=0, description="Labor rate per hour (USD)")
    overhead_percentage: float = Field(default=20.0, ge=0, le=100, description="Overhead percentage")
    margin_percentage: float = Field(default=30.0, ge=0, le=100, description="Profit margin percentage")


class VolumeOptimizationRequest(BaseModel):
    project_name: str
    target_price: float = Field(..., gt=0, description="Target selling price per unit")
    bom_items: List[Dict[str, Any]]
    pcb: PCBParameters
    max_volume: int = Field(default=10000, ge=1, description="Maximum volume to consider")


class AssemblyCostRequest(BaseModel):
    num_components: int = Field(..., ge=1, description="Number of components")
    volume: int = Field(default=100, ge=1, description="Production volume")


@router.post("/estimate")
async def estimate_project_cost(request: CostEstimationRequest):
    """
    Estimate complete project cost
    
    Returns detailed breakdown of all cost components
    """
    try:
        estimator = create_cost_estimator(request.project_name)
        
        # Configure estimator
        estimator.set_volume(request.volume)
        estimator.labor_rate_per_hour = request.labor_rate
        estimator.overhead_percentage = request.overhead_percentage
        estimator.margin_percentage = request.margin_percentage
        
        # Set PCB parameters
        estimator.pcb_area_cm2 = request.pcb.area_cm2
        estimator.pcb_layers = request.pcb.layers
        
        try:
            estimator.pcb_complexity = PCBComplexity[request.pcb.complexity.upper()]
        except KeyError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid PCB complexity: {request.pcb.complexity}. Use: simple, moderate, complex, advanced"
            )
        
        # Calculate estimate
        estimate = estimator.estimate_project_cost(
            bom_items=request.bom_items,
            design_hours=request.design_hours,
            testing_hours=request.testing_hours
        )
        
        return {
            "success": True,
            "estimate": estimate
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cost estimation failed: {str(e)}")


@router.post("/optimize-volume")
async def optimize_production_volume(request: VolumeOptimizationRequest):
    """
    Find optimal production volume to meet target price
    
    Returns recommended volume and price analysis
    """
    try:
        estimator = create_cost_estimator(request.project_name)
        
        # Set PCB parameters
        estimator.pcb_area_cm2 = request.pcb.area_cm2
        estimator.pcb_layers = request.pcb.layers
        
        try:
            estimator.pcb_complexity = PCBComplexity[request.pcb.complexity.upper()]
        except KeyError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid PCB complexity: {request.pcb.complexity}"
            )
        
        # Optimize volume
        optimization = estimator.optimize_volume(
            bom_items=request.bom_items,
            target_price=request.target_price,
            max_volume=request.max_volume
        )
        
        return {
            "success": True,
            "optimization": optimization
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Volume optimization failed: {str(e)}")


@router.post("/calculate-pcb")
async def calculate_pcb_cost(pcb: PCBParameters, volume: int = 100):
    """Calculate PCB fabrication cost only"""
    try:
        estimator = create_cost_estimator("PCB Cost")
        estimator.set_volume(volume)
        estimator.pcb_area_cm2 = pcb.area_cm2
        estimator.pcb_layers = pcb.layers
        
        try:
            estimator.pcb_complexity = PCBComplexity[pcb.complexity.upper()]
        except KeyError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid PCB complexity: {pcb.complexity}"
            )
        
        pcb_cost = estimator.calculate_pcb_cost()
        
        return {
            "success": True,
            "pcb_cost_per_unit": pcb_cost,
            "total_pcb_cost": pcb_cost * volume,
            "volume": volume,
            "parameters": {
                "area_cm2": pcb.area_cm2,
                "layers": pcb.layers,
                "complexity": pcb.complexity
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PCB cost calculation failed: {str(e)}")


@router.post("/calculate-assembly")
async def calculate_assembly_cost(request: AssemblyCostRequest):
    """Calculate assembly cost only"""
    try:
        estimator = create_cost_estimator("Assembly Cost")
        estimator.set_volume(request.volume)
        
        assembly_cost = estimator.calculate_assembly_cost(request.num_components)
        
        return {
            "success": True,
            "assembly_cost_per_unit": assembly_cost,
            "total_assembly_cost": assembly_cost * request.volume,
            "volume": request.volume,
            "num_components": request.num_components
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assembly cost calculation failed: {str(e)}")


@router.get("/volume-tiers")
async def get_volume_discount_tiers():
    """Get volume discount tier information"""
    return {
        "success": True,
        "tiers": [
            {
                "min_volume": 1,
                "max_volume": 9,
                "discount_percentage": 0,
                "description": "Low volume - no discount"
            },
            {
                "min_volume": 10,
                "max_volume": 49,
                "discount_percentage": 15,
                "description": "Small batch - 15% discount"
            },
            {
                "min_volume": 50,
                "max_volume": 99,
                "discount_percentage": 10,
                "description": "Medium batch - 10% additional discount"
            },
            {
                "min_volume": 100,
                "max_volume": 499,
                "discount_percentage": 15,
                "description": "Large batch - 15% additional discount"
            },
            {
                "min_volume": 500,
                "max_volume": 999,
                "discount_percentage": 25,
                "description": "Volume production - 25% discount"
            },
            {
                "min_volume": 1000,
                "max_volume": None,
                "discount_percentage": 30,
                "description": "Mass production - 30% discount"
            }
        ],
        "note": "Discounts apply to component pricing, PCB fabrication, and assembly costs"
    }


@router.get("/cost-parameters")
async def get_cost_parameters():
    """Get default cost calculation parameters"""
    return {
        "success": True,
        "parameters": {
            "labor": {
                "default_rate_per_hour": 50.0,
                "currency": "USD",
                "description": "Engineering labor rate"
            },
            "overhead": {
                "default_percentage": 20.0,
                "description": "Overhead cost percentage (facilities, utilities, management)"
            },
            "margin": {
                "default_percentage": 30.0,
                "description": "Profit margin percentage"
            },
            "pcb_complexity": {
                "simple": "1-2 layers, basic components, single-sided",
                "moderate": "4 layers, SMD components, double-sided",
                "complex": "6+ layers, BGA, high-density routing",
                "advanced": "8+ layers, HDI, impedance control, blind/buried vias"
            },
            "assembly": {
                "smd_cost_per_component": 0.05,
                "through_hole_surcharge": 0.10,
                "setup_cost": 100.0
            },
            "testing": {
                "base_cost_per_unit": 5.0,
                "description": "Quality control and functional testing"
            }
        }
    }
