from fastapi import FastAPI
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware

from app.db.session import engine, Base
from app.models.employee import Employee
from app.models.attendance import Attendance

from app.api.employee_routes import router as employee_router
from app.api.attendance_routes import router as attendance_router
from app.api.dashboard_routes import router as dashboard_router
from app.utils.exceptions import register_exception_handlers

app = FastAPI(
    title="Human Resource Management System API",
    version="1.0.0",
    description="Lightweight HRMS for employee and attendance management"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
register_exception_handlers(app)

# Create all database tables
Base.metadata.create_all(bind=engine)

# Register routers
app.include_router(employee_router)
app.include_router(attendance_router)
app.include_router(dashboard_router)




@app.get("/")
def root():
    return {"message": "HRMS API running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/db-test")
def db_test():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"database": "connected"}