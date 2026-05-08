from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext
from dotenv import load_dotenv
import os

# env load 코드
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

# 비밀번호 암호화
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 비밀번호 hash화
def hash_password(password: str):
    return pwd_context.hash(password)

# hash화 된 비밀번호로 db에 넣기 위한 작업
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# access token 생성 함수
def create_access_token(data: dict):
    to_encode = data.copy()

    # 정해둔 시간까지 access token 유효
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    # secret_key를 통해 jwt 인코딩
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)