from pydantic import BaseModel, EmailStr, Field, field_serializer, ConfigDict
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserResponse(BaseModel):
    id: int
    email: str
    name: str | None = None

    class Config:
        from_attributes = True

class FileResponse(BaseModel):
    upload_id: int = Field(serialization_alias="fileId")
    user_id: int = Field(serialization_alias="userId")
    upload_name: str = Field(serialization_alias="fileName")
    upload_path: str = Field(serialization_alias="filePath")
    upload_type: str | None = Field(serialization_alias="fileType")
    upload_size: int | None = Field(serialization_alias="fileSize")
    created_at: datetime | None = Field(serialization_alias="createdAt")

    class Config:
        from_attributes = True

    @field_serializer("created_at")
    def serialize_created_at(self, value: datetime | None):
        if value is None:
            return None

        return value.strftime("%Y년 %m월 %d일")

class FileDelete(BaseModel):
    message: str
    code: int

class SummaryResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    upload_id: int = Field(serialization_alias="uploadId")
    file_name: str = Field(serialization_alias="fileName")
    summary_text: str = Field(serialization_alias="summaryText")