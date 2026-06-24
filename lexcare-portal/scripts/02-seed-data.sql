-- Insert sample users
INSERT INTO users (email, full_name, role, title, phone, location) VALUES
('dr.benson@lexcare.com', 'Dr. Benson Okwu', 'doctor', 'Senior Physician', '+234 123 456 7890', 'Enugu State, Nigeria'),
('admin@lexcare.com', 'Sarah Johnson', 'admin', 'Hospital Administrator', '+234 123 456 7891', 'Ngorongoro, Tanzania'),
('nurse.mary@lexcare.com', 'Mary Chukwu', 'staff', 'Senior Nurse', '+234 123 456 7892', 'Enugu State, Nigeria'),
('dr.smith@lexcare.com', 'Dr. John Smith', 'doctor', 'Cardiologist', '+234 123 456 7893', 'Lagos, Nigeria');

-- Insert sample patients
INSERT INTO patients (full_name, email, phone, date_of_birth, gender, address, emergency_contact, emergency_phone) VALUES
('John Doe', 'john.doe@email.com', '+234 123 456 7894', '1985-06-15', 'Male', '123 Main St, Lagos, Nigeria', 'Jane Doe', '+234 123 456 7895'),
('Mary Johnson', 'mary.johnson@email.com', '+234 123 456 7896', '1990-03-22', 'Female', '456 Oak Ave, Abuja, Nigeria', 'Robert Johnson', '+234 123 456 7897'),
('David Wilson', 'david.wilson@email.com', '+234 123 456 7898', '1978-11-08', 'Male', '789 Pine St, Kano, Nigeria', 'Lisa Wilson', '+234 123 456 7899');

-- Insert sample appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, status, notes) VALUES
((SELECT id FROM patients WHERE full_name = 'John Doe'), (SELECT id FROM users WHERE email = 'dr.benson@lexcare.com'), '2024-01-15 10:00:00+00', 'completed', 'Regular checkup'),
((SELECT id FROM patients WHERE full_name = 'Mary Johnson'), (SELECT id FROM users WHERE email = 'dr.benson@lexcare.com'), '2024-01-16 14:30:00+00', 'completed', 'Follow-up consultation'),
((SELECT id FROM patients WHERE full_name = 'David Wilson'), (SELECT id FROM users WHERE email = 'dr.smith@lexcare.com'), '2024-01-17 09:00:00+00', 'scheduled', 'Cardiac evaluation');

-- Insert sample consultations
INSERT INTO consultations (patient_id, doctor_id, consultation_date, symptoms, diagnosis, treatment) VALUES
((SELECT id FROM patients WHERE full_name = 'John Doe'), (SELECT id FROM users WHERE email = 'dr.benson@lexcare.com'), '2024-01-15 10:00:00+00', 'Headache, fatigue', 'Tension headache', 'Rest, hydration, pain relief'),
((SELECT id FROM patients WHERE full_name = 'Mary Johnson'), (SELECT id FROM users WHERE email = 'dr.benson@lexcare.com'), '2024-01-16 14:30:00+00', 'Cough, fever', 'Upper respiratory infection', 'Antibiotics, rest');

-- Insert sample chats
INSERT INTO chats (sender_id, receiver_id, message, is_read) VALUES
((SELECT id FROM users WHERE email = 'nurse.mary@lexcare.com'), (SELECT id FROM users WHERE email = 'dr.benson@lexcare.com'), 'Patient in room 205 needs attention', false),
((SELECT id FROM users WHERE email = 'admin@lexcare.com'), (SELECT id FROM users WHERE email = 'dr.benson@lexcare.com'), 'Monthly report is ready for review', false),
((SELECT id FROM users WHERE email = 'dr.smith@lexcare.com'), (SELECT id FROM users WHERE email = 'dr.benson@lexcare.com'), 'Can you cover my shift tomorrow?', true);

-- Insert sample inventory
INSERT INTO inventory (item_name, category, current_stock, minimum_stock, unit_price, supplier) VALUES
('Paracetamol 500mg', 'Medication', 150, 50, 0.50, 'PharmaCorp Ltd'),
('Surgical Gloves', 'Medical Supplies', 200, 100, 2.00, 'MedSupply Inc'),
('Blood Pressure Monitor', 'Equipment', 5, 2, 150.00, 'MedTech Solutions'),
('Bandages', 'Medical Supplies', 75, 25, 1.50, 'HealthCare Supplies');

-- Insert sample staff shifts
INSERT INTO staff_shifts (staff_id, shift_date, start_time, end_time, status) VALUES
((SELECT id FROM users WHERE email = 'nurse.mary@lexcare.com'), '2024-01-15', '08:00:00', '16:00:00', 'completed'),
((SELECT id FROM users WHERE email = 'nurse.mary@lexcare.com'), '2024-01-16', '08:00:00', '16:00:00', 'scheduled'),
((SELECT id FROM users WHERE email = 'dr.benson@lexcare.com'), '2024-01-15', '09:00:00', '17:00:00', 'completed');
