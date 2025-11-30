"""
Simulation Routes
Circuit simulation execution and results
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime
import time

from database import get_db
from models.circuit import Circuit
from models.simulation import Simulation
from models.user import User
from schemas.simulation import SimulationCreate, SimulationResponse
from middleware.auth import get_current_user
from simulation.engine import CircuitSimulationEngine

router = APIRouter()
engine = CircuitSimulationEngine()


@router.post("/{circuit_id}/run", response_model=SimulationResponse)
async def run_simulation(
    circuit_id: int,
    simulation_params: SimulationCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Run circuit simulation"""
    
    circuit = db.query(Circuit).filter(Circuit.id == circuit_id).first()
    
    if not circuit:
        raise HTTPException(status_code=404, detail="Circuit not found")
    
    # Check permissions
    if circuit.owner_id != current_user.id and not circuit.is_public:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Create simulation record
    simulation = Simulation(
        circuit_id=circuit_id,
        user_id=current_user.id,
        simulation_type=simulation_params.simulation_type,
        duration=simulation_params.duration,
        time_step=simulation_params.time_step,
        status="running"
    )
    
    db.add(simulation)
    db.commit()
    db.refresh(simulation)
    
    # Run simulation
    start_time = time.time()
    
    try:
        results = engine.simulate(
            components=circuit.components,
            wires=circuit.wires,
            simulation_type=simulation_params.simulation_type,
            duration=simulation_params.duration,
            time_step=simulation_params.time_step
        )
        
        # Calculate component and wire states
        component_states = engine.calculate_component_states(circuit.components, results)
        wire_states = engine.calculate_wire_states(circuit.wires, results)
        
        execution_time = time.time() - start_time
        
        # Update simulation record
        simulation.results = results
        simulation.component_states = component_states
        simulation.wire_states = wire_states
        simulation.status = "completed"
        simulation.execution_time = execution_time
        simulation.completed_at = datetime.utcnow()
        
        # Update circuit last_simulated
        circuit.last_simulated = datetime.utcnow()
        
        db.commit()
        db.refresh(simulation)
        
    except Exception as e:
        simulation.status = "failed"
        simulation.error_message = str(e)
        simulation.execution_time = time.time() - start_time
        db.commit()
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")
    
    return simulation.to_dict()


@router.get("/{circuit_id}/simulations")
async def get_simulations(
    circuit_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all simulations for a circuit"""
    
    circuit = db.query(Circuit).filter(Circuit.id == circuit_id).first()
    
    if not circuit:
        raise HTTPException(status_code=404, detail="Circuit not found")
    
    if circuit.owner_id != current_user.id and not circuit.is_public:
        raise HTTPException(status_code=403, detail="Access denied")
    
    simulations = db.query(Simulation).filter(
        Simulation.circuit_id == circuit_id
    ).order_by(Simulation.created_at.desc()).all()
    
    return [sim.to_dict() for sim in simulations]


@router.get("/result/{simulation_id}", response_model=SimulationResponse)
async def get_simulation_result(
    simulation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get simulation result by ID"""
    
    simulation = db.query(Simulation).filter(Simulation.id == simulation_id).first()
    
    if not simulation:
        raise HTTPException(status_code=404, detail="Simulation not found")
    
    # Check permissions
    circuit = db.query(Circuit).filter(Circuit.id == simulation.circuit_id).first()
    if circuit.owner_id != current_user.id and not circuit.is_public:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return simulation.to_dict()


@router.delete("/{simulation_id}")
async def delete_simulation(
    simulation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a simulation record"""
    
    simulation = db.query(Simulation).filter(Simulation.id == simulation_id).first()
    
    if not simulation:
        raise HTTPException(status_code=404, detail="Simulation not found")
    
    if simulation.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permission denied")
    
    db.delete(simulation)
    db.commit()
    
    return {"message": "Simulation deleted"}
