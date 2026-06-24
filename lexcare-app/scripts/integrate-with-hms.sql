-- Integration script for LexCare with existing HMS
-- This script modifies the LexCare schema to work with the existing HMS database

-- First, let's modify the profiles table to link with HMS patients table
-- We'll keep profiles for auth but link to patients for medical data
ALTER TABLE profiles ADD COLUMN patient_id UUID REFERENCES patients(id);

-- Create a trigger to automatically create/link patient record when profile is created
CREATE OR REPLACE FUNCTION create_patient_for_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if patient already exists with this email
  IF NEW.email IS NOT NULL THEN
    -- Try to find existing patient by email
    UPDATE patients 
    SET email = NEW.email 
    WHERE email = NEW.email 
    RETURNING id INTO NEW.patient_id;
    
    -- If no existing patient found, create new one
    IF NEW.patient_id IS NULL THEN
      INSERT INTO patients (
        full_name,
        email,
        phone,
        created_at,
        updated_at
      ) VALUES (
        CONCAT(NEW.first_name, ' ', NEW.last_name),
        NEW.email,
        NEW.phone,
        NOW(),
        NOW()
      ) RETURNING id INTO NEW.patient_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_patient_for_profile
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_patient_for_profile();

-- Update appointments table to use HMS structure
DROP TABLE IF EXISTS appointments CASCADE;
-- We'll use the existing HMS appointments table instead

-- Create a view for LexCare appointments that matches our app structure
CREATE OR REPLACE VIEW lexcare_appointments AS
SELECT 
  a.id,
  a.patient_id as user_id,
  u.full_name as doctor_name,
  u.title as department,
  a.appointment_date::date as date,
  a.appointment_date::time as time,
  COALESCE(u.location, 'Hospital Main Building') as location,
  a.notes,
  a.status,
  a.created_at
FROM appointments a
JOIN users u ON a.doctor_id = u.id
JOIN profiles p ON p.patient_id = a.patient_id
WHERE p.id = auth.uid();

-- Update consultations to use HMS structure
DROP TABLE IF EXISTS consultations CASCADE;
-- We'll use the existing HMS consultations table

-- Create a view for LexCare consultations
CREATE OR REPLACE VIEW lexcare_consultations AS
SELECT 
  c.id,
  c.patient_id as user_id,
  'pending' as status,
  c.symptoms,
  c.diagnosis as ai_recommendation,
  CASE WHEN c.diagnosis IS NOT NULL THEN true ELSE false END as doctor_approved,
  c.notes as doctor_notes,
  c.created_at
FROM consultations c
JOIN profiles p ON p.patient_id = c.patient_id
WHERE p.id = auth.uid();

-- Update chat system to use HMS AI chat structure
DROP TABLE IF EXISTS chats CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;

-- Create views that map HMS AI chat to LexCare structure
CREATE OR REPLACE VIEW lexcare_chats AS
SELECT 
  s.id,
  p.id as user_id,
  COALESCE(s.session_title, 'Health Chat') as title,
  s.created_at
FROM ai_chat_sessions s
JOIN profiles p ON p.patient_id = s.user_id
WHERE p.id = auth.uid() AND s.status = 'active';

CREATE OR REPLACE VIEW lexcare_chat_messages AS
SELECT 
  m.id,
  p.id as user_id,
  m.session_id as chat_id,
  m.content,
  CASE WHEN m.message_type = 'ai' THEN true ELSE false END as is_ai,
  m.media_url,
  CASE 
    WHEN m.media_type = 'audio' THEN 'audio'
    WHEN m.media_type = 'image' THEN 'image'
    WHEN m.media_type = 'document' THEN 'video'
    ELSE NULL
  END as media_type,
  m.created_at
FROM ai_chat_messages m
JOIN ai_chat_sessions s ON m.session_id = s.id
JOIN profiles p ON p.patient_id = s.user_id
WHERE p.id = auth.uid();

-- Create functions to insert into HMS tables through LexCare interface
CREATE OR REPLACE FUNCTION insert_lexcare_chat_session(title TEXT)
RETURNS UUID AS $$
DECLARE
  session_id UUID;
  patient_uuid UUID;
