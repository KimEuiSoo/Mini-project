from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError


def get_error_type(status_code: int):
    error_types = {
        400: "BAD_REQUEST",
        401: "UNAUTHORIZED",
        403: "FORBIDDEN",
        404: "NOT_FOUND",
        409: "CONFLICT",
        422: "VALIDATION_ERROR",
        500: "INTERNAL_SERVER_ERROR",
    }

    return error_types.get(status_code, "UNKNOWN_ERROR")


def raise_error(status_code: int, message: str, error_type: str = None):
    raise HTTPException(
        status_code=status_code,
        detail={
            "success": False,
            "message": message,
            "error": {
                "code": status_code,
                "type": error_type or get_error_type(status_code),
            },
        },
    )


async def http_exception_handler(request: Request, exc: HTTPException):
    if isinstance(exc.detail, dict):
        return JSONResponse(
            status_code=exc.status_code,
            content=exc.detail,
        )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail,
            "error": {
                "code": exc.status_code,
                "type": get_error_type(exc.status_code),
            },
        },
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": "요청 데이터 형식이 올바르지 않습니다.",
            "error": {
                "code": 422,
                "type": "VALIDATION_ERROR",
                "details": exc.errors(),
            },
        },
    )


async def server_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "서버 내부 오류가 발생했습니다.",
            "error": {
                "code": 500,
                "type": "INTERNAL_SERVER_ERROR",
            },
        },
    )