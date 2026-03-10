from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from sqlalchemy import func


from app.db.deps import get_db
from app.models.employee import Employee
from app.models.attendance import Attendance

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/")
def get_dashboard(db: Session = Depends(get_db)):

    today = date.today()

    total_employees = db.query(Employee).count()

    present_today = db.query(Attendance).filter(
        Attendance.date == today,
        Attendance.status == "Present"
    ).count()

    absent_today = db.query(Attendance).filter(
        Attendance.date == today,
        Attendance.status == "Absent"
    ).count()

    return {
        "total_employees": total_employees,
        "present_today": present_today,
        "absent_today": absent_today
    }

@router.get("/attendance-heatmap")
def attendance_heatmap(db: Session = Depends(get_db)):

    results = (
        db.query(
            Attendance.date,
            func.count().label("count")
        )
        .filter(Attendance.status == "Present")
        .group_by(Attendance.date)
        .all()
    )

    return [
        {
            "date": r.date,
            "count": r.count
        }
        for r in results
    ]