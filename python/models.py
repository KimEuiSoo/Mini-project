from sqlalchemy import Column, Integer, String, BigInteger, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime, server_default=func.now())


class Upload(Base):
    __tablename__ = "uploads"

    upload_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    upload_name = Column(String(255), nullable=False)
    upload_path = Column(String(500), nullable=False)
    upload_type = Column(String(100), nullable=True)
    upload_size = Column(BigInteger, nullable=True)

    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User")