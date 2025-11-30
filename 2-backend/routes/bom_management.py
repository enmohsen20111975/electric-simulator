"""
Bill of Materials (BOM) API Routes
Professional BOM management, export, and cost analysis
"""

from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
import sys
import os
import io

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.bom_manager import create_bom_manager, BOMItem, BOM
from utils.octopart_client import create_octopart_client


router = APIRouter(prefix="/api/bom", tags=["Bill of Materials"])


# Global BOM manager instance
bom_manager = create_bom_manager()
octopart = create_octopart_client()


# Request/Response Models
class BOMItemRequest(BaseModel):
    reference_designator: str
    mpn: str
    manufacturer: str
    description: str
    quantity: int = 1
    unit_price: float = 0.0
    currency: str = "USD"
    package: Optional[str] = ""
    value: Optional[str] = ""
    tolerance: Optional[str] = ""


class CreateBOMRequest(BaseModel):
    project_name: str
    revision: str = "1.0"
    author: Optional[str] = ""
    company: Optional[str] = ""
    description: Optional[str] = ""


class AddItemRequest(BaseModel):
    project_name: str
    item: BOMItemRequest


class CircuitToBOMRequest(BaseModel):
    project_name: str
    circuit_data: Dict[str, Any]
    auto_price: bool = Field(default=False, description="Automatically fetch pricing from Octopart")


@router.post("/create")
async def create_bom(request: CreateBOMRequest):
    """Create new Bill of Materials"""
    try:
        bom = bom_manager.create_bom(request.project_name, request.revision)
        
        bom.metadata["author"] = request.author or ""
        bom.metadata["company"] = request.company or ""
        bom.metadata["description"] = request.description or ""
        
        return {
            "success": True,
            "message": f"BOM '{request.project_name}' created",
            "bom": bom.to_dict()
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"BOM creation failed: {str(e)}")


