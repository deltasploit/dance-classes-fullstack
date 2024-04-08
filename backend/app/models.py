import datetime

from sqlmodel import Field, Relationship, SQLModel
from pydantic import validator


# Shared properties
# TODO replace email str with EmailStr when sqlmodel supports it
class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = None


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str


# TODO replace email str with EmailStr when sqlmodel supports it
class UserCreateOpen(SQLModel):
    email: str
    password: str
    full_name: str | None = None


# Properties to receive via API on update, all are optional
# TODO replace email str with EmailStr when sqlmodel supports it
class UserUpdate(UserBase):
    email: str | None = None  # type: ignore
    password: str | None = None


# TODO replace email str with EmailStr when sqlmodel supports it
class UserUpdateMe(SQLModel):
    full_name: str | None = None
    email: str | None = None


class UpdatePassword(SQLModel):
    current_password: str
    new_password: str


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str


# Properties to return via API, id is always required
class UserOut(UserBase):
    id: int


class UsersOut(SQLModel):
    data: list[UserOut]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: int | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str


# Link models
class GroupStudentLink(SQLModel, table=True):
    group_id: int | None = Field(default=None, foreign_key="group.id", primary_key=True)
    student_id: int | None = Field(default=None, foreign_key="student.id", primary_key=True)
    joined_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    
    group: "Group" = Relationship(back_populates="student_links")
    student: "Student" = Relationship(back_populates="group_links")


class LessonStudentLink(SQLModel, table=True):
    lesson_id: int | None = Field(default=None, foreign_key="lesson.id", primary_key=True)
    student_id: int | None = Field(default=None, foreign_key="student.id", primary_key=True)


class StudentBase(SQLModel):
    full_name: str 
    city: str | None = None
    responsible_adult_full_name: str | None = None
    responsible_adult_phone_number: str | None = None
    notes: str | None = None

    @validator('responsible_adult_phone_number')
    def validate_responsible_adult_phone_number(cls, v):
        if v and not v.isnumeric():
            raise ValueError('Not a valid phone number')
        return v
    

class Student(StudentBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)

    payments: list["Payment"] = Relationship(back_populates="student")
    lessons: list["Lesson"] = Relationship(back_populates="assistants", link_model=LessonStudentLink)
    group_links: list[GroupStudentLink] = Relationship(back_populates="student")


class StudentOut(StudentBase):
    id: int
    group_links: list["GroupStudentLink"]


class StudentsOut(SQLModel):
    data: list[StudentOut]
    count: int


class StudentCreate(StudentBase):
    full_name: str
    groups: list[int]


class StudentUpdate(StudentBase):
    full_name: str
    groups: list[int]
    

class GroupBase(SQLModel):
    name: str
    description: str


# Database model, database table inferred from class name
class Group(GroupBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

    lessons: list["Lesson"] = Relationship(back_populates="group")
    student_links: list[GroupStudentLink] = Relationship(back_populates="group")


class GroupOut(GroupBase):
    id: int
    student_links: list["GroupStudentLink"]


class GroupsOut(SQLModel):
    data: list[GroupOut] = []
    count: int


class GroupCreate(GroupBase):
    pass


class GroupUpdate(GroupBase):
    pass


class PaymentBase(SQLModel):
    amount: int
    notes: str | None = None
    day: datetime.date
    method: str = 'other'
    reason: str = 'other'

    @validator('amount')
    def validate_amount(cls, v):
        if v < 0:
            raise ValueError('Amount must be a positive integer')
        return v

    @validator('method')
    def validate_method(cls, v):
        SUPPORTED_METHODS = ['mercadopago', 'cash', 'bank_transfer', 'other']
        if v not in SUPPORTED_METHODS:
            raise ValueError('Payment method should be one of mercadopago / cash / bank_transfer / other')
        return v
    
    @validator('reason')
    def validate_reason(cls, v):
        SUPPORTED_REASONS = ['one_month', 'half_month', 'one_lesson', 'other']
        if v not in SUPPORTED_REASONS:
            raise ValueError('Payment reason should be one of one_month / half_month / one_lesson / other')
        return v


# Database model, database table inferred from class name
class Payment(PaymentBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    student_id: int = Field(default=None, foreign_key="student.id", nullable=False)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    student: Student = Relationship(back_populates="payments")


class PaymentCreate(PaymentBase):
    student_id: int


class PaymentUpdate(PaymentBase):
    pass


class PaymentOut(SQLModel):
    id: int
    created_at: datetime.datetime
    day: datetime.date
    amount: int
    notes: str
    method: str
    reason: str
    student: StudentOut


class PaymentsOut(SQLModel):
    data: list[PaymentOut]
    count: int = 0


class LessonBase(SQLModel):
    day: datetime.date
    notes: str | None = None


class Lesson(LessonBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    group_id: int = Field(default=None, foreign_key="group.id", nullable=False)
    group: "Group" = Relationship(back_populates="lessons")
    assistants: list["Student"] = Relationship(back_populates="lessons", link_model=LessonStudentLink)


class LessonCreate(LessonBase):
    group_id: int
    assistants: list[int]


class LessonUpdate(LessonBase):
    assistants: list[int]


class LessonOut(SQLModel):
    id: int
    group: GroupOut
    day: datetime.date
    assistants: list[StudentOut] = []


class LessonsOut(SQLModel):
    data: list[LessonOut]
    count: int
