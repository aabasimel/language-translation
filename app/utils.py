from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY=os.getenv("API_KEY")
ENDPOINT=os.getenv("ENDPOINT")
MODEL_NAME=os.getenv("MODEL_NAME")
client = ChatCompletionsClient(
    endpoint=ENDPOINT,
    credential=AzureKeyCredential(API_KEY),
)

def perform_translation(text: str, target_language: str) -> str:
    """
    Perform translation of text to target language using Azure AI
    
    Args:
        text: The text to translate
        target_language: The target language to translate to
    
    Returns:
        The translated text
    """
    prompt = f"Translate the following text into {target_language}: {text}"
    response = client.complete(
        messages=[
            SystemMessage("You are a helpful assistant specializing in translation."),
            UserMessage(prompt),
        ],
        model=MODEL_NAME,
        temperature=0.8,
        max_tokens=2048,
        top_p=0.1
    )
    return response.choices[0].message.content