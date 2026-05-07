from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from dotenv import load_dotenv

import shutil
import os
import uuid

from models import User, Upload
from database import get_db
from auth.dependencies import get_current_user

load_dotenv()

router = APIRouter(tags=["Upload"])

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    saved_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, saved_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    upload_size = os.path.getsize(file_path)

    upload = Upload(
        user_id=current_user.id,
        upload_name=file.filename,
        upload_path=file_path,
        upload_type=file.content_type,
        upload_size=upload_size
    )

    db.add(upload)
    db.commit()
    db.refresh(upload)

    return {
        "message": "업로드 성공",
        "data": {
            "upload_id": upload.upload_id,
            "user_id": upload.user_id,
            "upload_name": upload.upload_name,
            "upload_path": upload.upload_path,
            "upload_type": upload.upload_type,
            "upload_size": upload.upload_size,
            "created_at": upload.created_at
        },
        "user": current_user.email
    }