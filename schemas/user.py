"""
User Schemas
"""

from pydantic import BaseModel, EmailStr
from typing import Optional


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None


class UserResponse(BaseModel):
    id: int
    username: str
    email: Optional[str] = None
    full_name: Optional[str]
    
    class Config:
        from_attributes = True
