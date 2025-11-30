"""
Digital Logic Simulation Engine
Supports combinational and sequential logic circuits
Based on event-driven simulation with proper timing
"""

from typing import Dict, List, Any, Optional, Set, Tuple
from enum import Enum
from collections import deque
import time


class LogicLevel(Enum):
    """Logic signal levels"""
    LOW = 0
    HIGH = 1
    UNKNOWN = -1
    HIGH_Z = -2  # High impedance


class GateType(Enum):
    """Digital logic gate types"""
    AND = "AND"
    OR = "OR"
    NOT = "NOT"
    NAND = "NAND"
    NOR = "NOR"
    XOR = "XOR"
    XNOR = "XNOR"
    BUFFER = "BUFFER"
    
    # Sequential elements
    DFF = "D_FLIP_FLOP"
    JKFF = "JK_FLIP_FLOP"
    LATCH = "LATCH"
    
    # Complex
    MULTIPLEXER = "MUX"
    DECODER = "DECODER"
    ENCODER = "ENCODER"


class LogicGate:
    """Base class for logic gates"""
    
    def __init__(self, gate_id: str, gate_type: GateType, num_inputs: int = 2, propagation_delay: float = 0.001):
        self.id = gate_id
        self.type = gate_type
        self.num_inputs = num_inputs
        self.inputs = [LogicLevel.UNKNOWN] * num_inputs
        self.output = LogicLevel.UNKNOWN
        self.propagation_delay = propagation_delay  # In seconds
        self.last_update_time = 0.0
    
    def evaluate(self) -> LogicLevel:
        """Evaluate gate output based on inputs"""
        
        # Check if any input is unknown
        if LogicLevel.UNKNOWN in self.inputs:
            return LogicLevel.UNKNOWN
        
        if self.type == GateType.AND:
            return LogicLevel.HIGH if all(i == LogicLevel.HIGH for i in self.inputs) else LogicLevel.LOW
        
        elif self.type == GateType.OR:
            return LogicLevel.HIGH if any(i == LogicLevel.HIGH for i in self.inputs) else LogicLevel.LOW
        
        elif self.type == GateType.NOT:
            return LogicLevel.HIGH if self.inputs[0] == LogicLevel.LOW else LogicLevel.LOW
        
        elif self.type == GateType.NAND:
            and_result = all(i == LogicLevel.HIGH for i in self.inputs)
            return LogicLevel.LOW if and_result else LogicLevel.HIGH
        
        elif self.type == GateType.NOR:
            or_result = any(i == LogicLevel.HIGH for i in self.inputs)
            return LogicLevel.LOW if or_result else LogicLevel.HIGH
        
        elif self.type == GateType.XOR:
            high_count = sum(1 for i in self.inputs if i == LogicLevel.HIGH)
            return LogicLevel.HIGH if high_count % 2 == 1 else LogicLevel.LOW
        
        elif self.type == GateType.XNOR:
            high_count = sum(1 for i in self.inputs if i == LogicLevel.HIGH)
            return LogicLevel.LOW if high_count % 2 == 1 else LogicLevel.HIGH
        
        elif self.type == GateType.BUFFER:
            return self.inputs[0]
        
        return LogicLevel.UNKNOWN
    
    def set_input(self, input_index: int, value: LogicLevel):
        """Set input value"""
        if 0 <= input_index < self.num_inputs:
            self.inputs[input_index] = value
    
    def update(self, current_time: float) -> bool:
        """
        Update gate output
        Returns True if output changed
        """
        new_output = self.evaluate()
        
        if new_output != self.output:
            self.output = new_output
            self.last_update_time = current_time
            return True
        
        return False


