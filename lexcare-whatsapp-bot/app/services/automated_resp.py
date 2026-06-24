def automated_resp(message_body, wa_id, name):
    if message_body.startswith("/consult"):
        return "The AI Consultation feature is currently under development. To be launched November 2025."
    elif message_body.startswith("/drandre"):
        response = """
        Welcome to your Dr. Andre's Menu:
        /1 See hospitals/doctors in your city
        /2 Book an appointment/consultation
        /3 My Account
        /4 Cancel
        """
        return response