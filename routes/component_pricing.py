"""
Component Pricing and Availability API Routes
Integrates with Octopart for real-time component data
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.octopart_client import create_octopart_client


router = APIRouter(prefix="/api/components/pricing", tags=["Component Pricing"])


# Octopart client instance
octopart = create_octopart_client()


class PricingRequest(BaseModel):
    mpn: str = Field(..., description="Manufacturer Part Number")
    manufacturer: Optional[str] = Field(None, description="Manufacturer name")
    quantity: int = Field(default=1, ge=1, description="Order quantity")


class SpecsRequest(BaseModel):
    mpn: str = Field(..., description="Manufacturer Part Number")
    manufacturer: Optional[str] = Field(None, description="Manufacturer name")


@router.get("/search")
async def search_components(
    query: str = Query(..., description="Search query (part number, manufacturer, description)"),
    limit: int = Query(10, ge=1, le=100, description="Maximum results"),
    start: int = Query(0, ge=0, description="Starting offset for pagination")
):
    """
    Search for electronic components
    
    Returns component data including pricing, availability, and specifications
    """
    try:
        results = octopart.search_parts(query, limit, start)
        return results
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


@router.post("/pricing")
async def get_component_pricing(request: PricingRequest):
    """
    Get pricing information for a specific component
    
    Returns prices from multiple distributors with availability
    """
    try:
        pricing = octopart.get_pricing(
            mpn=request.mpn,
            quantity=request.quantity,
            manufacturer=request.manufacturer
        )
        
        if pricing.get("success"):
            return pricing
        else:
            raise HTTPException(status_code=404, detail=pricing.get("error", "Component not found"))
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pricing lookup failed: {str(e)}")


@router.post("/specifications")
async def get_component_specs(request: SpecsRequest):
    """
    Get technical specifications for a component
    
    Returns detailed specs, datasheets, and descriptions
    """
    try:
        specs = octopart.get_specifications(
            mpn=request.mpn,
            manufacturer=request.manufacturer
        )
        
        if specs.get("success"):
            return specs
        else:
            raise HTTPException(status_code=404, detail=specs.get("error", "Component not found"))
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Specifications lookup failed: {str(e)}")


@router.get("/compare/{mpn}")
async def compare_distributors(
    mpn: str,
    quantity: int = Query(1, ge=1, description="Order quantity")
):
    """
    Compare prices across all distributors
    
    Returns sorted list of distributors with pricing and stock levels
    """
    try:
        comparison = octopart.compare_distributors(mpn, quantity)
        
        if comparison.get("success"):
            return comparison
        else:
            raise HTTPException(status_code=404, detail=comparison.get("error", "Component not found"))
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison failed: {str(e)}")


@router.get("/part/{mpn}")
async def get_part_details(
    mpn: str,
    manufacturer: Optional[str] = Query(None, description="Manufacturer name (optional)")
):
    """
    Get complete component details by MPN
    
    Returns all available information: specs, pricing, datasheets
    """
    try:
        part = octopart.get_part_by_mpn(mpn, manufacturer)
        
        if part.get("success"):
            return part
        else:
            raise HTTPException(status_code=404, detail=part.get("error", "Part not found"))
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Part lookup failed: {str(e)}")


@router.get("/batch-pricing")
async def get_batch_pricing(
    mpns: str = Query(..., description="Comma-separated list of MPNs"),
    quantity: int = Query(1, ge=1, description="Quantity per component")
):
    """
    Get pricing for multiple components at once
    
    Useful for Bill of Materials (BOM) cost estimation
    """
    try:
        mpn_list = [mpn.strip() for mpn in mpns.split(",")]
        
        results = []
        total_cost = 0
        
        for mpn in mpn_list:
            pricing = octopart.get_pricing(mpn, quantity)
            
            if pricing.get("success"):
                best_price = None
                if pricing.get("pricing"):
                    best_price = pricing["pricing"][0].get("price", 0)
                    total_cost += best_price * quantity
                
                results.append({
                    "mpn": mpn,
                    "quantity": quantity,
                    "best_price": best_price,
                    "total": best_price * quantity if best_price else 0,
                    "available": len(pricing.get("pricing", [])) > 0
                })
            else:
                results.append({
                    "mpn": mpn,
                    "quantity": quantity,
                    "best_price": None,
                    "total": 0,
                    "available": False,
                    "error": pricing.get("error", "Not found")
                })
        
        return {
            "success": True,
            "components": results,
            "total_components": len(results),
            "total_cost": total_cost,
            "currency": "USD"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch pricing failed: {str(e)}")


@router.get("/status")
async def get_api_status():
    """Check Octopart API integration status"""
    
    api_key_set = octopart.api_key is not None
    
    return {
        "api_configured": api_key_set,
        "service": "Octopart by Altium",
        "features": [
            "Component search",
            "Real-time pricing",
            "Distributor comparison",
            "Technical specifications",
            "Datasheet links"
        ],
        "note": "Set OCTOPART_API_KEY environment variable for full functionality" if not api_key_set else "API ready"
    }
