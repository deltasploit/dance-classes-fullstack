import copy

from typing import Any, Optional

from fastapi import APIRouter, HTTPException, Query
from sqlmodel import func, select, delete, col
from sqlmodel.sql.expression import desc

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    Group, GroupStudentLink, Payment, Student, StudentOut, StudentsOut, StudentCreate, StudentUpdate, Message
    )

router = APIRouter()


@router.get("/", response_model=StudentsOut)
def read_students(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0, 
    limit: int = 100, 
    group_id: Optional[int] = Query(None, description="Group ID to filter by")
) -> Any:
    """
    Retrieve students.
    """
    statement = select(Student).offset(skip).limit(limit)
    count_statement = select(func.count()).select_from(Student)
    if group_id:
        group = session.get(Group, group_id)
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")
        statement = statement.where(Student.group_links.any(GroupStudentLink.group_id == group_id))
        count_statement = count_statement.where(Student.group_links.any(GroupStudentLink.group_id == group_id))
    count = session.exec(count_statement).one()
    students = session.exec(statement).all()
    return StudentsOut(data=students, count=count)


@router.get("/{id}", response_model=StudentOut)
def read_student(session: SessionDep, current_user: CurrentUser, id: int) -> Any:
    """
    Get student by ID.
    """
    student = session.get(Student, id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return student


@router.post("/", response_model=StudentOut)
def create_student(
    *, session: SessionDep, current_user: CurrentUser, student_in: StudentCreate
) -> Any:
    """
    Create new student.
    """
    stud = Student.model_validate(student_in)
    session.add(stud)
    session.commit()
    # Retrieve groups from group_ids and establish relationships
    if student_in.groups:
        groups_to_register = []
        for group_id in student_in.groups:
            g = session.get(Group, group_id)
            if not g:
                raise HTTPException(status_code=404, detail=f"Group not found")
            # Create relationships
            gsl = GroupStudentLink(group_id=group_id, student_id=stud.id)
            session.add(gsl)
            session.commit()
            groups_to_register.append(gsl)
        stud.group_links = groups_to_register
    session.commit()
    session.refresh(stud)
    return stud


@router.put("/{id}", response_model=StudentOut)
def update_student(
    *, session: SessionDep, current_user: CurrentUser, id: int, student_in: StudentUpdate
) -> Any:
    """
    Update a student.
    """
    stud = session.get(Student, id)
    if not stud:
        raise HTTPException(status_code=404, detail="Student not found")
    update_dict = student_in.model_dump(exclude_unset=True)
    stud.sqlmodel_update(update_dict)
    if student_in.groups is not None:
        groups_to_register = []
        for group_id in student_in.groups:
            g = session.get(Group, group_id)
            if not g:
                raise HTTPException(status_code=404, detail=f"Group not found")
            # Create link if doesn't exist
            gsl = session.exec(select(GroupStudentLink).where(GroupStudentLink.student_id == stud.id)).first()
            if not gsl:
                gsl = GroupStudentLink(group_id=group_id, student_id=id)
                session.add(gsl)
                session.commit()
            groups_to_register.append(gsl)
        links_to_unregister = [ link for link in stud.group_links if link not in groups_to_register]
        for link in links_to_unregister:
            session.delete(link)
            session.commit()
        stud.group_links = groups_to_register
    session.add(stud)
    session.commit()
    session.refresh(stud)
    return stud


@router.delete("/{id}")
def delete_student(session: SessionDep, current_user: CurrentUser, id: int) -> Message:
    """
    Delete an student.
    """
    stud = session.get(Student, id)
    if not stud:
        raise HTTPException(status_code=404, detail="Student not found")
    try:
        # Delete GroupLinks
        grouplinks_statement = delete(GroupStudentLink).where(col(GroupStudentLink.student_id) == id)
        session.exec(grouplinks_statement)
        # Delete Payments
        payments_statement = delete(Payment).where(col(Payment.student_id) == id)
        session.exec(payments_statement)
        # Inactive / Delete student
        session.delete(stud)
        session.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occured: {e}")
    return Message(message="Student deleted successfully")