class FlipFlop:
    """D Flip-Flop with clock edge triggering"""
    
    def __init__(self, ff_id: str, edge_trigger: str = "rising"):
        self.id = ff_id
        self.edge_trigger = edge_trigger  # "rising" or "falling"
        
        self.d_input = LogicLevel.UNKNOWN
        self.clock = LogicLevel.LOW
        self.previous_clock = LogicLevel.LOW
        
        self.q_output = LogicLevel.LOW
        self.q_not_output = LogicLevel.HIGH
        
        self.setup_time = 0.0001  # 0.1ms
        self.hold_time = 0.0001
        self.propagation_delay = 0.001
    
    def set_d(self, value: LogicLevel):
        """Set D input"""
        self.d_input = value
    
    def set_clock(self, value: LogicLevel):
        """Set clock signal"""
        self.previous_clock = self.clock
        self.clock = value
    
    def update(self) -> bool:
        """
        Update flip-flop on clock edge
        Returns True if output changed
        """
        edge_detected = False
        
        if self.edge_trigger == "rising":
            edge_detected = (self.previous_clock == LogicLevel.LOW and 
                           self.clock == LogicLevel.HIGH)
        elif self.edge_trigger == "falling":
            edge_detected = (self.previous_clock == LogicLevel.HIGH and 
                           self.clock == LogicLevel.LOW)
        
        if edge_detected:
            # Capture D input on clock edge
            new_q = self.d_input
            
            if new_q != self.q_output:
                self.q_output = new_q
                self.q_not_output = LogicLevel.HIGH if new_q == LogicLevel.LOW else LogicLevel.LOW
                return True
        
        return False


class Wire:
    """Wire connection between gates"""
    
    def __init__(self, wire_id: str, from_gate: str, from_output: str, to_gate: str, to_input: int):
        self.id = wire_id
        self.from_gate = from_gate
        self.from_output = from_output
        self.to_gate = to_gate
        self.to_input = to_input
        self.signal = LogicLevel.UNKNOWN


