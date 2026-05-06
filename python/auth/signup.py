from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import UserCreate, UserResponse
from auth.auth import hash_password
from common.errors import raise_error

router = APIRouter(tags=["Auth"])


@router.post(
    "/signup",
    response_model=UserResponse,
    summary="회원가입",
)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()

    if existing_user:
        raise_error(
            status.HTTP_409_CONFLICT,
            "이미 가입된 이메일입니다.",
        )

    new_user = User(
        email=user_data.email,
        password=hash_password(user_data.password),
        name=user_data.name,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user