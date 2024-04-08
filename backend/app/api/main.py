from fastapi import APIRouter

from app.api.routes import login, users, utils, students, groups, lessons, payments

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(groups.router, prefix="/groups", tags=["groups"])
api_router.include_router(lessons.router, prefix="/lessons", tags=["lessons"])
