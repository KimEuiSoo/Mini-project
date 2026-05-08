from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import User, Upload
from auth.dependencies import get_current_user
from schemas import SummaryResponse
from summary.service import summarize_document


router = APIRouter(tags=["Summary"])

@router.post(
    "/summary/{upload_id}",
    response_model=SummaryResponse,
    response_model_by_alias=True
)
async def summarize_uploaded_file(
    upload_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    upload = (
        db.query(Upload)
        .filter(
            Upload.upload_id == upload_id,
            Upload.user_id == current_user.id
        )
        .first()
    )

    if upload is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="파일을 찾을 수 없습니다."
        )

    try:
        summary_text = await summarize_document(upload.upload_path)

        return {
            "upload_id": upload.upload_id,
            "file_name": upload.upload_name,
            "summary_text": summary_text
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
            detail=f"문서 요약 중 오류가 발생했습니다: {str(e)}"
        )