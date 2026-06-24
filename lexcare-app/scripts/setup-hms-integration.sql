-- Setup script for LexCare integration with existing HMS database
-- This script creates the necessary tables and functions that don't exist in HMS

-- Create notifications table for LexCare
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'general' CHECK (type IN ('appointment', 'consultation', 'payment', 'alert', 'general')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vital_signs table for health tracking
CREATE TABLE IF NOT EXISTS vital_signs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  temperature DECIMAL(4,1),
  blood_pressure TEXT,
  heart_rate INTEGER,
  weight DECIMAL(5,2),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table for LexCare
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_method TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback table for LexCare
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health_records table for LexCare (separate from consultations)
CREATE TABLE IF NOT EXISTS health_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  record_type TEXT NOT NULL CHECK (record_type IN ('diagnosis', 'allergy', 'medication', 'procedure', 'lab_result', 'vaccination')),
  record_date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  doctor_name TEXT,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high')),
  status TEXT CHECK (status IN ('active', 'resolved', 'chronic')),
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on new tables
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for patients to access their own data
CREATE POLICY "Patients can view own notifications" ON notifications FOR SELECT USING (
  user_id IN (
    SELECT id FROM patients WHERE email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Patients can update own notifications" ON notifications FOR UPDATE USING (
  user_id IN (
    SELECT id FROM patients WHERE email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Patients can view own vital signs" ON vital_signs FOR SELECT USING (
  user_id IN (
    SELECT id FROM patients WHERE email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Patients can insert own vital signs" ON vital_signs FOR INSERT WITH CHECK (
  user_id IN (
    SELECT id FROM patients WHERE email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Patients can view own payments" ON payments FOR SELECT USING (
  user_id IN (
    SELECT id FROM patients WHERE email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Patients can insert own payments" ON payments FOR INSERT WITH CHECK (
  user_id IN (
    SELECT id FROM patients WHERE email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Patients can view own feedback" ON feedback FOR SELECT USING (
  user_id IN (
    SELECT id FROM patients WHERE email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Patients can insert own feedback" ON feedback FOR INSERT WITH CHECK (
  user_id IN (
    SELECT id FROM patients WHERE email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Patients can view own health records" ON health_records FOR SELECT USING (
  user_id IN (
    SELECT id FROM patients WHERE email = auth.jwt() ->> 'email'
  )
);

-- Create views for LexCare compatibility with HMS tables
CREATE OR REPLACE VIEW lexcare_appointments AS
SELECT 
  a.id,
  a.patient_id as user_id,
  u.full_name as doctor_name,
  COALESCE(u.title, 'General Practice') as department,
  a.appointment_date::date as date,
  a.appointment_date::time as time,
  COALESCE(u.location, 'Hospital Main Building') as location,
  a.notes,
  a.status,
  a.created_at
FROM appointments a
JOIN users u ON a.doctor_id = u.id
WHERE a.patient_id IN (
  SELECT id FROM patients WHERE email = auth.jwt() ->> 'email'
);

CREATE OR REPLACE VIEW lexcare_consultations AS
SELECT 
  c.id,
  c.patient_id as user_id,
  CASE 
    WHEN c.diagnosis IS NOT NULL THEN 'completed'
    ELSE 'pending'
  END as status,
  c.symptoms,
  c.diagnosis as ai_recommendation,
  CASE WHEN c.diagnosis IS NOT NULL THEN true ELSE false END as doctor_approved,
  c.notes as doctor_notes,
  c.created_at
FROM consultations c
WHERE c.patient_id IN (
  SELECT id FROM patients WHERE email = auth.jwt() ->> 'email'
);

CREATE OR REPLACE VIEW lexcare_chats AS
SELECT 
  s.id,
  s.user_id,
  COALESCE(s.session_title, 'Health Chat') as title,
  s.created_at
FROM ai_chat_sessions s
WHERE s.user_id IN (
  SELECT id FROM patients WHERE email = auth.jwt() ->> 'email'
) AND s.status = 'active';

CREATE OR REPLACE VIEW lexcare_chat_messages AS
SELECT 
  m.id,
  s.user_id,
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
WHERE s.user_id IN (
  SELECT id FROM patients WHERE email = auth.jwt() ->> 'email'
);

-- Grant permissions
GRANT SELECT ON lexcare_appointments TO authenticated;
GRANT SELECT ON lexcare_consultations TO authenticated;
GRANT SELECT ON lexcare_chats TO authenticated;
GRANT SELECT ON lexcare_chat_messages TO authenticated;

-- Create function to get current patient ID from auth
CREATE OR REPLACE FUNCTION get_current_patient_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id FROM patients 
    WHERE email = auth.jwt() ->> 'email'
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
