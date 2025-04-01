# 🌍 Translation Web App with Azure AI & FastAPI

## Project Overview
This project is an intelligent translation web application that leverages Azure AI's DeepSeek-V3 model to break language barriers. The app allows users to translate text in real-time across multiple languages with high accuracy and context-aware translations. Built using FastAPI and Azure AI services, it offers a seamless user experience.

## 🔧 Technical Implementation

- **AI Backbone**: Integrated **Azure AI's inference API** with the **DeepSeek-V3 model** for high-quality translations. Azure's powerful AI capabilities enable fast and accurate language translations.
- **Backend**: The backend is built using **FastAPI** (Python), with **SQLAlchemy** and **SQLite** for storing translation history. This allows users to track their previous translations and build a translation memory.
- **Frontend**: A modern **JavaScript** frontend, utilizing **Axios** for seamless API communication. This ensures smooth interactions with the backend and user-friendly translation experiences.
- **Azure Services**:
  - **Azure AI inference API** for fast, scalable translations.
  - **Custom prompt engineering** to optimize translation results, fine-tuning AI responses for high accuracy.
  - Secure credential management for safe handling of sensitive data.

## ✨ Key Features

- **Real-time Multi-language Translation**: Quickly translate text across multiple languages, powered by Azure AI.
- **Translation Memory**: Store and access your previous translations for consistent language use.
- **Intelligent Prompt Engineering**: Use settings like **temperature=0.8** and **top_p=0.1** for optimal AI responses.
- **Context-aware Translations**: System message priming ensures that the translation is contextually relevant.
- **Error Handling**: Robust error handling ensures smooth API communication and graceful failure management.

## 💡 What I Learned

- **Integrating AI Services**: I gained hands-on experience with integrating **Azure AI services** into a web application, handling complex API interactions, and ensuring scalability.
- **Optimizing Large Language Models**: Learned how to fine-tune model parameters for better performance and reduced inference costs.
- **Building Secure API Gateways**: Worked on securing API endpoints, including token-based authentication and best practices for API key management.
- **Managing AI Inference Costs**: Gained insights into cost optimization by adjusting model parameters and selecting appropriate Azure services for the task.

## 📦 Requirements

To run this project locally, make sure you have the following:

- Python 3.9+
- FastAPI
- SQLAlchemy
- SQLite (for database storage)
- Axios (for frontend API communication)
- Azure AI Subscription (for inference API access)

## 🚀 How to Run

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/yourusername/azure-ai-translation-web-app.git