@router.post("/add-item")
async def add_item_to_bom(request: AddItemRequest):
    """Add component to BOM"""
    try:
        bom = bom_manager.get_bom(request.project_name)
        
        if not bom:
            raise HTTPException(status_code=404, detail=f"BOM '{request.project_name}' not found")
        
        # Create BOM item
        item = BOMItem(
            reference_designator=request.item.reference_designator,
            mpn=request.item.mpn,
            manufacturer=request.item.manufacturer,
            description=request.item.description,
            quantity=request.item.quantity,
            unit_price=request.item.unit_price,
            currency=request.item.currency
        )
        
        item.package = request.item.package or ""
        item.value = request.item.value or ""
        item.tolerance = request.item.tolerance or ""
        
        bom.add_item(item)
        
        return {
            "success": True,
            "message": f"Item {request.item.reference_designator} added",
            "bom": bom.to_dict()
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Add item failed: {str(e)}")


@router.delete("/{project_name}/item/{ref_des}")
async def remove_item_from_bom(project_name: str, ref_des: str):
    """Remove component from BOM"""
    try:
        bom = bom_manager.get_bom(project_name)
        
        if not bom:
            raise HTTPException(status_code=404, detail=f"BOM '{project_name}' not found")
        
        if bom.remove_item(ref_des):
            return {
                "success": True,
                "message": f"Item {ref_des} removed",
                "bom": bom.to_dict()
            }
        else:
            raise HTTPException(status_code=404, detail=f"Item {ref_des} not found in BOM")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Remove item failed: {str(e)}")


@router.get("/{project_name}")
async def get_bom(project_name: str):
    """Get BOM details"""
    try:
        bom = bom_manager.get_bom(project_name)
        
        if not bom:
            raise HTTPException(status_code=404, detail=f"BOM '{project_name}' not found")
        
        return {
            "success": True,
            "bom": bom.to_dict()
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Get BOM failed: {str(e)}")


@router.get("/{project_name}/consolidated")
async def get_consolidated_bom(project_name: str):
    """Get consolidated BOM (grouped by part number)"""
    try:
        bom = bom_manager.get_bom(project_name)
        
        if not bom:
            raise HTTPException(status_code=404, detail=f"BOM '{project_name}' not found")
        
        return {
            "success": True,
            "project_name": project_name,
            "consolidated_bom": bom.get_consolidated_bom(),
            "summary": {
                "total_items": len(bom.items),
                "unique_parts": bom.get_unique_parts(),
                "total_cost": bom.get_total_cost()
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Get consolidated BOM failed: {str(e)}")


@router.get("/{project_name}/export/csv")
async def export_bom_csv(project_name: str):
    """Export BOM as CSV file"""
    try:
        bom = bom_manager.get_bom(project_name)
        
        if not bom:
            raise HTTPException(status_code=404, detail=f"BOM '{project_name}' not found")
        
        csv_data = bom.export_to_csv()
        
        return Response(
            content=csv_data,
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename={project_name}_BOM.csv"
            }
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CSV export failed: {str(e)}")


@router.get("/{project_name}/export/json")
async def export_bom_json(project_name: str):
    """Export BOM as JSON file"""
    try:
        bom = bom_manager.get_bom(project_name)
        
        if not bom:
            raise HTTPException(status_code=404, detail=f"BOM '{project_name}' not found")
        
        json_data = bom.export_to_json()
        
        return Response(
            content=json_data,
            media_type="application/json",
            headers={
                "Content-Disposition": f"attachment; filename={project_name}_BOM.json"
            }
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"JSON export failed: {str(e)}")


@router.post("/from-circuit")
async def create_bom_from_circuit(request: CircuitToBOMRequest):
    """
    Create BOM from circuit data
    
    Optionally auto-fetch pricing from Octopart
    """
    try:
        # Create BOM from circuit
        bom = bom_manager.import_from_circuit(
            request.circuit_data,
            request.project_name
        )
        
        # Auto-price if requested
        if request.auto_price:
            for item in bom.items:
                try:
                    pricing = octopart.get_pricing(item.mpn, item.quantity, item.manufacturer)
                    
                    if pricing.get("success") and pricing.get("pricing"):
                        best_price_data = pricing["pricing"][0]
                        item.unit_price = best_price_data.get("price", 0.0)
                        item.supplier = best_price_data.get("distributor", "")
                        item.supplier_sku = best_price_data.get("sku", "")
                except:
                    # Skip pricing errors
                    pass
        
        return {
            "success": True,
            "message": f"BOM created from circuit with {len(bom.items)} items",
            "bom": bom.to_dict()
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Circuit to BOM failed: {str(e)}")


@router.post("/{project_name}/update-pricing")
async def update_bom_pricing(project_name: str):
    """Update all component pricing from Octopart"""
    try:
        bom = bom_manager.get_bom(project_name)
        
        if not bom:
            raise HTTPException(status_code=404, detail=f"BOM '{project_name}' not found")
        
        updated_count = 0
        
        for item in bom.items:
            try:
                pricing = octopart.get_pricing(item.mpn, item.quantity, item.manufacturer)
                
                if pricing.get("success") and pricing.get("pricing"):
                    best_price_data = pricing["pricing"][0]
                    item.unit_price = best_price_data.get("price", 0.0)
                    item.supplier = best_price_data.get("distributor", "")
                    item.supplier_sku = best_price_data.get("sku", "")
                    updated_count += 1
            except:
                continue
        
        return {
            "success": True,
            "message": f"Updated pricing for {updated_count}/{len(bom.items)} items",
            "bom": bom.to_dict()
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pricing update failed: {str(e)}")


@router.get("/list")
async def list_boms():
    """List all BOMs"""
    try:
        bom_list = bom_manager.list_boms()
        
        return {
            "success": True,
            "count": len(bom_list),
            "boms": bom_list
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"List BOMs failed: {str(e)}")


@router.delete("/{project_name}")
async def delete_bom(project_name: str):
    """Delete BOM"""
    try:
        if bom_manager.delete_bom(project_name):
            return {
                "success": True,
                "message": f"BOM '{project_name}' deleted"
            }
        else:
            raise HTTPException(status_code=404, detail=f"BOM '{project_name}' not found")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete BOM failed: {str(e)}")
