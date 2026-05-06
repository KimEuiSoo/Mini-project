from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import UserLogin, Token
from auth.auth import verify_password, create_access_token
from common.errors import raise_error

router = APIRouter(tags=["Auth"])


@router.post(
    "/login",
    response_model=Token,
    summary="로그인",
)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()

    if not user:
        raise_error(
            status.HTTP_401_UNAUTHORIZED,
            "이메일 또는 비밀번호가 올바르지 않습니다.",
        )

    if not verify_password(user_data.password, user.password):
        raise_error(
            status.HTTP_401_UNAUTHORIZED,
            "이메일 또는 비밀번호가 올바르지 않습니다.",
        )

    access_token = create_access_token(
        data={
            "sub": user.email,
            "user_id": user.id,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }