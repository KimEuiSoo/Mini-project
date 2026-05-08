from fastapi import APIRouter, HTTPException, UploadFile, status, File, Depends
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from typing import List

import shutil
import os
import uuid

from models import User, Upload
from database import get_db
from auth.dependencies import get_current_user
from schemas import FileResponse, FileDelete


load_dotenv()

router = APIRouter(tags=["Upload"])

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/file/upload")
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

@router.get(
    "/file/list",
    response_model=List[FileResponse]
)
def file_list(
    db: Session = Depends(get_db)
):
    files = (
        db.query(Upload)
        .order_by(Upload.created_at.asc())
        .all()
    )

    return files

@router.delete(
    "/file/admin/delete/{upload_id}",
    response_model=FileDelete,
    response_model_by_alias=True
)
def file_admin_delete(
    upload_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    delete = (
        db.query(Upload)
        .filter(
            Upload.upload_id == upload_id,
            Upload.user_id == current_user.id
        )
        .first()
    )

    if delete is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="파일을 찾을 수 없습니다."
        )

    try:
        db.query(Upload).filter(
            Upload.upload_id == upload_id,
            Upload.user_id == current_user.id
        ).delete()
        db.commit()
    
        return {
            "message": "해당 파일을 성공적으로 삭제하였습니다.",
            "code": 200
        }
    
    except FileNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="서버에 저장된 파일을 찾을 수 없습니다."
        )
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"문서 삭제 중 오류가 발생했습니다: {str(e)}"
        )

@router.delete(
    "/file/admin/delete/{upload_id}",
    response_model=FileDelete,
    response_model_by_alias=True
)
def file_admin_delete(
    upload_id: int,
    db: Session = Depends(get_db)
):
    delete = (
        db.query(Upload)
        .filter(
            Upload.upload_id == upload_id,
        )
        .first()
    )

    if delete is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="파일을 찾을 수 없습니다."
        )

    try:
        db.query(Upload).filter(Upload.upload_id == upload_id).delete()
        db.commit()
    
        return {
            "message": "해당 파일을 성공적으로 삭제하였습니다.",
            "code": 200
        }
    
    except FileNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="서버에 저장된 파일을 찾을 수 없습니다."
        )
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"문서 삭제 중 오류가 발생했습니다: {str(e)}"
        )