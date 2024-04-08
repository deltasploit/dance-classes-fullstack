from typing import Any, Optional

from fastapi import APIRouter, HTTPException, Query
from sqlmodel import func, select
from sqlmodel.sql.expression import desc

from app.api.deps import CurrentUser, SessionDep
from app.models import Lesson, LessonCreate, LessonUpdate, LessonOut, LessonsOut, Student, Group, Message, GroupStudentLink

router = APIRouter()


@router.get("/", response_model=LessonsOut)
def read_lessons(
        session: SessionDep, 
        current_user: CurrentUser,
        skip: int = 0, 
        limit: int = 100, 
        student_id: Optional[int] = Query(None, description="Student ID to filter by"), 
        group_id: Optional[int] = Query(None, description="Group ID to filter by")
    ) -> Any:
    """
    Retrieve lessons.
    """
    count_statement = select(func.count()).select_from(Lesson)
    statement = select(Lesson).order_by(desc(Lesson.day)).offset(skip).limit(limit)
    # Filter by student
    if student_id:
        student = session.get(Student, student_id)
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        statement = statement.where(Lesson.assistants.any(Student.id == student_id))
        count_statement = count_statement.where(Lesson.assistants.any(Student.id == student_id))
    # Filter by group
    if group_id:
        group = session.get(Group, group_id)
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")
        statement = statement.where(Lesson.group_id == group_id)
        count_statement = count_statement.where(Lesson.group_id == group_id)
    count = session.exec(count_statement).one()
    lessons = session.exec(statement).all()
    return LessonsOut(data=lessons, count=count)


@router.get("/{id}", response_model=LessonOut)
def read_lesson(session: SessionDep, current_user: CurrentUser, id: int) -> Any:
    """
    Get lesson by ID.
    """
    lesson = session.get(Lesson, id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    count_assistants = len(lesson.assistants)
    return LessonOut(day=lesson.day, assistants=lesson.assistants, assistants_count=count_assistants, group=lesson.group, id=lesson.id)


@router.post("/", response_model=LessonOut)
def create_lesson(
    *, 
    session: SessionDep,
    current_user: CurrentUser,
    lesson_in: LessonCreate
) -> Any:
    """
    Create new lesson.
    """
    assistants_ids = lesson_in.model_dump().pop("assistants", [])
    students_list = []
    group = session.get(Group, lesson_in.group_id)
    if session.exec(select(Lesson).where(Lesson.day == lesson_in.day, Lesson.group_id == lesson_in.group_id)).all():
        raise HTTPException(status_code=400, detail="Lesson already exists")
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    for aid in assistants_ids:
        link = session.exec(select(GroupStudentLink).where(GroupStudentLink.group_id == group.id, GroupStudentLink.student_id == aid))
        stud = session.get(Student, aid)
        if not link:
            raise HTTPException(status_code=404, detail=f"Student {aid} is not registered in course {lesson.group_id}")
        students_list.append(stud)
    # Create lesson
    lesson = Lesson(day=lesson_in.day, group=group, assistants=students_list)
    session.add(lesson)
    session.commit()
    session.refresh(lesson)
    return lesson


@router.put("/{id}", response_model=LessonOut)
def update_lesson(
    *, 
    session: SessionDep, 
    current_user: CurrentUser, 
    id: int, 
    lesson_in: LessonUpdate
) -> Any:
    """
    Update an existing lesson.
    """
    lesson = session.get(Lesson, id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    students_list = []
    for aid in lesson_in.assistants:
        stud = session.get(Student, aid)
        if not stud:
            raise HTTPException(status_code=404, detail=f"Student {aid} not found")
        link = session.exec(select(GroupStudentLink).where(GroupStudentLink.group_id == lesson.group.id, GroupStudentLink.student_id == aid))
        if not link:
            raise HTTPException(status_code=404, detail=f"Student {aid} is not registered in course {lesson.group_id}")
        students_list.append(stud)
    lesson.assistants = students_list
    lesson.day = lesson_in.day
    session.add(lesson)
    session.commit()
    session.refresh(lesson)
    return lesson


@router.delete("/{id}")
def delete_lesson(
    session: SessionDep, 
    current_user: CurrentUser,
    id: int) -> Message:
    """
    Delete a lesson.
    """
    lesson = session.get(Lesson, id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    session.delete(lesson)
    session.commit()
    return Message(message="Lesson deleted successfully")
