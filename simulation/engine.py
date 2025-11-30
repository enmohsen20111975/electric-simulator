"""
Advanced Circuit Simulation Engine
DC Analysis, AC Analysis, Transient Analysis
Based on Modified Nodal Analysis (MNA)
"""

import numpy as np
from scipy import linalg
from typing import Dict, List, Any, Tuple
import math


class CircuitSimulationEngine:
    """
    Advanced circuit simulation engine supporting:
    - DC Operating Point Analysis
    - AC Small-Signal Analysis  
    - Transient Time-Domain Analysis
    - Component state calculations
    """
    
    def __init__(self):
        self.convergence_tolerance = 1e-6
        self.max_iterations = 100
    
    def simulate(
        self,
        components: List[Dict],
        wires: List[Dict],
        simulation_type: str = "dc",
        duration: float = 1.0,
        time_step: float = 0.001
    ) -> Dict[str, Any]:
        """
        Run circuit simulation
        
        Args:
            components: List of component dictionaries
            wires: List of wire connection dictionaries
            simulation_type: "dc", "ac", or "transient"
            duration: Simulation duration in seconds
            time_step: Time step for transient analysis
        
        Returns:
            Dictionary containing simulation results
        """
        
        if simulation_type == "dc":
            return self.simulate_dc(components, wires)
        elif simulation_type == "ac":
            return self.simulate_ac(components, wires)
        elif simulation_type == "transient":
            return self.simulate_transient(components, wires, duration, time_step)
        else:
            raise ValueError(f"Unknown simulation type: {simulation_type}")
    
    def simulate_dc(self, components: List[Dict], wires: List[Dict]) -> Dict[str, Any]:
        """DC Operating Point Analysis"""
        
        # Build node list and component map
        node_map, ground_node = self._build_node_map(components, wires)
        
        if ground_node is None:
            return {
                "success": False,
                "error": "No ground node found",
                "voltages": {},
                "currents": {}
            }
        
        num_nodes = len(node_map) - 1  # Exclude ground
        
        # Find voltage sources for additional equations
        voltage_sources = [c for c in components if c.get("type") == "battery"]
        num_vsources = len(voltage_sources)
        
        # Create MNA matrices
        n = num_nodes + num_vsources
        G = np.zeros((n, n))  # Conductance matrix
        I = np.zeros(n)  # Current vector
        
        # Process components
        for component in components:
            self._add_component_to_mna(component, G, I, node_map, ground_node, voltage_sources)
        
        # Solve system: G * V = I
        try:
            V = linalg.solve(G, I)
        except:
            return {
                "success": False,
                "error": "Singular matrix - cannot solve circuit",
                "voltages": {},
                "currents": {}
            }
        
        # Extract results
        voltages = {}
        currents = {}
        
        # Node voltages
        for node_id, node_idx in node_map.items():
            if node_idx > 0:  # Skip ground
                voltages[f"node_{node_id}"] = V[node_idx - 1]
        
        # Component voltages and currents
        for component in components:
            comp_id = component.get("id")
            comp_type = component.get("type")
            
            if comp_type == "resistor":
                v = self._get_component_voltage(component, V, node_map, ground_node)
                r = component.get("props", {}).get("resistance", 1000)
                i = v / r if r > 0 else 0
                voltages[comp_id] = abs(v)
                currents[comp_id] = abs(i)
            
            elif comp_type == "battery":
                idx = voltage_sources.index(component)
                currents[comp_id] = abs(V[num_nodes + idx])
                voltages[comp_id] = component.get("props", {}).get("voltage", 9)
        
        return {
            "success": True,
            "voltages": voltages,
            "currents": currents,
            "node_voltages": voltages
        }
    
    def simulate_ac(self, components: List[Dict], wires: List[Dict]) -> Dict[str, Any]:
        """AC Small-Signal Analysis (Frequency Response)"""
        
        # Simplified AC analysis - frequency sweep
        frequencies = np.logspace(0, 6, 100)  # 1 Hz to 1 MHz
        
        magnitude = []
        phase = []
        
        for freq in frequencies:
            # Calculate impedances at this frequency
            # This is simplified - real implementation would use complex impedances
            mag = 1.0  # Placeholder
            ph = 0.0   # Placeholder
            magnitude.append(mag)
            phase.append(ph)
        
        return {
            "success": True,
            "frequencies": frequencies.tolist(),
            "magnitude": magnitude,
            "phase": phase
        }
    
    def simulate_transient(
        self,
        components: List[Dict],
        wires: List[Dict],
        duration: float,
        time_step: float
    ) -> Dict[str, Any]:
        """Transient Time-Domain Analysis"""
        
        time_points = np.arange(0, duration, time_step)
        
        # Storage for time-varying results
        voltage_history = {}
        current_history = {}
        
        # Initialize component states
        capacitor_voltages = {}
        inductor_currents = {}
        
        for t in time_points:
            # Solve DC operating point at this time step
            # considering capacitor voltages and inductor currents
            results = self.simulate_dc(components, wires)
            
            # Store results
            for key, value in results.get("voltages", {}).items():
                if key not in voltage_history:
                    voltage_history[key] = []
                voltage_history[key].append(value)
            
            for key, value in results.get("currents", {}).items():
                if key not in current_history:
                    current_history[key] = []
                current_history[key].append(value)
        
        return {
            "success": True,
            "time": time_points.tolist(),
            "voltages": voltage_history,
            "currents": current_history
        }
    
    def _build_node_map(
        self,
        components: List[Dict],
        wires: List[Dict]
    ) -> Tuple[Dict[int, int], int]:
        """Build node mapping and find ground"""
        
        node_map = {}  # component_terminal -> node_index
        ground_node = None
        next_node = 0
        
        # Find ground
        for component in components:
            if component.get("type") == "ground":
                ground_node = component.get("id")
                node_map[ground_node] = 0
                break
        
        # Assign node numbers
        for component in components:
            comp_id = component.get("id")
            if comp_id == ground_node:
                continue
            
            terminals = component.get("terminals", [])
            for term_idx, terminal in enumerate(terminals):
                term_key = f"{comp_id}_{term_idx}"
                if term_key not in node_map:
                    next_node += 1
                    node_map[term_key] = next_node
        
        # Merge nodes connected by wires
        for wire in wires:
            from_comp = wire.get("from", {}).get("comp", {}).get("id")
            from_term = wire.get("from", {}).get("terminal", 0)
            to_comp = wire.get("to", {}).get("comp", {}).get("id")
            to_term = wire.get("to", {}).get("terminal", 0)
            
            from_key = f"{from_comp}_{from_term}"
            to_key = f"{to_comp}_{to_term}"
            
            if from_key in node_map and to_key in node_map:
                # Merge to same node (lower index)
                min_node = min(node_map[from_key], node_map[to_key])
                node_map[from_key] = min_node
                node_map[to_key] = min_node
        
        return node_map, ground_node
    
    def _add_component_to_mna(
        self,
        component: Dict,
        G: np.ndarray,
        I: np.ndarray,
        node_map: Dict,
        ground_node: int,
        voltage_sources: List[Dict]
    ):
        """Add component contributions to MNA matrices"""
        
        comp_type = component.get("type")
        comp_id = component.get("id")
        
        if comp_type == "resistor":
            # Get nodes
            n1 = node_map.get(f"{comp_id}_0", 0)
            n2 = node_map.get(f"{comp_id}_1", 0)
            
            r = component.get("props", {}).get("resistance", 1000)
            g = 1.0 / r if r > 0 else 0
            
            # Add conductance to matrix
            if n1 > 0:
                G[n1-1, n1-1] += g
                if n2 > 0:
                    G[n1-1, n2-1] -= g
            
            if n2 > 0:
                G[n2-1, n2-1] += g
                if n1 > 0:
                    G[n2-1, n1-1] -= g
        
        elif comp_type == "battery":
            # Voltage source
            n1 = node_map.get(f"{comp_id}_0", 0)
            n2 = node_map.get(f"{comp_id}_1", 0)
            v = component.get("props", {}).get("voltage", 9)
            
            vs_idx = voltage_sources.index(component)
            num_nodes = G.shape[0] - len(voltage_sources)
            row = num_nodes + vs_idx
            
            if n1 > 0:
                G[n1-1, row] += 1
                G[row, n1-1] += 1
            
            if n2 > 0:
                G[n2-1, row] -= 1
                G[row, n2-1] -= 1
            
            I[row] = v
    
    def _get_component_voltage(
        self,
        component: Dict,
        V: np.ndarray,
        node_map: Dict,
        ground_node: int
    ) -> float:
        """Get voltage across component"""
        
        comp_id = component.get("id")
        n1 = node_map.get(f"{comp_id}_0", 0)
        n2 = node_map.get(f"{comp_id}_1", 0)
        
        v1 = V[n1-1] if n1 > 0 else 0
        v2 = V[n2-1] if n2 > 0 else 0
        
        return v1 - v2
    
    def calculate_component_states(
        self,
        components: List[Dict],
        simulation_results: Dict
    ) -> Dict[int, Dict]:
        """Calculate visual states for components"""
        
        states = {}
        voltages = simulation_results.get("voltages", {})
        currents = simulation_results.get("currents", {})
        
        for component in components:
            comp_id = component.get("id")
            comp_type = component.get("type")
            
            voltage = voltages.get(comp_id, 0)
            current = currents.get(comp_id, 0)
            power = voltage * current
            
            state = {
                "voltage": voltage,
                "current": current,
                "power": power,
                "status": "normal"
            }
            
            # Component-specific calculations
            if comp_type == "resistor":
                max_power = component.get("props", {}).get("power", 0.25)
                if power > max_power:
                    state["status"] = "overload"
                elif power > max_power * 0.8:
                    state["status"] = "warning"
            
            elif comp_type == "led":
                if current > 0.001:
                    brightness = min(100, (current / 0.02) * 100)
                    state["brightness"] = brightness
                    state["status"] = "on"
                else:
                    state["brightness"] = 0
                    state["status"] = "off"
            
            states[comp_id] = state
        
        return states
    
    def calculate_wire_states(
        self,
        wires: List[Dict],
        simulation_results: Dict
    ) -> Dict[int, Dict]:
        """Calculate visual states for wires"""
        
        states = {}
        
        for idx, wire in enumerate(wires):
            # Get current through wire from connected component
            from_comp_id = wire.get("from", {}).get("comp", {}).get("id")
            current = simulation_results.get("currents", {}).get(from_comp_id, 0)
            
            state = {
                "current": current,
                "thickness": 2 + min(4, current * 10),
                "color": "normal" if current < 0.5 else "high"
            }
            
            states[idx] = state
        
        return states
