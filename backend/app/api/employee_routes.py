from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.db.deps import get_db
from app.models.employee import Employee
from app.schemas.employee_schema import EmployeeCreate, EmployeeResponse, EmployeeUpdate
from app.models.attendance import Attendance

router = APIRouter(prefix="/employees", tags=["Employees"])


# Create Employee
@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):

    # Check duplicate employee_id
    existing_employee_id = db.query(Employee).filter(
        Employee.employee_id == employee.employee_id
    ).first()

    if existing_employee_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Employee with this employee_id already exists"
        )

    # Check duplicate email
    existing_email = db.query(Employee).filter(
        Employee.email == employee.email
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Employee with this email already exists"
        )

    try:
        new_employee = Employee(**employee.dict())

        db.add(new_employee)
        db.commit()
        db.refresh(new_employee)

        return new_employee

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred while creating employee"
        )


# Get Employees with Filters
@router.get("/", response_model=list[EmployeeResponse])
def get_employees(
    employee_id: Optional[str] = Query(None),
    email: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    full_name: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):

    query = db.query(Employee)

    if employee_id:
        query = query.filter(Employee.employee_id == employee_id)

    if email:
        query = query.filter(Employee.email == email)

    if department:
        query = query.filter(Employee.department == department)

    if full_name:
        query = query.filter(Employee.full_name.ilike(f"%{full_name}%"))

    employees = query.offset(skip).limit(limit).all()

    return employees


# Get Employee by ID
@router.get("/{e_id}", response_model=EmployeeResponse)
def get_employee_by_id(e_id: int, db: Session = Depends(get_db)):

    employee = db.query(Employee).filter(Employee.id == e_id).first()

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    return employee


# Delete Employee
@router.delete("/{e_id}")
def delete_employee(e_id: int, db: Session = Depends(get_db)):

    employee = db.query(Employee).filter(Employee.id == e_id).first()

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    try:
        # delete attendance records first
        db.query(Attendance).filter(
            Attendance.employee_id == e_id
        ).delete()

        db.delete(employee)
        db.commit()

        return {"message": "Employee deleted successfully"}

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred while deleting employee"
        )
    
@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: int,
    employee_update: EmployeeUpdate,
    db: Session = Depends(get_db)
):

    employee = db.query(Employee).filter(Employee.id == employee_id).first()

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    # Check duplicate email
    if employee_update.email:
        existing_email = db.query(Employee).filter(
            Employee.email == employee_update.email,
            Employee.id != employee_id
        ).first()

        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Employee with this email already exists"
            )

    try:
        update_data = employee_update.dict(exclude_unset=True)

        for key, value in update_data.items():
            setattr(employee, key, value)

        db.commit()
        db.refresh(employee)

        return employee

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred while updating employee"
        )