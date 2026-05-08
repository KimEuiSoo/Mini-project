import os
import requests
from dotenv import load_dotenv

load_dotenv()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma3:4b")


def summarize_with_gemma(text: str) -> str:
    prompt = f"""
너는 PDF 문서를 요약해주는 생성형 AI야.
아래 문서 내용을 한국어로 이해하기 쉽게 요약해줘.

요약 조건:
1. 핵심 내용 위주로 정리
2. 중요한 키워드 포함
3. 문서의 목적, 주요 내용, 결론 포함
4. 너무 장황하지 않게 작성
5. 문단 형태로 보기 좋게 작성

문서 내용:
{text}
"""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False
        },
        timeout=300
    )

    if response.status_code != 200:
        raise Exception("Gemma 요약 요청 실패")

    result = response.json()

    return result.get("response", "")