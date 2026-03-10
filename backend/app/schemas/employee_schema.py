from pydantic import BaseModel, EmailStr


class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str


class EmployeeResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

    class Config:
        from_attributes = True

class EmployeeUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    department: str | None = None