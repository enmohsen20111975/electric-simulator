"""
SPICE Simulation API Routes
Professional circuit simulation endpoints using PySpice
"""

from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from simulation.spice_engine import create_simulation_engine, PYSPICE_AVAILABLE


router = APIRouter(prefix="/api/spice", tags=["SPICE Simulation"])


# Request/Response Models
class SPICEComponent(BaseModel):
    id: str
    type: str
    node1: str
    node2: str
    props: Dict[str, Any] = {}


class SPICECircuit(BaseModel):
    name: str = "Circuit"
    components: List[SPICEComponent]
    ground_node: str = "0"


class DCAnalysisRequest(BaseModel):
    circuit: SPICECircuit


class ACAnalysisRequest(BaseModel):
    circuit: SPICECircuit
    start_frequency: float = Field(default=1, description="Start frequency in Hz")
    stop_frequency: float = Field(default=1e6, description="Stop frequency in Hz")
    points_per_decade: int = Field(default=10, description="Points per decade")
    variation: str = Field(default="dec", description="Frequency variation: dec, oct, lin")


class TransientAnalysisRequest(BaseModel):
    circuit: SPICECircuit
    step_time: float = Field(default=1e-6, description="Time step in seconds")
    end_time: float = Field(default=1e-3, description="End time in seconds")
    start_time: float = Field(default=0, description="Start time in seconds")
    max_time: Optional[float] = Field(default=None, description="Maximum time step")


@router.get("/status")
async def get_spice_status():
    """Check if PySpice is available"""
    return {
        "pyspice_available": PYSPICE_AVAILABLE,
        "version": "1.5" if PYSPICE_AVAILABLE else None,
        "backend": "ngspice" if PYSPICE_AVAILABLE else None,
        "message": "PySpice ready" if PYSPICE_AVAILABLE else "PySpice not installed"
    }


@router.post("/simulate/dc")
async def simulate_dc_analysis(request: DCAnalysisRequest):
    """
    Run DC Operating Point Analysis
    
    Returns node voltages and branch currents at DC steady state
    """
    try:
        engine = create_simulation_engine()
        
        # Build circuit
        engine.create_circuit(request.circuit.name)
        
        for comp in request.circuit.components:
            comp_type = comp.type.lower()
            
            if comp_type == "resistor":
                engine.add_resistor(
                    comp.node1,
                    comp.node2,
                    comp.props.get("resistance", 1000),
                    name=comp.id
                )
            
            elif comp_type == "capacitor":
                engine.add_capacitor(
                    comp.node1,
                    comp.node2,
                    comp.props.get("capacitance", 1e-6),
                    name=comp.id,
                    initial_voltage=comp.props.get("initial_voltage", 0)
                )
            
            elif comp_type == "inductor":
                engine.add_inductor(
                    comp.node1,
                    comp.node2,
                    comp.props.get("inductance", 1e-3),
                    name=comp.id,
                    initial_current=comp.props.get("initial_current", 0)
                )
            
            elif comp_type == "battery" or comp_type == "voltage_source":
                engine.add_voltage_source(
                    comp.node1,
                    comp.node2,
                    comp.props.get("voltage", 9),
                    name=comp.id
                )
            
            elif comp_type == "current_source":
                engine.add_current_source(
                    comp.node1,
                    comp.node2,
                    comp.props.get("current", 0.001),
                    name=comp.id
                )
            
            elif comp_type == "diode":
                engine.add_diode(
                    comp.node1,
                    comp.node2,
                    name=comp.id,
                    model=comp.props.get("model", "1N4148")
                )
            
            elif comp_type == "bjt":
                # BJT requires 3 nodes: collector, base, emitter
                engine.add_bjt(
                    comp.node1,  # collector
                    comp.props.get("node_base", "0"),
                    comp.node2,  # emitter
                    name=comp.id,
                    model=comp.props.get("model", "2N2222"),
                    bjt_type=comp.props.get("bjt_type", "npn")
                )
            
            elif comp_type == "mosfet":
                # MOSFET requires 4 nodes: drain, gate, source, bulk
                engine.add_mosfet(
                    comp.node1,  # drain
                    comp.props.get("node_gate", "0"),
                    comp.node2,  # source
                    comp.props.get("node_bulk", "0"),
                    name=comp.id,
                    model=comp.props.get("model", "NMOS"),
                    mosfet_type=comp.props.get("mosfet_type", "nmos")
                )
        
        # Run simulation
        results = engine.simulate_dc()
        
        if results.get("success"):
            return {
                "success": True,
                "analysis_type": "dc",
                "results": results,
                "netlist": engine.get_netlist()
            }
        else:
            raise HTTPException(status_code=400, detail=results.get("error", "Simulation failed"))
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DC analysis error: {str(e)}")


