from typing import Any, Optional

from fastapi import APIRouter, HTTPException, Query
from sqlmodel import func, select
from sqlmodel.sql.expression import desc

from app.api.deps import CurrentUser, SessionDep
from app.models import Student, Payment, PaymentsOut, PaymentOut, PaymentCreate, PaymentUpdate, Message

router = APIRouter()


@router.get("/", response_model=PaymentsOut)
def read_payments(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100, student_id: Optional[int] = Query(None, description="Student ID to filter by")
) -> Any:
    """
    Retrieve payments.
    """
    count_statement = select(func.count()).select_from(Payment)
    statement = select(Payment).offset(skip).limit(limit)
    if student_id:
        student = session.get(Student, student_id)
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        statement = statement.where(Payment.student_id == student_id)
        count_statement = count_statement.where(Payment.student_id == student_id)
    count = session.exec(count_statement).one()
    payments = session.exec(statement).all()
    return PaymentsOut(data=payments, count=count)


@router.get("/{id}", response_model=PaymentOut)
def read_payment(session: SessionDep, current_user: CurrentUser, id: int) -> Any:
    """
    Get student by ID.
    """
    payment = session.get(Payment, id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return payment


@router.post("/", response_model=PaymentOut)
def create_payment(
    *, session: SessionDep, current_user: CurrentUser, payment_in: PaymentCreate
) -> Any:
    """
    Create new payment.
    """
    payment = Payment.model_validate(payment_in)
    session.add(payment)
    session.commit()
    session.refresh(payment)
    return payment


@router.put("/{id}", response_model=PaymentOut)
def update_payment(
    *, session: SessionDep, current_user: CurrentUser, id: int, payment_in: PaymentUpdate
) -> Any:
    """
    Update a payment.
    """
    payment = session.get(Payment, id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    update_dict = payment_in.model_dump(exclude_unset=True)
    payment.sqlmodel_update(update_dict)
    session.add(payment)
    session.commit()
    session.refresh(payment)
    return payment


@router.delete("/{id}")
def delete_payment(session: SessionDep, current_user: CurrentUser, id: int) -> Message:
    """
    Delete a payment.
    """
    payment = session.get(Payment, id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    try:
        session.delete(payment)
        session.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occured: {e}")
    return Message(message="Payment deleted successfully")
