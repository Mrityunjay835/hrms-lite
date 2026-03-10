from sqlalchemy import Column, Integer, Date, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.db.session import Base
from sqlalchemy.orm import relationship


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(Integer, ForeignKey("employees.id"))

    date = Column(Date, nullable=False)

    status = Column(String, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    employee = relationship("Employee", back_populates="attendances")