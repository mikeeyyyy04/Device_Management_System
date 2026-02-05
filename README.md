# Device Management System

A full-stack device management application built with FastAPI (backend), React (frontend), and PostgreSQL (database). This system allows you to manage devices with CRUD operations, including adding, viewing, and deleting devices through an intuitive web interface.

## 🌟 Features

### Backend (FastAPI + PostgreSQL)
- ✅ RESTful API with FastAPI
- ✅ PostgreSQL database with SQLAlchemy ORM
- ✅ Pydantic data validation
- ✅ Duplicate device_id detection (409 Conflict)
- ✅ CORS enabled for cross-origin requests
- ✅ Automatic API documentation (Swagger/OpenAPI)
- ✅ Health check endpoint

### Frontend (React + Vite + Ant Design)
- ✅ Modern React 18 with Vite
- ✅ Ant Design UI components
- ✅ Device form with validation
- ✅ Device list with sorting, filtering, and pagination
- ✅ Real-time success/error messages
- ✅ Auto-refresh after adding devices
- ✅ Delete confirmation dialogs
- ✅ Responsive design

## 🚀 Quick Start

### Prerequisites
- Docker (20.10+)
- Docker Compose (2.0+)

### Installation & Running

1. **Clone the repository**
   ```bash
   git clone https://github.com/mikeeyyyy04/Device_Management_System.git
   cd Device_Management_System
   ```

2. **Run the application**
   ```bash
   ./run.sh
   ```

   This script will:
   - Check Docker installation
   - Stop any existing containers
   - Build and start all services
   - Display access points and useful commands

3. **Access the application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs
   - **Database**: localhost:5432

## 📁 Project Structure

```
device-management-system/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── __init__.py        # Package initializer
│   │   ├── main.py            # FastAPI app & endpoints
│   │   ├── models.py          # SQLAlchemy models
│   │   ├── schemas.py         # Pydantic schemas
│   │   └── database.py        # Database connection
│   ├── Dockerfile             # Backend container config
│   └── requirements.txt       # Python dependencies
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── main.jsx           # React entry point
│   │   ├── App.jsx            # Main App component
│   │   ├── App.css            # Global styles
│   │   ├── index.css          # Base styles
│   │   ├── components/
│   │   │   ├── DeviceForm.jsx # Add device form
│   │   │   └── DeviceList.jsx # Device table/list
│   │   └── services/
│   │       └── api.js         # Axios API client
│   ├── index.html             # HTML template
│   ├── package.json           # Node dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── .env                   # Environment variables
│   ├── .env.example           # Example env file
│   └── Dockerfile             # Frontend container config
├── docker-compose.yml         # Multi-container orchestration
├── run.sh                     # Startup script
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🧪 Testing the Application

### Testing via UI

1. **Open the frontend**: http://localhost:5173

2. **Add a device**:
   - Fill in the "Add New Device" form
   - Required fields: Device ID, Device Name
   - Optional fields: Type, IP Address, Location, Status
   - Click "Add Device"
   - You should see a success message

3. **View devices**:
   - The device list will automatically refresh
   - You can sort by any column
   - Filter by status (Active, Inactive, Maintenance)
   - Paginate through results (10 per page)

4. **Test duplicate detection**:
   - Try adding a device with the same Device ID
   - You should see an error: "Duplicate device: Device with device_id 'XXX' already exists"

5. **Delete a device**:
   - Click the "Delete" button on any device
   - Confirm the deletion in the popup
   - The device list will refresh automatically

### Testing via API (cURL)

1. **Health check**:
   ```bash
   curl http://localhost:8000/
   ```

2. **Add a device**:
   ```bash
   curl -X POST http://localhost:8000/devices/ \
     -H "Content-Type: application/json" \
     -d '{
       "device_id": "DEV-001",
       "name": "Main Server",
       "type": "server",
       "ip_address": "192.168.1.100",
       "location": "Server Room A",
       "status": "active"
     }'
   ```

3. **Get all devices**:
   ```bash
   curl http://localhost:8000/devices/
   ```

4. **Get a specific device**:
   ```bash
   curl http://localhost:8000/devices/DEV-001
   ```

5. **Delete a device**:
   ```bash
   curl -X DELETE http://localhost:8000/devices/DEV-001
   ```

6. **Test duplicate (should return 409)**:
   ```bash
   # Add a device first, then try adding it again
   curl -X POST http://localhost:8000/devices/ \
     -H "Content-Type: application/json" \
     -d '{
       "device_id": "DEV-001",
       "name": "Main Server",
       "type": "server"
     }'
   # Try adding the same device again - should fail with 409
   curl -X POST http://localhost:8000/devices/ \
     -H "Content-Type: application/json" \
     -d '{
       "device_id": "DEV-001",
       "name": "Another Server",
       "type": "server"
     }'
   ```

## 🔧 Management Commands

### View logs
```bash
docker-compose logs -f          # All services
docker-compose logs -f backend  # Backend only
docker-compose logs -f frontend # Frontend only
docker-compose logs -f postgres # Database only
```

### Stop services
```bash
docker-compose down
```

### Restart services
```bash
docker-compose restart
```

### Rebuild and restart
```bash
docker-compose up -d --build
```

### View service status
```bash
docker-compose ps
```

### Access database
```bash
docker exec -it devices_db psql -U deviceuser -d devices_db
```

### Clean everything (including volumes)
```bash
docker-compose down -v
```

## 💾 Database Schema

### `devices` Table

| Column       | Type      | Constraints                    | Description            |
|--------------|-----------|--------------------------------|------------------------|
| id           | Integer   | Primary Key, Auto-increment    | Unique identifier      |
| device_id    | String    | Unique, Not Null, Indexed      | Device identifier      |
| name         | String    | Not Null                       | Device name            |
| type         | String    | Nullable                       | Device type            |
| ip_address   | String    | Nullable                       | IP address             |
| location     | String    | Nullable                       | Physical location      |
| status       | String    | Default: 'active'              | Device status          |
| created_at   | DateTime  | Default: UTC now               | Creation timestamp     |

## 🔄 Complete Workflow

The system follows this complete workflow as per requirements:

1. **User opens browser** → `http://192.168.1.100:5173` (or localhost:5173)

