from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from app.database import engine, get_db, Base
from app.models import DeviceDB
from app.schemas import DeviceCreate, DeviceResponse, SuccessResponse

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Device Management API",
    version="1.0.0",
    description="API for managing devices in the system"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "Device Management API is running"}

@app.post("/devices/", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
def create_device(device: DeviceCreate, db: Session = Depends(get_db)):
    """Create a new device"""
    try:
        # Check for duplicate device_id
        existing_device = db.query(DeviceDB).filter(DeviceDB.device_id == device.device_id).first()
        if existing_device:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Device with device_id '{device.device_id}' already exists"
            )
        
        # Create new device
        db_device = DeviceDB(**device.model_dump())
        db.add(db_device)
        db.commit()
        db.refresh(db_device)
        
        return SuccessResponse(
            message="Device created successfully",
            device=DeviceResponse.model_validate(db_device)
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create device: {str(e)}"
        )
    finally:
        pass

@app.get("/devices/", response_model=List[DeviceResponse])
def get_all_devices(db: Session = Depends(get_db)):
    """Get all devices ordered by creation date (newest first)"""
    try:
        devices = db.query(DeviceDB).order_by(DeviceDB.created_at.desc()).all()
        return [DeviceResponse.model_validate(device) for device in devices]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch devices: {str(e)}"
        )

@app.get("/devices/{device_id}", response_model=DeviceResponse)
def get_device(device_id: str, db: Session = Depends(get_db)):
    """Get a specific device by device_id"""
    try:
        device = db.query(DeviceDB).filter(DeviceDB.device_id == device_id).first()
        if not device:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Device with device_id '{device_id}' not found"
            )
        return DeviceResponse.model_validate(device)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch device: {str(e)}"
        )

@app.delete("/devices/{device_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_device(device_id: str, db: Session = Depends(get_db)):
    """Delete a device by device_id"""
    try:
        device = db.query(DeviceDB).filter(DeviceDB.device_id == device_id).first()
        if not device:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Device with device_id '{device_id}' not found"
            )
        db.delete(device)
        db.commit()
        return None
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete device: {str(e)}"
        )
    finally:
        pass
