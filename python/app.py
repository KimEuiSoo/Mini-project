from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware

import os

from auth.signup import router as signup_router
from auth.login import router as login_router
from upload.upload import router as upload_router
from summary.summary import router as summary_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.include_router(signup_router)
app.include_router(login_router)
app.include_router(upload_router)
app.include_router(summary_router)