class DigitalCircuitSimulator:
    """
    Event-driven digital logic simulator
    Supports combinational and sequential circuits
    """
    
    def __init__(self):
        self.gates: Dict[str, LogicGate] = {}
        self.flip_flops: Dict[str, FlipFlop] = {}
        self.wires: List[Wire] = []
        self.inputs: Dict[str, LogicLevel] = {}
        self.outputs: Dict[str, LogicLevel] = {}
        
        self.event_queue = deque()
        self.current_time = 0.0
        self.simulation_results = []
    
    def add_gate(self, gate_id: str, gate_type: GateType, num_inputs: int = 2, delay: float = 0.001):
        """Add logic gate to circuit"""
        gate = LogicGate(gate_id, gate_type, num_inputs, delay)
        self.gates[gate_id] = gate
    
    def add_flip_flop(self, ff_id: str, edge_trigger: str = "rising"):
        """Add D flip-flop to circuit"""
        ff = FlipFlop(ff_id, edge_trigger)
        self.flip_flops[ff_id] = ff
    
    def add_wire(self, wire_id: str, from_gate: str, from_output: str, to_gate: str, to_input: int):
        """Add wire connection"""
        wire = Wire(wire_id, from_gate, from_output, to_gate, to_input)
        self.wires.append(wire)
    
    def set_input(self, input_name: str, value: LogicLevel):
        """Set circuit input"""
        self.inputs[input_name] = value
    
    def propagate(self):
        """Propagate signals through the circuit"""
        
        # Update gate inputs from wires
        for wire in self.wires:
            from_gate = self.gates.get(wire.from_gate)
            to_gate = self.gates.get(wire.to_gate)
            
            if from_gate and to_gate:
                wire.signal = from_gate.output
                to_gate.set_input(wire.to_input, wire.signal)
        
        # Update all gates
        changes = True
        iterations = 0
        max_iterations = 100
        
        while changes and iterations < max_iterations:
            changes = False
            iterations += 1
            
            for gate in self.gates.values():
                if gate.update(self.current_time):
                    changes = True
            
            # Propagate changes through wires
            for wire in self.wires:
                from_gate = self.gates.get(wire.from_gate)
                to_gate = self.gates.get(wire.to_gate)
                
                if from_gate and to_gate:
                    wire.signal = from_gate.output
                    to_gate.set_input(wire.to_input, wire.signal)
        
        if iterations >= max_iterations:
            print(f"⚠️ Warning: Circuit may have combinational loop or oscillation")
    
    def simulate_clock_cycle(self, clock_signal: str, num_cycles: int = 1):
        """Simulate sequential circuit for N clock cycles"""
        
        results = []
        
        for cycle in range(num_cycles):
            # Rising edge
            self.set_input(clock_signal, LogicLevel.HIGH)
            self.propagate()
            
            # Update flip-flops on rising edge
            for ff in self.flip_flops.values():
                ff.update()
            
            # Record state
            state = {
                "cycle": cycle,
                "edge": "rising",
                "gates": {gid: g.output.value for gid, g in self.gates.items()},
                "flip_flops": {fid: ff.q_output.value for fid, ff in self.flip_flops.items()}
            }
            results.append(state)
            
            # Falling edge
            self.set_input(clock_signal, LogicLevel.LOW)
            self.propagate()
            
            # Update flip-flops on falling edge (if needed)
            for ff in self.flip_flops.values():
                ff.update()
            
            state = {
                "cycle": cycle,
                "edge": "falling",
                "gates": {gid: g.output.value for gid, g in self.gates.items()},
                "flip_flops": {fid: ff.q_output.value for fid, ff in self.flip_flops.items()}
            }
            results.append(state)
        
        return results
    
    def simulate(self, duration: float = 0.001, time_step: float = 0.0001) -> Dict[str, Any]:
        """
        Simulate circuit for specified duration
        
        Args:
            duration: Simulation duration in seconds
            time_step: Time step for sampling
        
        Returns:
            Simulation results with timing information
        """
        
        results = []
        self.current_time = 0.0
        
        while self.current_time <= duration:
            # Propagate current state
            self.propagate()
            
            # Record state
            state = {
                "time": self.current_time,
                "inputs": {name: level.value for name, level in self.inputs.items()},
                "gates": {gid: g.output.value for gid, g in self.gates.items()},
                "flip_flops": {fid: ff.q_output.value for fid, ff in self.flip_flops.items()},
                "wires": {w.id: w.signal.value for w in self.wires}
            }
            results.append(state)
            
            self.current_time += time_step
        
        return {
            "success": True,
            "simulation_type": "digital_logic",
            "duration": duration,
            "time_step": time_step,
            "samples": len(results),
            "results": results
        }
    
    def get_truth_table(self, input_names: List[str], output_names: List[str]) -> List[Dict]:
        """
        Generate truth table for combinational circuit
        
        Args:
            input_names: List of input signal names
            output_names: List of output gate IDs
        
        Returns:
            Truth table as list of dictionaries
        """
        
        num_inputs = len(input_names)
        num_combinations = 2 ** num_inputs
        truth_table = []
        
        for i in range(num_combinations):
            # Set input combination
            input_values = {}
            for j, input_name in enumerate(input_names):
                bit = (i >> j) & 1
                level = LogicLevel.HIGH if bit else LogicLevel.LOW
                self.set_input(input_name, level)
                
                # Apply to corresponding gate
                if input_name in self.gates:
                    self.gates[input_name].output = level
                
                input_values[input_name] = bit
            
            # Propagate
            self.propagate()
            
            # Read outputs
            output_values = {}
            for output_name in output_names:
                if output_name in self.gates:
                    output_values[output_name] = self.gates[output_name].output.value
            
            truth_table.append({
                "inputs": input_values,
                "outputs": output_values
            })
        
        return truth_table
    
    def to_json(self) -> Dict[str, Any]:
        """Export circuit to JSON"""
        return {
            "gates": [
                {
                    "id": g.id,
                    "type": g.type.value,
                    "num_inputs": g.num_inputs,
                    "delay": g.propagation_delay
                }
                for g in self.gates.values()
            ],
            "flip_flops": [
                {
                    "id": ff.id,
                    "edge_trigger": ff.edge_trigger
                }
                for ff in self.flip_flops.values()
            ],
            "wires": [
                {
                    "id": w.id,
                    "from": w.from_gate,
                    "to": w.to_gate,
                    "to_input": w.to_input
                }
                for w in self.wires
            ]
        }


def create_digital_simulator() -> DigitalCircuitSimulator:
    """Factory function to create digital logic simulator"""
    return DigitalCircuitSimulator()