BEGIN
  -- Get patient_id for current user
  SELECT patient_id INTO patient_uuid 
  FROM profiles 
  WHERE id = auth.uid();
  
  -- Insert into HMS ai_chat_sessions
  INSERT INTO ai_chat_sessions (user_id, session_title, status)
  VALUES (patient_uuid, title, 'active')
  RETURNING id INTO session_id;
  
  RETURN session_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insert_lexcare_chat_message(
  session_uuid UUID,
  message_content TEXT,
  is_ai_message BOOLEAN DEFAULT false,
  media_url_param TEXT DEFAULT NULL,
  media_type_param TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  message_id UUID;
BEGIN
  INSERT INTO ai_chat_messages (
    session_id,
    message_type,
    content,
    media_type,
    media_url
  ) VALUES (
    session_uuid,
    CASE WHEN is_ai_message THEN 'ai' ELSE 'user' END,
    message_content,
    COALESCE(media_type_param, 'text'),
    media_url_param
  ) RETURNING id INTO message_id;
  
  RETURN message_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to book appointment through LexCare
CREATE OR REPLACE FUNCTION book_lexcare_appointment(
  doctor_uuid UUID,
  appointment_datetime TIMESTAMP WITH TIME ZONE,
  notes_param TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  appointment_id UUID;
  patient_uuid UUID;
BEGIN
  -- Get patient_id for current user
  SELECT patient_id INTO patient_uuid 
  FROM profiles 
  WHERE id = auth.uid();
  
  -- Insert into HMS appointments
  INSERT INTO appointments (
    patient_id,
    doctor_id,
    appointment_date,
    notes,
    status
  ) VALUES (
    patient_uuid,
    doctor_uuid,
    appointment_datetime,
    notes_param,
    'scheduled'
  ) RETURNING id INTO appointment_id;
  
  RETURN appointment_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to submit consultation
CREATE OR REPLACE FUNCTION submit_lexcare_consultation(
  symptoms_param TEXT,
  ai_recommendation_param TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  consultation_id UUID;
  patient_uuid UUID;
BEGIN
  -- Get patient_id for current user
  SELECT patient_id INTO patient_uuid 
  FROM profiles 
  WHERE id = auth.uid();
  
  -- Insert into HMS consultations
  INSERT INTO consultations (
    patient_id,
    symptoms,
    diagnosis,
    consultation_date
  ) VALUES (
    patient_uuid,
    symptoms_param,
    ai_recommendation_param,
    NOW()
  ) RETURNING id INTO consultation_id;
  
  RETURN consultation_id;
END;
$$ LANGUAGE plpgsql;

-- Update health_records to link with patients
ALTER TABLE health_records ADD COLUMN patient_id UUID REFERENCES patients(id);

-- Create trigger to sync health_records with patient_id
CREATE OR REPLACE FUNCTION sync_health_record_patient()
RETURNS TRIGGER AS $$
BEGIN
  -- Get patient_id for the user
  SELECT patient_id INTO NEW.patient_id 
  FROM profiles 
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sync_health_record_patient
  BEFORE INSERT ON health_records
  FOR EACH ROW
  EXECUTE FUNCTION sync_health_record_patient();

-- Update vital_signs to link with patients
ALTER TABLE vital_signs ADD COLUMN patient_id UUID REFERENCES patients(id);

-- Create trigger to sync vital_signs with patient_id
CREATE OR REPLACE FUNCTION sync_vital_signs_patient()
RETURNS TRIGGER AS $$
BEGIN
  -- Get patient_id for the user
  SELECT patient_id INTO NEW.patient_id 
  FROM profiles 
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sync_vital_signs_patient
  BEFORE INSERT ON vital_signs
  FOR EACH ROW
  EXECUTE FUNCTION sync_vital_signs_patient();

-- Create view for doctors list (for appointment booking)
CREATE OR REPLACE VIEW lexcare_doctors AS
SELECT 
  id,
  full_name as name,
  title as specialization,
  location,
  phone,
  email
FROM users 
WHERE role = 'doctor';

-- Update RLS policies for the views
CREATE POLICY "Users can view own appointments" ON appointments 
FOR SELECT USING (
  patient_id IN (
    SELECT patient_id FROM profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "Users can view own consultations" ON consultations 
FOR SELECT USING (
  patient_id IN (
    SELECT patient_id FROM profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "Users can view own AI chat sessions" ON ai_chat_sessions 
FOR SELECT USING (
  user_id IN (
    SELECT patient_id FROM profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "Users can insert own AI chat sessions" ON ai_chat_sessions 
FOR INSERT WITH CHECK (
  user_id IN (
    SELECT patient_id FROM profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "Users can view own AI chat messages" ON ai_chat_messages 
FOR SELECT USING (
  session_id IN (
    SELECT s.id FROM ai_chat_sessions s 
    JOIN profiles p ON p.patient_id = s.user_id 
    WHERE p.id = auth.uid()
  )
);

CREATE POLICY "Users can insert own AI chat messages" ON ai_chat_messages 
FOR INSERT WITH CHECK (
  session_id IN (
    SELECT s.id FROM ai_chat_sessions s 
    JOIN profiles p ON p.patient_id = s.user_id 
    WHERE p.id = auth.uid()
  )
);

-- Enable RLS on HMS tables for patient access
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to authenticated users
GRANT SELECT ON lexcare_appointments TO authenticated;
GRANT SELECT ON lexcare_consultations TO authenticated;
GRANT SELECT ON lexcare_chats TO authenticated;
GRANT SELECT ON lexcare_chat_messages TO authenticated;
GRANT SELECT ON lexcare_doctors TO authenticated;

GRANT EXECUTE ON FUNCTION insert_lexcare_chat_session TO authenticated;
GRANT EXECUTE ON FUNCTION insert_lexcare_chat_message TO authenticated;
GRANT EXECUTE ON FUNCTION book_lexcare_appointment TO authenticated;
GRANT EXECUTE ON FUNCTION submit_lexcare_consultation TO authenticated;
