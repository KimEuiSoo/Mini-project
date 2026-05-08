import os
import httpx
from dotenv import load_dotenv
from markitdown import MarkItDown

from summary.prompt import (
    CHUNK_SUMMARY_SYSTEM_PROMPT,
    CHUNK_SUMMARY_PROMPT,
    FINAL_SUMMARY_SYSTEM_PROMPT,
    FINAL_SUMMARY_PROMPT,
)

load_dotenv()

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma3:4b")

SUMMARY_CHUNK_SIZE = int(os.getenv("SUMMARY_CHUNK_SIZE", "5000"))
SUMMARY_CHUNK_OVERLAP = int(os.getenv("SUMMARY_CHUNK_OVERLAP", "300"))


def extract_text_from_file(file_path: str) -> str:
    """
    PDF, DOCX, TXT 등 파일에서 텍스트를 추출한다.
    MarkItDown은 문서를 Markdown 형태의 텍스트로 변환해준다.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError("파일을 찾을 수 없습니다.")

    md = MarkItDown()
    result = md.convert(file_path)

    text = result.text_content

    if not text or not text.strip():
        raise ValueError("문서에서 텍스트를 추출하지 못했습니다.")

    return text.strip()


def split_text(text: str, chunk_size: int = SUMMARY_CHUNK_SIZE, overlap: int = SUMMARY_CHUNK_OVERLAP) -> list[str]:
    """
    긴 문서를 LLM 컨텍스트에 맞게 나누는 함수.
    overlap을 조금 주면 chunk 경계에서 내용이 끊기는 문제를 줄일 수 있다.
    """
    chunks = []
    start = 0
    text_length = len(text)

    while start < text_length:
        end = start + chunk_size
        chunk = text[start:end]

        if chunk.strip():
            chunks.append(chunk.strip())

        start = end - overlap

        if start < 0:
            start = 0

    return chunks


async def call_ollama(system_prompt: str, user_prompt: str) -> str:
    """
    Ollama /api/generate 호출.
    stream=False로 해야 FastAPI에서 한 번에 결과를 받기 편하다.
    """
    url = f"{OLLAMA_BASE_URL}/api/generate"

    payload = {
        "model": OLLAMA_MODEL,
        "system": system_prompt,
        "prompt": user_prompt,
        "stream": False,
        "options": {
            "temperature": 0.2,
            "num_predict": 1024
        }
    }

    async with httpx.AsyncClient(timeout=300.0) as client:
        response = await client.post(url, json=payload)
        response.raise_for_status()

    data = response.json()
    return data.get("response", "").strip()


async def summarize_chunk(chunk_text: str) -> str:
    prompt = CHUNK_SUMMARY_PROMPT.format(chunk_text=chunk_text)

    return await call_ollama(
        system_prompt=CHUNK_SUMMARY_SYSTEM_PROMPT,
        user_prompt=prompt
    )


async def summarize_final(partial_summaries: list[str]) -> str:
    joined_summaries = "\n\n".join(
        [f"[부분 요약 {index + 1}]\n{summary}" for index, summary in enumerate(partial_summaries)]
    )

    prompt = FINAL_SUMMARY_PROMPT.format(partial_summaries=joined_summaries)

    return await call_ollama(
        system_prompt=FINAL_SUMMARY_SYSTEM_PROMPT,
        user_prompt=prompt
    )


async def summarize_document(file_path: str) -> str:
    """
    문서 하나를 받아 최종 summaryText를 만드는 메인 함수.
    """
    text = extract_text_from_file(file_path)

    chunks = split_text(text)

    partial_summaries = []

    for chunk in chunks:
        partial_summary = await summarize_chunk(chunk)
        partial_summaries.append(partial_summary)

    if len(partial_summaries) == 1:
        return partial_summaries[0]

    final_summary = await summarize_final(partial_summaries)

    return final_summary