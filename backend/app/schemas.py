from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class DeviceCreate(BaseModel):
    device_id: str = Field(..., min_length=1, description="Unique device identifier")
    name: str = Field(..., min_length=1, max_length=100, description="Device name")
    type: Optional[str] = Field(None, max_length=50, description="Device type")
    ip_address: Optional[str] = Field(None, description="IP address")
    location: Optional[str] = Field(None, max_length=200, description="Device location")
    status: Optional[str] = Field("active", description="Device status")

class DeviceResponse(BaseModel):
    id: int
    device_id: str
    name: str
    type: Optional[str]
    ip_address: Optional[str]
    location: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class SuccessResponse(BaseModel):
    message: str
    device: DeviceResponse
