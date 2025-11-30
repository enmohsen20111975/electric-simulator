"""
Test Suite for Circuit Simulator Backend
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app import app
from database import Base, get_db

# Test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "OK"


def test_register_user():
    """Test user registration"""
    response = client.post(
        "/api/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
            "full_name": "Test User"
        }
    )
    assert response.status_code == 201
    assert response.json()["username"] == "testuser"


def test_login():
    """Test user login"""
    # Register first
    client.post(
        "/api/auth/register",
        json={
            "username": "logintest",
            "email": "login@example.com",
            "password": "password123"
        }
    )
    
    # Login
    response = client.post(
        "/api/auth/login",
        data={"username": "logintest", "password": "password123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_create_circuit():
    """Test circuit creation"""
    # Register and login
    client.post(
        "/api/auth/register",
        json={
            "username": "circuituser",
            "email": "circuit@example.com",
            "password": "password123"
        }
    )
    
    login_response = client.post(
        "/api/auth/login",
        data={"username": "circuituser", "password": "password123"}
    )
    token = login_response.json()["access_token"]
    
    # Create circuit
    response = client.post(
        "/api/circuits/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Test Circuit",
            "description": "A test circuit",
            "components": [],
            "wires": []
        }
    )
    assert response.status_code == 201
    assert response.json()["name"] == "Test Circuit"


def test_unauthorized_access():
    """Test unauthorized access to protected endpoint"""
    response = client.get("/api/circuits/")
    assert response.status_code == 401


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
