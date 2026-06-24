# LexCare AI

A FastAPI backend for LexCare health consultation platform leveraging Groq LLMs and Supabase.

## Project Overview

LexCare AI is a comprehensive medical consultation API platform that offers:

- **Patient-facing chat interface**: General health questions answered with accessible language
- **Doctor-facing chat interface**: Professional medical advice for healthcare providers
- **AI-powered diagnostic consultation**: Multi-step diagnostic workflow with confidence thresholds
- **Audio consultation processing**: Transcription and analysis of recorded patient consultations

## Architecture

The system is built on these core components:

- **FastAPI Backend**: Handles all API routes and business logic
- **Groq LLM Integration**: Powers all AI responses, using different models for different use cases
- **Supabase Storage**: Persists conversations and medical data
- **PDF Document Indexing**: (Optional) Vector database for medical reference documents

## Setup

### Prerequisites

- Python 3.10+
- Groq API access
- Supabase project

### Environment Setup

1. Clone this repository
2. Create a virtual environment:
```bash
python -m venv aienv
```

3. Activate the environment:
```bash
# Windows
aienv\Scripts\activate

# Linux/Mac
source aienv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create a `.env` file with required variables:
```
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
API_KEY=your_api_authentication_key
```

### Running the Server

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

## API Authentication

All API endpoints are protected by an API key, which must be provided in the `LEXRUNIT-API-KEY` header:

```
LEXRUNIT-API-KEY: your_api_key
```

## Project Structure

- `main.py`: Entry point for the FastAPI application
- `consult.py`: Implementation of the diagnostic consultation workflow
- `chat_patient.py`: Patient-facing chat endpoint
- `chat_doctor.py`: Doctor-facing chat endpoint
- `listen_consultation.py`: Audio consultation processing endpoint
- `common.py`: Shared utilities and model definitions
- `config.py`: Configuration helpers
- `push_to_supabase.py`: Database persistence utilities
- `load_pdf.py`: PDF indexing utilities (optional)
- `auth.py`: API authentication implementation
- `sessions/`: Directory for persisted conversation sessions
- `transcripts/`: Directory for consultation transcripts
- `medical_documents/`: Directory for reference medical PDFs

## AI Models

The system uses different Groq models for different purposes:

- Patient chat: `llama-3.1-8b-instant`
- Doctor chat: `meta-llama/llama-4-scout-17b-16e-instruct`
- Diagnostic consultation: `meta-llama/llama-4-scout-17b-16e-instruct`
- Audio transcription: `whisper-large-v3-turbo`
- Consultation recommendations: `meta-llama/llama-4-maverick-17b-128e-instruct`

## Development

### Adding New Features

1. For new capabilities, create a new router module
2. Implement your logic within that module
3. Import and include the router in `main.py`

### Database Schema

The system uses two main Supabase tables:

- `chats_ai`: Stores all chat messages between users and AI
- `consultation_recordings`: Stores processed consultation recordings

## Deployment

The project includes a `Procfile` for deployment to Heroku or similar platforms. To deploy:

1. Set up your hosting provider with appropriate environment variables
2. Deploy the code to your platform
3. Ensure the server has access to create and read from the `sessions/` and `transcripts/` directories

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Licenses

This project uses several medical reference texts that must be properly licensed for commercial use.

## Contact

For questions about the LexCare AI platform, contact Lexrunit Limited.
