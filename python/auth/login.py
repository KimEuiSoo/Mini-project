from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import UserLogin, Token
from auth.auth import verify_password, create_access_token
from common.errors import raise_error

# app에서 작동하는 것이 아닌 router화로 app과 연동 시켜주기 위한 사전 작업
router = APIRouter(tags=["Auth"])

"""
로그인 하기 위한 함수
response 모델로 Token을 반환해줌
"""
@router.post(
    "/login",
    response_model=Token,
    summary="로그인",
)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    # 이메일로 필터링 하여 유저를 찾음
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

    # 오류가 없으면 accessToken 만든다.
    access_token = create_access_token(
        data={
            "sub": user.email,
            "user_id": user.id,
        }
    )

    # accessToken과 token 타입을 return
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }