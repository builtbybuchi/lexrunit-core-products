-- Insert sample health records
INSERT INTO health_records (user_id, record_type, record_date, title, description, doctor_name, severity, status, details) VALUES
(auth.uid(), 'diagnosis', '2024-01-15', 'Hypertension', 'High blood pressure diagnosed during routine checkup', 'Smith', 'medium', 'active', '{"systolic": 145, "diastolic": 95, "medication_prescribed": "Lisinopril 10mg"}'),
(auth.uid(), 'allergy', '2023-08-20', 'Penicillin Allergy', 'Severe allergic reaction to penicillin antibiotics', 'Johnson', 'high', 'active', '{"reaction_type": "anaphylaxis", "alternative_medications": ["Cephalexin", "Azithromycin"]}'),
(auth.uid(), 'medication', '2024-01-15', 'Lisinopril', 'Blood pressure medication', 'Smith', 'low', 'active', '{"dosage": "10mg", "frequency": "once daily", "start_date": "2024-01-15"}'),
(auth.uid(), 'vaccination', '2023-10-01', 'Flu Vaccine', 'Annual influenza vaccination', 'Nurse Williams', 'low', 'completed', '{"vaccine_type": "Quadrivalent", "lot_number": "FL2023-001"}'),
(auth.uid(), 'lab_result', '2024-01-10', 'Blood Panel', 'Comprehensive metabolic panel results', 'Smith', 'low', 'completed', '{"cholesterol": 180, "glucose": 95, "hemoglobin": 14.2}');

-- Insert sample appointments
INSERT INTO appointments (user_id, doctor_name, department, date, time, location, notes, status) VALUES
(auth.uid(), 'Dr. Sarah Smith', 'Cardiology', '2024-02-15', '10:00', 'Building A, Room 205', 'Follow-up for hypertension', 'upcoming'),
(auth.uid(), 'Dr. Michael Johnson', 'General Practice', '2024-02-20', '14:30', 'Building B, Room 101', 'Annual physical exam', 'upcoming'),
(auth.uid(), 'Dr. Emily Davis', 'Dermatology', '2024-01-05', '09:15', 'Building C, Room 302', 'Skin check completed', 'completed');

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(auth.uid(), 'Appointment Reminder', 'You have an appointment with Dr. Smith tomorrow at 10:00 AM', 'appointment', false),
(auth.uid(), 'Consultation Complete', 'Your AI consultation results are ready for review', 'consultation', false),
(auth.uid(), 'Payment Processed', 'Your payment of $50.00 has been successfully processed', 'payment', true),
(auth.uid(), 'Health Alert', 'Your blood pressure reading is elevated. Please monitor closely.', 'alert', false);

-- Insert sample vital signs
INSERT INTO vital_signs (user_id, temperature, blood_pressure, heart_rate, weight, recorded_at) VALUES
(auth.uid(), 36.8, '120/80', 72, 70.5, '2024-01-20 08:00:00'),
(auth.uid(), 37.1, '125/85', 78, 70.3, '2024-01-19 08:00:00'),
(auth.uid(), 36.9, '118/78', 70, 70.7, '2024-01-18 08:00:00'),
(auth.uid(), 36.7, '122/82', 75, 70.4, '2024-01-17 08:00:00'),
(auth.uid(), 37.0, '128/88', 80, 70.6, '2024-01-16 08:00:00');

-- Insert sample chat
INSERT INTO chats (user_id, title) VALUES
(auth.uid(), 'General Health Questions');

-- Insert sample chat messages
INSERT INTO chat_messages (user_id, chat_id, content, is_ai) VALUES
(auth.uid(), (SELECT id FROM chats WHERE user_id = auth.uid() LIMIT 1), 'Hello! I have some questions about my blood pressure readings.', false),
(auth.uid(), (SELECT id FROM chats WHERE user_id = auth.uid() LIMIT 1), 'I''d be happy to help you with questions about blood pressure. What specific concerns do you have about your readings?', true),
(auth.uid(), (SELECT id FROM chats WHERE user_id = auth.uid() LIMIT 1), 'My recent reading was 128/88. Is this considered high?', false),
(auth.uid(), (SELECT id FROM chats WHERE user_id = auth.uid() LIMIT 1), 'A reading of 128/88 mmHg falls into the Stage 1 Hypertension category according to current guidelines. While this is elevated, it''s important to take multiple readings and consult with your healthcare provider for proper evaluation and management.', true);

-- Insert sample payments
INSERT INTO payments (user_id, amount, status, payment_method, description) VALUES
(auth.uid(), 50.00, 'completed', '**** **** **** 1234', 'AI Consultation Fee'),
(auth.uid(), 25.00, 'completed', '**** **** **** 1234', 'Health Records Export'),
(auth.uid(), 75.00, 'pending', '**** **** **** 1234', 'Specialist Consultation');

-- Insert sample feedback
INSERT INTO feedback (user_id, rating, comment) VALUES
(auth.uid(), 5, 'Excellent app! The AI consultation feature is very helpful and the interface is user-friendly.'),
(auth.uid(), 4, 'Great health tracking features. Would love to see more chart options.');
