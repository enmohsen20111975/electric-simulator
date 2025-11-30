"""
Simulation Schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime


class SimulationCreate(BaseModel):
    simulation_type: str = Field(..., pattern="^(dc|ac|transient)$")
    duration: Optional[float] = 1.0
    time_step: Optional[float] = 0.001


class SimulationResponse(BaseModel):
    id: int
    circuit_id: int
    user_id: int
    simulation_type: str
    duration: Optional[float]
    time_step: Optional[float]
    results: Optional[Dict[str, Any]]
    component_states: Optional[Dict[str, Any]]
    wire_states: Optional[Dict[str, Any]]
    status: str
    error_message: Optional[str]
    execution_time: Optional[float]
    created_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True
