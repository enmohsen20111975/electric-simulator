"""
WebSocket Connection Manager
Real-time collaboration support
"""

from fastapi import WebSocket
from typing import Dict, List, Set
import json


class ConnectionManager:
    def __init__(self):
        # circuit_id -> set of websocket connections
        self.active_connections: Dict[str, Set[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, circuit_id: str):
        """Connect a websocket to a circuit room"""
        await websocket.accept()
        
        if circuit_id not in self.active_connections:
            self.active_connections[circuit_id] = set()
        
        self.active_connections[circuit_id].add(websocket)
        print(f"✓ Client connected to circuit {circuit_id}. Total: {len(self.active_connections[circuit_id])}")
    
    def disconnect(self, websocket: WebSocket, circuit_id: str):
        """Disconnect a websocket from a circuit room"""
        if circuit_id in self.active_connections:
            self.active_connections[circuit_id].discard(websocket)
            
            if not self.active_connections[circuit_id]:
                del self.active_connections[circuit_id]
            
            print(f"✓ Client disconnected from circuit {circuit_id}")
    
    async def broadcast(self, circuit_id: str, message: dict, exclude: WebSocket = None):
        """Broadcast message to all clients in a circuit room"""
        if circuit_id not in self.active_connections:
            return
        
        disconnected = []
        
        for connection in self.active_connections[circuit_id]:
            if connection == exclude:
                continue
            
            try:
                await connection.send_text(json.dumps(message))
            except:
                disconnected.append(connection)
        
        # Clean up disconnected clients
        for connection in disconnected:
            self.disconnect(connection, circuit_id)
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Send message to specific client"""
        try:
            await websocket.send_text(json.dumps(message))
        except:
            pass
    
    def get_room_size(self, circuit_id: str) -> int:
        """Get number of connected clients in a room"""
        return len(self.active_connections.get(circuit_id, set()))
