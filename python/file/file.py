from fastapi import APIRouter, HTTPException, UploadFile, status, File, Depends, Query
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from typing import List

import shutil
import os
import uuid

from models import User, Upload
from database import get_db
from auth.dependencies import get_current_user
from schemas import FileResponse, FileDelete, FileSearchResponse


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
 
@router.get(
    "/file/admin/search",
    response_model=FileSearchResponse,
    response_model_by_alias=True
)
def file_admin_search(
    keyword: str | None = Query(None, description="검색할 파일명"),
    file_type: str = Query("all", description="파일 타입"),
    db: Session = Depends(get_db)
):
    query = db.query(Upload)

    # keyword가 None이거나 ""이면 검색 필터 안 걸림 = 전체 조회
    if keyword and keyword.strip():
        query = query.filter(
            Upload.upload_name.like(f"%{keyword.strip()}%")
        )

    # file_type이 없거나 all이면 타입 필터 안 걸림
    if file_type and file_type != "all":
        query = query.filter(
            Upload.upload_type.like(f"%{file_type}%")
        )

    files = (
        query
        .order_by(Upload.created_at.desc())
        .all()
    )

    if not files:
        return {
            "message": "검색한 데이터가 없습니다.",
            "data": [],
            "code": 200
        }

    return {
        "message": "조회 성공",
        "data": files,
        "code": 200
    }

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
        # DB에 저장된 실제 파일 경로
        file_path = Path(upload.file_path)

        # 실제 서버 폴더에 파일이 존재하면 삭제
        if file_path.exists() and file_path.is_file():
            file_path.unlink()
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="서버에 저장된 파일을 찾을 수 없습니다."
            )

        # 실제 파일 삭제 성공 후 DB 데이터 삭제
        db.delete(upload)
        db.commit()

        return {
            "message": "해당 파일을 성공적으로 삭제하였습니다.",
            "code": 200
        }

    except HTTPException:
        db.rollback()
        raise

    except Exception as e:
        db.rollback()
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
    upload = (
        db.query(Upload)
        .filter(Upload.upload_id == upload_id)
        .first()
    )

    if upload is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="파일을 찾을 수 없습니다."
        )

    try:
        # DB에 저장된 실제 파일 경로
        file_path = Path(upload.file_path)

        # 실제 서버 폴더에 파일이 존재하면 삭제
        if file_path.exists() and file_path.is_file():
            file_path.unlink()
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="서버에 저장된 파일을 찾을 수 없습니다."
            )

        # 실제 파일 삭제 성공 후 DB 데이터 삭제
        db.delete(upload)
        db.commit()

        return {
            "message": "해당 파일을 성공적으로 삭제하였습니다.",
            "code": 200
        }

    except HTTPException:
        db.rollback()
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"문서 삭제 중 오류가 발생했습니다: {str(e)}"
        )