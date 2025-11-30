"""
Run Development Server
Quick start script for local development
"""

import uvicorn
import os

if __name__ == "__main__":
    # Set development environment
    os.environ.setdefault("NODE_ENV", "development")
    
    print("=" * 60)
    print("🚀 Circuit Simulator - Development Server")
    print("=" * 60)
    print()
    print("📍 API Server: http://localhost:8081")
    print("📚 API Docs: http://localhost:8081/docs")
    print("📖 ReDoc: http://localhost:8081/redoc")
    print()
    print("🔐 Demo Account:")
    print("   Username: demo")
    print("   Password: demo123")
    print()
    print("=" * 60)
    print()
    
    uvicorn.run(
        "app:app",
        host="127.0.0.1",
        port=8081,
        reload=True,
        log_level="info"
    )
