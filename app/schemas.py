from pydantic import BaseModel
from typing import Optional
from pydantic import BaseModel


class TranslationRequest(BaseModel):
    text: str
    target_languages: str  # Comma-separated list of target languages

