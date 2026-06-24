# Ecommerce Service Documentation

## Overview
The ecommerce service (Flickmart) has been refactored into a dedicated module `app/ecommerce` to ensure better separation of concerns and security. It now operates independently of the healthcare AI services, with its own authentication mechanism.

## Architecture
The service is structured as follows:

- **`app/ecommerce/`**: The main module directory.
  - **`auth.py`**: Handles authentication for the ecommerce service. It requires a `FLICKMART-API-KEY` header, validated against the `FLICKMART_API_KEY` environment variable.
  - **`models.py`**: Contains Pydantic models, specifically `NegotiationPayload`.
  - **`prompts.py`**: Stores system prompts and helper functions for generating prompts (e.g., `flickmart_initial_prompt`).
  - **`services.py`**: Encapsulates the core logic for negotiation, including interactions with the Groq API and Supabase for conversation history.
  - **`router.py`**: Defines the FastAPI router and endpoints (`/negotiable`, `/nonnegotiable`).

## Endpoints

### 1. Negotiable Product (`POST /flickmart/v1/negotiable`)
Handles negotiation for products where the price is not fixed.
- **Auth**: Requires `FLICKMART-API-KEY` header.
- **Payload**: `NegotiationPayload` (user_id, seller_id, product_name, actual_price, target_price, last_price, message).
- **Logic**:
  - Retrieves or creates a conversation history in Supabase.
  - Generates a response using Groq (LLM) based on the negotiation context.
  - Updates the history.

### 2. Non-Negotiable Product (`POST /flickmart/v1/nonnegotiable`)
Handles requests for products with fixed prices.
- **Auth**: Requires `FLICKMART-API-KEY` header.
- **Payload**: `NegotiationPayload`.
- **Logic**: Returns a standard message stating the price is fixed and directing the user to pay.

## Configuration
Ensure the following environment variables are set in your `.env` file:

```env
FLICKMART_API_KEY=your_secret_key_here
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## Integration
The ecommerce router is mounted in `app/main.py` with the prefix `/flickmart/v1`. It does **not** use the global `require_api_key` dependency used by the healthcare routes. Instead, it enforces its own `require_ecommerce_api_key` dependency defined in `app/ecommerce/auth.py`.
