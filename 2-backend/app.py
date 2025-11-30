"""
Circuit Simulator - Full Stack Python Backend
FastAPI + SQLAlchemy + WebSocket Support
"""

from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from contextlib import asynccontextmanager
import uvicorn
from datetime import datetime
import json
import os

from database import engine, Base, get_db
from routes import auth, circuits, users, library, simulation, components, spice_simulation, component_pricing, digital_simulation, bom_management, cost_estimation
from middleware.auth import get_current_user
from utils.websocket_manager import ConnectionManager

# Create database tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("✓ Starting Circuit Simulator API...")
    yield
    # Shutdown
    print("✓ Shutting down gracefully...")

app = FastAPI(
    title="Circuit Simulator API",
    description="Full-stack circuit simulation platform with real-time collaboration",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware - allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket manager for real-time collaboration
manager = ConnectionManager()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(circuits.router, prefix="/api/circuits", tags=["Circuits"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(library.router, prefix="/api/library", tags=["Component Library"])
app.include_router(simulation.router, prefix="/api/simulation", tags=["Simulation"])
app.include_router(spice_simulation.router, tags=["SPICE Simulation"])  # Advanced PySpice simulation
app.include_router(component_pricing.router, tags=["Component Pricing"])  # Octopart integration
app.include_router(digital_simulation.router, tags=["Digital Logic"])  # Digital logic simulation
app.include_router(bom_management.router, tags=["BOM Management"])  # Bill of Materials
app.include_router(cost_estimation.router, tags=["Cost Estimation"])  # Project cost analysis
app.include_router(components.router, tags=["Components"])  # Component database API

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {
        "status": "OK",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

# WebSocket endpoint for real-time collaboration
@app.websocket("/ws/{circuit_id}")
async def websocket_endpoint(websocket: WebSocket, circuit_id: str):
    await manager.connect(websocket, circuit_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Broadcast to all users in the same circuit
            await manager.broadcast(circuit_id, {
                "type": message.get("type"),
                "data": message.get("data"),
                "timestamp": datetime.utcnow().isoformat()
            }, exclude=websocket)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, circuit_id)

# Mount frontend static files from NEW ORGANIZED STRUCTURE
frontend_path = os.path.join(os.path.dirname(__file__), "..", "1-frontend")

# Serve the entire 1-frontend directory as static files at the root
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
    print(f"✓ Frontend served from: {frontend_path}")
else:
    print("⚠ Frontend directory not found")

# Exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "timestamp": datetime.utcnow().isoformat()}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "timestamp": datetime.utcnow().isoformat()}
    )

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8081,
        reload=True,
        log_level="info"
    )
