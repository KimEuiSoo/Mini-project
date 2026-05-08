from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import os

from database import get_db
from models import User, Upload
from auth.dependencies import get_current_user
from common.pdf_reader import extract_text_from_pdf
from common.gemma import summarize_with_gemma

router = APIRouter(tags=["Summary"])


@router.post("/uploads/{upload_id}/summary")
def summarize_pdf(
    upload_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    upload = db.query(Upload).filter(
        Upload.upload_id == upload_id,
        Upload.user_id == current_user.id
    ).first()

    if upload is None:
        raise HTTPException(
            status_code=404,
            detail="파일 정보를 찾을 수 없습니다."
        )

    if not os.path.exists(upload.upload_path):
        raise HTTPException(
            status_code=404,
            detail="서버에 저장된 파일이 존재하지 않습니다."
        )

    if upload.upload_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="PDF 파일만 요약할 수 있습니다."
        )

    pdf_text = extract_text_from_pdf(upload.upload_path)

    if not pdf_text:
        raise HTTPException(
            status_code=400,
            detail="PDF에서 텍스트를 추출할 수 없습니다."
        )

    summary_text = summarize_with_gemma(pdf_text)

    return {
        "message": "PDF 요약 성공",
        "data": {
            "upload_id": upload.upload_id,
            "upload_name": upload.upload_name,
            "summary_text": summary_text
        }
    }