if __name__ == "__main__":
    import uvicorn
    from dotenv import load_dotenv

    load_dotenv()

    from app.main import app
    
    uvicorn.run(app, host="0.0.0.0", port=8080)