"""
Digital Logic Simulation API Routes
Professional digital circuit simulation endpoints
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from simulation.digital_logic import (
    create_digital_simulator,
    GateType,
    LogicLevel
)


router = APIRouter(prefix="/api/digital", tags=["Digital Logic Simulation"])


# Request/Response Models
class GateDefinition(BaseModel):
    id: str
    type: str = Field(..., description="Gate type: AND, OR, NOT, NAND, NOR, XOR, XNOR, BUFFER")
    num_inputs: int = Field(default=2, ge=1, le=8)
    delay: float = Field(default=0.001, description="Propagation delay in seconds")


class FlipFlopDefinition(BaseModel):
    id: str
    edge_trigger: str = Field(default="rising", description="Edge trigger: rising or falling")


class WireDefinition(BaseModel):
    id: str
    from_gate: str
    from_output: str = "output"
    to_gate: str
    to_input: int = Field(..., ge=0, description="Input index on destination gate")


class DigitalCircuit(BaseModel):
    name: str = "Digital Circuit"
    gates: List[GateDefinition]
    flip_flops: Optional[List[FlipFlopDefinition]] = []
    wires: List[WireDefinition]


class SimulationRequest(BaseModel):
    circuit: DigitalCircuit
    inputs: Dict[str, int] = Field(..., description="Input signals: gate_id -> 0 or 1")
    duration: float = Field(default=0.001, description="Simulation duration in seconds")
    time_step: float = Field(default=0.0001, description="Time step for sampling")


class TruthTableRequest(BaseModel):
    circuit: DigitalCircuit
    input_names: List[str] = Field(..., description="List of input gate IDs")
    output_names: List[str] = Field(..., description="List of output gate IDs")


class ClockSimulationRequest(BaseModel):
    circuit: DigitalCircuit
    clock_signal: str = Field(..., description="Clock signal gate ID")
    initial_inputs: Dict[str, int] = Field(default={}, description="Initial input states")
    num_cycles: int = Field(default=10, ge=1, le=1000, description="Number of clock cycles")


@router.post("/simulate")
async def simulate_digital_circuit(request: SimulationRequest):
    """
    Simulate digital logic circuit
    
    Returns time-domain simulation results with gate states
    """
    try:
        sim = create_digital_simulator()
        
        # Build circuit
        for gate_def in request.circuit.gates:
            try:
                gate_type = GateType[gate_def.type.upper()]
                sim.add_gate(
                    gate_def.id,
                    gate_type,
                    gate_def.num_inputs,
                    gate_def.delay
                )
            except KeyError:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid gate type: {gate_def.type}"
                )
        
        # Add flip-flops
        if request.circuit.flip_flops:
            for ff_def in request.circuit.flip_flops:
                sim.add_flip_flop(ff_def.id, ff_def.edge_trigger)
        
        # Add wires
        for wire_def in request.circuit.wires:
            sim.add_wire(
                wire_def.id,
                wire_def.from_gate,
                wire_def.from_output,
                wire_def.to_gate,
                wire_def.to_input
            )
        
        # Set inputs
        for gate_id, value in request.inputs.items():
            level = LogicLevel.HIGH if value else LogicLevel.LOW
            if gate_id in sim.gates:
                sim.gates[gate_id].output = level
        
        # Run simulation
        results = sim.simulate(request.duration, request.time_step)
        
        return {
            "success": True,
            "circuit_name": request.circuit.name,
            "results": results
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")


@router.post("/truth-table")
async def generate_truth_table(request: TruthTableRequest):
    """
    Generate truth table for combinational logic circuit
    
    Returns complete truth table with all input/output combinations
    """
    try:
        sim = create_digital_simulator()
        
        # Build circuit
        for gate_def in request.circuit.gates:
            try:
                gate_type = GateType[gate_def.type.upper()]
                sim.add_gate(
                    gate_def.id,
                    gate_type,
                    gate_def.num_inputs,
                    gate_def.delay
                )
            except KeyError:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid gate type: {gate_def.type}"
                )
        
        # Add wires
        for wire_def in request.circuit.wires:
            sim.add_wire(
                wire_def.id,
                wire_def.from_gate,
                wire_def.from_output,
                wire_def.to_gate,
                wire_def.to_input
            )
        
        # Generate truth table
        truth_table = sim.get_truth_table(
            request.input_names,
            request.output_names
        )
        
        return {
            "success": True,
            "circuit_name": request.circuit.name,
            "num_inputs": len(request.input_names),
            "num_outputs": len(request.output_names),
            "truth_table": truth_table
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Truth table generation failed: {str(e)}")


@router.post("/simulate-clock")
async def simulate_with_clock(request: ClockSimulationRequest):
    """
    Simulate sequential circuit with clock signal
    
    Returns state changes for each clock edge
    """
    try:
        sim = create_digital_simulator()
        
        # Build circuit
        for gate_def in request.circuit.gates:
            try:
                gate_type = GateType[gate_def.type.upper()]
                sim.add_gate(
                    gate_def.id,
                    gate_type,
                    gate_def.num_inputs,
                    gate_def.delay
                )
            except KeyError:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid gate type: {gate_def.type}"
                )
        
        # Add flip-flops
        if request.circuit.flip_flops:
            for ff_def in request.circuit.flip_flops:
                sim.add_flip_flop(ff_def.id, ff_def.edge_trigger)
        
        # Add wires
        for wire_def in request.circuit.wires:
            sim.add_wire(
                wire_def.id,
                wire_def.from_gate,
                wire_def.from_output,
                wire_def.to_gate,
                wire_def.to_input
            )
        
        # Set initial inputs
        for gate_id, value in request.initial_inputs.items():
            level = LogicLevel.HIGH if value else LogicLevel.LOW
            if gate_id in sim.gates:
                sim.gates[gate_id].output = level
        
        # Simulate clock cycles
        results = sim.simulate_clock_cycle(
            request.clock_signal,
            request.num_cycles
        )
        
        return {
            "success": True,
            "circuit_name": request.circuit.name,
            "num_cycles": request.num_cycles,
            "results": results
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Clock simulation failed: {str(e)}")


@router.get("/gate-types")
async def get_supported_gates():
    """Get list of supported gate types"""
    return {
        "combinational": [
            {"type": "AND", "description": "AND gate"},
            {"type": "OR", "description": "OR gate"},
            {"type": "NOT", "description": "NOT gate (inverter)"},
            {"type": "NAND", "description": "NAND gate"},
            {"type": "NOR", "description": "NOR gate"},
            {"type": "XOR", "description": "Exclusive OR gate"},
            {"type": "XNOR", "description": "Exclusive NOR gate"},
            {"type": "BUFFER", "description": "Buffer gate"}
        ],
        "sequential": [
            {"type": "D_FLIP_FLOP", "description": "D Flip-Flop"},
            {"type": "JK_FLIP_FLOP", "description": "JK Flip-Flop"},
            {"type": "LATCH", "description": "Latch"}
        ]
    }


@router.post("/analyze")
async def analyze_circuit(circuit: DigitalCircuit):
    """
    Analyze digital circuit topology
    
    Returns circuit statistics and potential issues
    """
    try:
        sim = create_digital_simulator()
        
        # Build circuit
        for gate_def in circuit.gates:
            try:
                gate_type = GateType[gate_def.type.upper()]
                sim.add_gate(
                    gate_def.id,
                    gate_type,
                    gate_def.num_inputs,
                    gate_def.delay
                )
            except KeyError:
                pass
        
        for wire_def in circuit.wires:
            sim.add_wire(
                wire_def.id,
                wire_def.from_gate,
                wire_def.from_output,
                wire_def.to_gate,
                wire_def.to_input
            )
        
        # Analyze
        gate_count = len(circuit.gates)
        wire_count = len(circuit.wires)
        ff_count = len(circuit.flip_flops) if circuit.flip_flops else 0
        
        gate_types = {}
        for gate in circuit.gates:
            gate_types[gate.type] = gate_types.get(gate.type, 0) + 1
        
        return {
            "success": True,
            "circuit_name": circuit.name,
            "statistics": {
                "total_gates": gate_count,
                "total_wires": wire_count,
                "total_flip_flops": ff_count,
                "gate_types": gate_types,
                "is_combinational": ff_count == 0,
                "is_sequential": ff_count > 0
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
