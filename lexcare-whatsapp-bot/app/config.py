import sys
import os
import logging

def load_configurations(app):
    # Doppler injects variables directly into the environment, so no .env parsing needed
    app.config["ACCESS_TOKEN"] = os.environ.get("ACCESS_TOKEN")
    app.config["YOUR_PHONE_NUMBER"] = os.environ.get("YOUR_PHONE_NUMBER")
    app.config["APP_ID"] = os.environ.get("APP_ID")
    app.config["APP_SECRET"] = os.environ.get("APP_SECRET")
    app.config["RECIPIENT_WAID"] = os.environ.get("RECIPIENT_WAID")
    app.config["VERSION"] = os.environ.get("VERSION", "v25.0")
    app.config["PHONE_NUMBER_ID"] = os.environ.get("PHONE_NUMBER_ID")
    app.config["VERIFY_TOKEN"] = os.environ.get("VERIFY_TOKEN")
    app.config["BASE_BACKEND_URL"] = os.environ.get("VITE_BASE_BACKEND_URL", "https://lexrunit-base-backend.builtbybuchi.workers.dev")


def configure_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        stream=sys.stdout,
    )
