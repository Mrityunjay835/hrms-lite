from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from datetime import date
from sqlalchemy import func


from app.db.deps import get_db
from app.models.attendance import Attendance
from app.models.employee import Employee
from app.schemas.attendance_schema import AttendanceCreate, AttendanceResponse

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post("/", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db)):

    # Check employee exists
    employee = db.query(Employee).filter(
        Employee.id == attendance.employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    # Prevent duplicate attendance for same date
    existing_record = db.query(Attendance).filter(
        Attendance.employee_id == attendance.employee_id,
        Attendance.date == attendance.date
    ).first()

    if existing_record:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Attendance already marked for this employee on this date"
        )

    try:
        new_attendance = Attendance(**attendance.dict())

        db.add(new_attendance)
        db.commit()
        db.refresh(new_attendance)

        return new_attendance

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred while marking attendance"
        )


@router.get("/{employee_id}", response_model=list[AttendanceResponse])
def get_attendance(
    employee_id: int,
    date_filter: date | None = Query(default=None),
    db: Session = Depends(get_db)
):

    query = db.query(Attendance).filter(
        Attendance.employee_id == employee_id
    )

    if date_filter:
        query = query.filter(Attendance.date == date_filter)

    return query.all()


@router.get("/summary/{employee_id}")
def attendance_summary(employee_id: int, db: Session = Depends(get_db)):

    total_present = db.query(func.count(Attendance.id)).filter(
        Attendance.employee_id == employee_id,
        Attendance.status == "Present"
    ).scalar()

    return {
        "employee_id": employee_id,
        "total_present_days": total_present
    }