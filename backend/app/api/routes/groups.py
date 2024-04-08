from typing import Any, Optional

from fastapi import APIRouter, HTTPException, Query
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    Group, GroupOut, GroupsOut, GroupCreate, GroupUpdate, Message, GroupStudentLink, Student
    )


router = APIRouter()


@router.get("/", response_model=GroupsOut)
def read_groups(
    session: SessionDep, 
    current_user: CurrentUser,
    skip: int = 0, 
    limit: int = 100,
    student_id: Optional[int] = Query(None, description="Student ID to filter by")
) -> Any:
    """
    Retrieve Groups.
    """
    statement = select(Group).offset(skip).limit(limit)
    count_statement = select(func.count()).select_from(Group)
    if student_id:
        stud = session.get(Student, student_id)
        if not stud:
            raise HTTPException(status_code=404, detail="Student not found")
        statement = statement.where(Group.student_links.any(GroupStudentLink.student_id == student_id))
        count_statement = count_statement.where(Group.student_links.any(GroupStudentLink.student_id == student_id))
    count = session.exec(count_statement).one()
    groups = session.exec(statement).all()
    return GroupsOut(data=groups, count=count)


@router.get("/{id}", response_model=GroupOut)
def read_group(
    session: SessionDep, 
    current_user: CurrentUser, 
    id: int
) -> Any:
    """
    Get Group by ID.
    """
    group = session.get(Group, id)
    if not group:
        raise HTTPException(status_code=404, detail="Item not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return group


@router.post("/", response_model=GroupOut)
def create_group(
    *, session: SessionDep, group_in: GroupCreate
) -> Any:
    """
    Create new Group.
    """
    group = Group.model_validate(group_in)
    session.add(group)
    session.commit()
    session.refresh(group)
    return group


@router.put("/{id}", response_model=GroupOut)
def update_group(
    *, session: SessionDep, current_user: CurrentUser, id: int, group_in: GroupUpdate
) -> Any:
    """
    Update a group.
    """
    group = session.get(Group, id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    update_dict = group_in.model_dump(exclude_unset=True)
    group.sqlmodel_update(update_dict)
    session.add(group)
    session.commit()
    session.refresh(group)
    return group


@router.delete("/{id}")
def delete_group(session: SessionDep, current_user: CurrentUser, id: int) -> Message:
    """
    Delete an Group.
    """
    stud = session.get(Group, id)
    if not stud:
        raise HTTPException(status_code=404, detail="Group not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(stud)
    session.commit()
    return Message(message="Item deleted successfully")
