from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.appwrite_client import get_databases, DATABASE_ID
from appwrite.id import ID
import resend
import os

router = APIRouter()

class ContactForm(BaseModel):
    name: str
    email: str
    subject: str
    message: str

@router.post("/")
def submit_contact(form: ContactForm):
    db = get_databases()
    
    # Save to Appwrite
    try:
        db.create_document(
            database_id=DATABASE_ID,
            collection_id="contacts",
            document_id=ID.unique(),
            data=form.dict()
        )
    except Exception as e:
        print(f"Failed to save contact form to DB: {e}")
    
    # Send email
    try:
        resend.api_key = os.environ.get("RESEND_API_KEY")
        if not resend.api_key:
            print("Warning: RESEND_API_KEY is not set.")
        
        from_email = os.environ.get("RESEND_FROM_EMAIL", "onboarding@resend.dev")
        to_email = "tickets@lexrunit.p.tawk.email"
        
        email_html = f"""
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> {form.name}</p>
        <p><strong>Email:</strong> {form.email}</p>
        <p><strong>Subject:</strong> {form.subject}</p>
        <hr>
        <p>{form.message.replace(chr(10), '<br>')}</p>
        """

        params = {
            "from": from_email,
            "to": [to_email],
            "subject": f"Contact Form: {form.subject}",
            "reply_to": form.email,
            "html": email_html
        }

        res = resend.Emails.send(params)
        print("Resend response:", res)
            
        return {"status": "success", "message": "Contact form submitted"}
    except Exception as e:
        print(f"Error sending email: {e}")
        raise HTTPException(status_code=500, detail="Failed to process contact submission")
