"""
Advanced SPICE Simulation Engine using PySpice
Professional-grade circuit simulation with Ngspice backend
Supports: DC, AC, Transient, Transfer Function Analysis
"""

from typing import Dict, List, Any, Optional, Tuple
import numpy as np

try:
    from PySpice.Spice.Netlist import Circuit
    from PySpice.Unit import *
    from PySpice.Spice.NgSpice.Shared import NgSpiceShared
    PYSPICE_AVAILABLE = True
except ImportError as e:
    PYSPICE_AVAILABLE = False
    Circuit = None  # Define as None when not available
    print(f"⚠️ PySpice not available: {e}")
    print("   Falling back to basic simulation mode.")
    print("   For advanced features, install: pip install PySpice ngspice")


class SPICESimulationEngine:
    """
    Advanced SPICE simulation engine wrapper
    Provides professional circuit analysis capabilities
    """
    
    def __init__(self):
        self.circuit = None
        self.simulator = None
        self.results = {}
        
        if not PYSPICE_AVAILABLE:
            raise ImportError(
                "PySpice is required for advanced simulation. "
                "Install: pip install PySpice"
            )
    
    def create_circuit(self, name: str = "CircuitSimulator"):
        """Create a new SPICE circuit"""
        if Circuit is None:
            raise ImportError("PySpice not available")
        self.circuit = Circuit(name)
        return self.circuit
    
    def add_voltage_source(
        self,
        node_plus: str,
        node_minus: str,
        voltage: float,
        name: str = "V"
    ):
        """Add DC voltage source"""
        if self.circuit is None:
            self.create_circuit()
        
        self.circuit.V(name, node_plus, node_minus, voltage @ u_V)
    
    def add_current_source(
        self,
        node_plus: str,
        node_minus: str,
        current: float,
        name: str = "I"
    ):
        """Add DC current source"""
        if self.circuit is None:
            self.create_circuit()
        
        self.circuit.I(name, node_plus, node_minus, current @ u_A)
    
    def add_resistor(
        self,
        node1: str,
        node2: str,
        resistance: float,
        name: str = "R"
    ):
        """Add resistor"""
        if self.circuit is None:
            self.create_circuit()
        
        self.circuit.R(name, node1, node2, resistance @ u_Ω)
    
    def add_capacitor(
        self,
        node1: str,
        node2: str,
        capacitance: float,
        name: str = "C",
        initial_voltage: float = 0
    ):
        """Add capacitor"""
        if self.circuit is None:
            self.create_circuit()
        
        if initial_voltage == 0:
            self.circuit.C(name, node1, node2, capacitance @ u_F)
        else:
            self.circuit.C(name, node1, node2, capacitance @ u_F, initial_condition=initial_voltage @ u_V)
    
    def add_inductor(
        self,
        node1: str,
        node2: str,
        inductance: float,
        name: str = "L",
        initial_current: float = 0
    ):
        """Add inductor"""
        if self.circuit is None:
            self.create_circuit()
        
        if initial_current == 0:
            self.circuit.L(name, node1, node2, inductance @ u_H)
        else:
            self.circuit.L(name, node1, node2, inductance @ u_H, initial_condition=initial_current @ u_A)
    
    def add_diode(
        self,
        node_anode: str,
        node_cathode: str,
        name: str = "D",
        model: str = "1N4148"
    ):
        """Add diode with model"""
        if self.circuit is None:
            self.create_circuit()
        
        # Define diode model
        self.circuit.model(model, 'D', IS=1e-14, RS=0.1, N=1.0, BV=100, IBV=1e-3)
        self.circuit.Diode(name, node_anode, node_cathode, model=model)
    
    def add_bjt(
        self,
        node_collector: str,
        node_base: str,
        node_emitter: str,
        name: str = "Q",
        model: str = "2N2222",
        bjt_type: str = "npn"
    ):
        """Add BJT transistor"""
        if self.circuit is None:
            self.create_circuit()
        
        # Define BJT model
        if bjt_type.lower() == "npn":
            self.circuit.model(model, 'NPN', BF=200, IS=1e-14, VAF=100)
            self.circuit.BJT(name, node_collector, node_base, node_emitter, model=model)
        else:
            self.circuit.model(model, 'PNP', BF=200, IS=1e-14, VAF=100)
            self.circuit.BJT(name, node_collector, node_base, node_emitter, model=model)
    
    def add_mosfet(
        self,
        node_drain: str,
        node_gate: str,
        node_source: str,
        node_bulk: str,
        name: str = "M",
        model: str = "NMOS",
        mosfet_type: str = "nmos"
    ):
        """Add MOSFET transistor"""
        if self.circuit is None:
            self.create_circuit()
        
        # Define MOSFET model
        if mosfet_type.lower() == "nmos":
            self.circuit.model(model, 'NMOS', VTO=0.7, KP=2e-4)
            self.circuit.MOSFET(name, node_drain, node_gate, node_source, node_bulk, model=model)
        else:
            self.circuit.model(model, 'PMOS', VTO=-0.7, KP=2e-4)
            self.circuit.MOSFET(name, node_drain, node_gate, node_source, node_bulk, model=model)
    
    def add_opamp(
        self,
        node_out: str,
        node_plus: str,
        node_minus: str,
        name: str = "X",
        model: str = "LM358"
    ):
        """Add operational amplifier subcircuit"""
        if self.circuit is None:
            self.create_circuit()
        
        # Simplified opamp model with voltage-controlled voltage source
        # Real implementation would use SPICE subcircuit
        gain = 100000  # Open-loop gain
        self.circuit.VCVS(name, node_out, '0', node_plus, node_minus, gain)
    
    def simulate_dc(self) -> Dict[str, Any]:
        """
        Run DC Operating Point Analysis
        Returns node voltages and branch currents
        """
        if self.circuit is None:
            return {"success": False, "error": "No circuit defined"}
        
        try:
            simulator = self.circuit.simulator(temperature=25, nominal_temperature=25)
            analysis = simulator.operating_point()
            
            # Extract results
            voltages = {}
            currents = {}
            
            for node in analysis.nodes.values():
                voltages[str(node)] = float(node)
            
            for branch in analysis.branches.values():
                currents[str(branch)] = float(branch)
            
            self.results = {
                "success": True,
                "analysis_type": "dc",
                "voltages": voltages,
                "currents": currents
            }
            
            return self.results
            
        except Exception as e:
            return {
                "success": False,
                "error": f"DC simulation failed: {str(e)}"
            }
    
    def simulate_ac(
        self,
        start_frequency: float = 1,
        stop_frequency: float = 1e6,
        points_per_decade: int = 10,
        variation: str = 'dec'
    ) -> Dict[str, Any]:
        """
        Run AC Small-Signal Analysis
        Returns frequency response (magnitude and phase)
        """
        if self.circuit is None:
            return {"success": False, "error": "No circuit defined"}
        
        try:
            simulator = self.circuit.simulator(temperature=25, nominal_temperature=25)
            analysis = simulator.ac(
                start_frequency=start_frequency @ u_Hz,
                stop_frequency=stop_frequency @ u_Hz,
                number_of_points=points_per_decade,
                variation=variation
            )
            
            # Extract frequency response
            frequencies = np.array(analysis.frequency)
            
            # Get magnitude and phase for each node
            response = {}
            for node_name in analysis.nodes:
                node_data = analysis[node_name]
                magnitude = np.abs(node_data)
                phase = np.angle(node_data, deg=True)
                
                response[str(node_name)] = {
                    "magnitude": magnitude.tolist(),
                    "phase": phase.tolist()
                }
            
            self.results = {
                "success": True,
                "analysis_type": "ac",
                "frequencies": frequencies.tolist(),
                "response": response
            }
            
            return self.results
            
        except Exception as e:
            return {
                "success": False,
                "error": f"AC simulation failed: {str(e)}"
            }
    
    def simulate_transient(
        self,
        step_time: float = 1e-6,
        end_time: float = 1e-3,
        start_time: float = 0,
        max_time: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Run Transient Time-Domain Analysis
        Returns time-varying voltages and currents
        """
        if self.circuit is None:
            return {"success": False, "error": "No circuit defined"}
        
        try:
            simulator = self.circuit.simulator(temperature=25, nominal_temperature=25)
            analysis = simulator.transient(
                step_time=step_time @ u_s,
                end_time=end_time @ u_s,
                start_time=start_time @ u_s,
                max_time=max_time @ u_s if max_time else None
            )
            
            # Extract time-domain results
            time = np.array(analysis.time)
            
            voltages = {}
            for node_name in analysis.nodes:
                voltages[str(node_name)] = np.array(analysis[node_name]).tolist()
            
            currents = {}
            for branch_name in analysis.branches:
                currents[str(branch_name)] = np.array(analysis[branch_name]).tolist()
            
            self.results = {
                "success": True,
                "analysis_type": "transient",
                "time": time.tolist(),
                "voltages": voltages,
                "currents": currents
            }
            
            return self.results
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Transient simulation failed: {str(e)}"
            }
    
    def get_netlist(self) -> str:
        """Get SPICE netlist representation"""
        if self.circuit is None:
            return ""
        
        return str(self.circuit)
    
    def load_from_json(self, circuit_data: Dict[str, Any]) -> bool:
        """
        Load circuit from JSON format
        Compatible with circuit-simulator frontend
        """
        try:
            self.create_circuit(circuit_data.get("name", "Circuit"))
            
            components = circuit_data.get("components", [])
            
            for comp in components:
                comp_type = comp.get("type", "").lower()
                comp_id = comp.get("id", "")
                props = comp.get("props", {})
                
                # Map component types to SPICE elements
                if comp_type == "resistor":
                    self.add_resistor(
                        comp.get("node1", "1"),
                        comp.get("node2", "0"),
                        props.get("resistance", 1000),
                        name=comp_id
                    )
                
                elif comp_type == "capacitor":
                    self.add_capacitor(
                        comp.get("node1", "1"),
                        comp.get("node2", "0"),
                        props.get("capacitance", 1e-6),
                        name=comp_id
                    )
                
                elif comp_type == "inductor":
                    self.add_inductor(
                        comp.get("node1", "1"),
                        comp.get("node2", "0"),
                        props.get("inductance", 1e-3),
                        name=comp_id
                    )
                
                elif comp_type == "battery":
                    self.add_voltage_source(
                        comp.get("node1", "1"),
                        comp.get("node2", "0"),
                        props.get("voltage", 9),
                        name=comp_id
                    )
                
                elif comp_type == "diode":
                    self.add_diode(
                        comp.get("node1", "1"),
                        comp.get("node2", "0"),
                        name=comp_id
                    )
            
            return True
            
        except Exception as e:
            print(f"Error loading circuit: {e}")
            return False


# Fallback basic simulation if PySpice not available
class BasicSimulationEngine:
    """Basic simulation fallback when PySpice not available"""
    
    def __init__(self):
        self.results = {}
    
    def simulate_dc(self) -> Dict[str, Any]:
        return {
            "success": False,
            "error": "PySpice not installed. Install for advanced simulation."
        }
    
    def simulate_ac(self, *args, **kwargs) -> Dict[str, Any]:
        return self.simulate_dc()
    
    def simulate_transient(self, *args, **kwargs) -> Dict[str, Any]:
        return self.simulate_dc()


# Factory function
def create_simulation_engine():
    """Create appropriate simulation engine based on availability"""
    if PYSPICE_AVAILABLE:
        return SPICESimulationEngine()
    else:
        return BasicSimulationEngine()
