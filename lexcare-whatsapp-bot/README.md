# LexCare WhatsApp Bot

## Overview
LexCare WhatsApp Bot is a secure, scalable, and modular Flask-based application designed to automate WhatsApp messaging and integrate with AI-powered services. Built for corporate environments, it follows best practices for maintainability, security, and deployment.

## Features
- Webhook endpoint for WhatsApp Business API
- Signature verification for secure communication
- AI-powered message processing via Lexrunit AI API
- Modular codebase using Flask Factory Pattern and Blueprints
- Environment-based configuration management

## Project Structure
```
lexcare_whatsapp_bot/
│   main.py                # Application entry point
│   requirements.txt       # Python dependencies
│   Procfile               # Deployment process file (e.g., Heroku)
│   .env / example.env     # Environment variable files
│   README.md              # Project documentation
│
├── app/
│   ├── __init__.py        # Flask app factory
│   ├── config.py          # Configuration and logging
│   ├── views.py           # Webhook endpoints (routes)
│   ├── services/
│   │   └── ai_service.py  # AI integration logic
│   ├── decorators/
│   │   └── security.py    # Security decorators (signature verification)
│   └── utils/
│       └── whatsapp_utils.py # WhatsApp message utilities
```

## Getting Started

### 1. Prerequisites
- Python 3.8+
- WhatsApp Business API credentials
- Lexrunit AI API key

### 2. Setup
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd lexcare_whatsapp_bot
   ```
2. **Create a virtual environment:**
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Configure environment variables:**
   - Copy `example.env` to `.env` and fill in all required values.
   - Never commit `.env` to version control.

### 3. Running the Application (Development)
```bash
python main.py
```
- The app will start a Flask development server (default: http://127.0.0.1:5000)

### 4. Webhook Endpoint
- **GET /webhook**: WhatsApp webhook verification
- **POST /webhook**: Receives and processes WhatsApp messages

### 5. Deployment
- The app is ready for deployment on platforms like Heroku or any WSGI-compatible server.
- The `Procfile` is configured for Gunicorn:
  ```
  web: gunicorn main:app
  ```
- Ensure all environment variables are set in your production environment.

## Environment Variables
The following variables must be set in your `.env` file:
- `ACCESS_TOKEN`         # WhatsApp API access token
- `APP_ID`               # WhatsApp App ID
- `APP_SECRET`           # WhatsApp App Secret
- `RECIPIENT_WAID`       # WhatsApp recipient number
- `VERSION`              # WhatsApp API version
- `PHONE_NUMBER_ID`      # WhatsApp phone number ID
- `VERIFY_TOKEN`         # Webhook verification token
- `LEXRUNIT_API_KEY`     # Lexrunit AI API key

## Code Style & Quality
- Use **Black** for automatic code formatting. Run `black .` before committing code.
- Use **Flake8** for linting. Run `flake8` to check for code quality and style issues.
- Follow PEP8 and company coding standards.

## Contributing
- Use feature branches and submit pull requests for review.
- Write clear commit messages and document your code.
- Keep secrets and credentials out of version control.

## Support & Contact
For technical support or onboarding, contact the DevOps or Engineering team.

---
© LexCare, a Lexrunit Company. All rights reserved.