2. **Frontend loads** → React application with Ant Design components

3. **User interacts** → Clicks "Add Device", fills form, clicks "Submit"

4. **Frontend sends request** → Axios HTTP POST to `http://192.168.1.100:8000/devices/` with JSON device data

5. **Backend receives request** → FastAPI endpoint catches request, Pydantic validates data format, checks for duplicate device_id

6. **Database operation** → SQLAlchemy creates SQL query, PostgreSQL stores data in table, returns success/failure

7. **Backend sends response** → Formats data as JSON, sends back to frontend, HTTP Status: 201 (Created)

8. **Frontend updates UI** → Shows success message, refreshes device list, user sees new device in table

9. **Done** ✅

## 🛠️ Tech Stack

### Backend
- **FastAPI** (0.109.0) - Modern, fast web framework
- **Uvicorn** (0.27.0) - ASGI server
- **SQLAlchemy** (2.0.25) - SQL toolkit and ORM
- **Pydantic** (2.5.0) - Data validation
- **PostgreSQL** (16) - Database
- **psycopg2-binary** (2.9.9) - PostgreSQL adapter

### Frontend
- **React** (18.2.0) - UI library
- **Vite** (5.0.0) - Build tool
- **Ant Design** (5.12.0) - UI component library
- **Axios** (1.6.0) - HTTP client

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **PostgreSQL** (16-alpine) - Database

## 📡 API Endpoints

| Method | Endpoint            | Description                  | Status Codes       |
|--------|---------------------|------------------------------|-------------------|
| GET    | `/`                 | Health check                 | 200               |
| POST   | `/devices/`         | Create a new device          | 201, 409, 500     |
| GET    | `/devices/`         | Get all devices              | 200, 500          |
| GET    | `/devices/{id}`     | Get device by device_id      | 200, 404, 500     |
| DELETE | `/devices/{id}`     | Delete device by device_id   | 204, 404, 500     |

### Response Examples

**POST /devices/ (Success - 201)**
```json
{
  "message": "Device created successfully",
  "device": {
    "id": 1,
    "device_id": "DEV-001",
    "name": "Main Server",
    "type": "server",
    "ip_address": "192.168.1.100",
    "location": "Server Room A",
    "status": "active",
    "created_at": "2024-01-01T12:00:00"
  }
}
```

**POST /devices/ (Duplicate - 409)**
```json
{
  "detail": "Device with device_id 'DEV-001' already exists"
}
```

**GET /devices/ (Success - 200)**
```json
[
  {
    "id": 1,
    "device_id": "DEV-001",
    "name": "Main Server",
    "type": "server",
    "ip_address": "192.168.1.100",
    "location": "Server Room A",
    "status": "active",
    "created_at": "2024-01-01T12:00:00"
  }
]
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Check what's using the port
sudo lsof -i :5173  # Frontend
sudo lsof -i :8000  # Backend
sudo lsof -i :5432  # Database

# Kill the process or stop existing containers
docker-compose down
```

### Frontend can't connect to backend
- Check that backend is running: `docker-compose ps`
- Verify the `VITE_API_URL` in `frontend/.env`
- Check CORS settings in backend
- View backend logs: `docker-compose logs backend`

### Database connection issues
- Wait for PostgreSQL to be healthy: `docker-compose ps`
- Check database logs: `docker-compose logs postgres`
- Verify DATABASE_URL environment variable

### Containers won't start
```bash
# Clean everything and rebuild
docker-compose down -v
docker-compose up -d --build
```

### View detailed error logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🌐 Using Different IP Addresses

To use a different IP address (e.g., 192.168.1.100):

1. Update `frontend/.env`:
   ```
   VITE_API_URL=http://192.168.1.100:8000
   ```

2. Restart the frontend:
   ```bash
   docker-compose restart frontend
   ```

3. Access the application:
   - Frontend: http://192.168.1.100:5173
   - Backend: http://192.168.1.100:8000

## 📄 License

This project is open source and available under the MIT License.

---

**Created with ❤️ using FastAPI, React, and PostgreSQL**