@router.post("/simulate/ac")
async def simulate_ac_analysis(request: ACAnalysisRequest):
    """
    Run AC Small-Signal Analysis
    
    Returns frequency response (magnitude and phase) for all nodes
    """
    try:
        engine = create_simulation_engine()
        
        # Build circuit (same as DC)
        engine.create_circuit(request.circuit.name)
        
        for comp in request.circuit.components:
            comp_type = comp.type.lower()
            
            if comp_type == "resistor":
                engine.add_resistor(
                    comp.node1,
                    comp.node2,
                    comp.props.get("resistance", 1000),
                    name=comp.id
                )
            
            elif comp_type == "capacitor":
                engine.add_capacitor(
                    comp.node1,
                    comp.node2,
                    comp.props.get("capacitance", 1e-6),
                    name=comp.id
                )
            
            elif comp_type == "inductor":
                engine.add_inductor(
                    comp.node1,
                    comp.node2,
                    comp.props.get("inductance", 1e-3),
                    name=comp.id
                )
            
            elif comp_type == "battery" or comp_type == "voltage_source":
                # For AC analysis, use AC voltage source
                engine.add_voltage_source(
                    comp.node1,
                    comp.node2,
                    comp.props.get("voltage", 9),
                    name=comp.id
                )
        
        # Run AC simulation
        results = engine.simulate_ac(
            start_frequency=request.start_frequency,
            stop_frequency=request.stop_frequency,
            points_per_decade=request.points_per_decade,
            variation=request.variation
        )
        
        if results.get("success"):
            return {
                "success": True,
                "analysis_type": "ac",
                "results": results,
                "netlist": engine.get_netlist()
            }
        else:
            raise HTTPException(status_code=400, detail=results.get("error", "Simulation failed"))
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AC analysis error: {str(e)}")


@router.post("/simulate/transient")
async def simulate_transient_analysis(request: TransientAnalysisRequest):
    """
    Run Transient Time-Domain Analysis
    
    Returns time-varying voltages and currents
    """
    try:
        engine = create_simulation_engine()
        
        # Build circuit
        engine.create_circuit(request.circuit.name)
        
        for comp in request.circuit.components:
            comp_type = comp.type.lower()
            
            if comp_type == "resistor":
                engine.add_resistor(
                    comp.node1,
                    comp.node2,
                    comp.props.get("resistance", 1000),
                    name=comp.id
                )
            
            elif comp_type == "capacitor":
                engine.add_capacitor(
                    comp.node1,
                    comp.node2,
                    comp.props.get("capacitance", 1e-6),
                    name=comp.id,
                    initial_voltage=comp.props.get("initial_voltage", 0)
                )
            
            elif comp_type == "inductor":
                engine.add_inductor(
                    comp.node1,
                    comp.node2,
                    comp.props.get("inductance", 1e-3),
                    name=comp.id,
                    initial_current=comp.props.get("initial_current", 0)
                )
            
            elif comp_type == "battery" or comp_type == "voltage_source":
                engine.add_voltage_source(
                    comp.node1,
                    comp.node2,
                    comp.props.get("voltage", 9),
                    name=comp.id
                )
            
            elif comp_type == "current_source":
                engine.add_current_source(
                    comp.node1,
                    comp.node2,
                    comp.props.get("current", 0.001),
                    name=comp.id
                )
        
        # Run transient simulation
        results = engine.simulate_transient(
            step_time=request.step_time,
            end_time=request.end_time,
            start_time=request.start_time,
            max_time=request.max_time
        )
        
        if results.get("success"):
            return {
                "success": True,
                "analysis_type": "transient",
                "results": results,
                "netlist": engine.get_netlist()
            }
        else:
            raise HTTPException(status_code=400, detail=results.get("error", "Simulation failed"))
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transient analysis error: {str(e)}")


@router.post("/netlist/generate")
async def generate_netlist(circuit: SPICECircuit):
    """
    Generate SPICE netlist from circuit
    
    Returns SPICE netlist text without running simulation
    """
    try:
        engine = create_simulation_engine()
        
        # Build circuit
        engine.create_circuit(circuit.name)
        
        for comp in circuit.components:
            comp_type = comp.type.lower()
            
            if comp_type == "resistor":
                engine.add_resistor(
                    comp.node1,
                    comp.node2,
                    comp.props.get("resistance", 1000),
                    name=comp.id
                )
            
            elif comp_type == "capacitor":
                engine.add_capacitor(
                    comp.node1,
                    comp.node2,
                    comp.props.get("capacitance", 1e-6),
                    name=comp.id
                )
            
            elif comp_type == "inductor":
                engine.add_inductor(
                    comp.node1,
                    comp.node2,
                    comp.props.get("inductance", 1e-3),
                    name=comp.id
                )
            
            elif comp_type == "battery" or comp_type == "voltage_source":
                engine.add_voltage_source(
                    comp.node1,
                    comp.node2,
                    comp.props.get("voltage", 9),
                    name=comp.id
                )
        
        return {
            "success": True,
            "netlist": engine.get_netlist()
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Netlist generation error: {str(e)}")
