from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.db.session import Base

from sqlalchemy.orm import relationship

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)  # it is e_id as integer for internal use.

    employee_id = Column(String, unique=True, nullable=False, index=True) # this is for abstraction.
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    department = Column(String, nullable=False)

    attendances = relationship(
        "Attendance",
        back_populates="employee",
        cascade="all, delete-orphan"
    )
