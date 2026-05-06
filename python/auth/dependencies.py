from fastapi import Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from dotenv import load_dotenv

import os

from database import get_db
from models import User
from common.errors import raise_error

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        email = payload.get("sub")

        if email is None:
            raise_error(
                status.HTTP_401_UNAUTHORIZED,
                "토큰 정보가 올바르지 않습니다.",
            )

    except JWTError:
        raise_error(
            status.HTTP_401_UNAUTHORIZED,
            "유효하지 않은 토큰입니다.",
        )

    user = db.query(User).filter(User.email == email).first()

    if user is None:
        raise_error(
            status.HTTP_401_UNAUTHORIZED,
            "사용자를 찾을 수 없습니다.",
        )

    return user