-- Insert sample beds
INSERT INTO beds (bed_number, ward, bed_type, status, notes) VALUES
('A101', 'General Ward A', 'general', 'available', 'Standard bed with basic amenities'),
('A102', 'General Ward A', 'general', 'occupied', 'Standard bed with basic amenities'),
('A103', 'General Ward A', 'general', 'available', 'Standard bed with basic amenities'),
('B201', 'ICU Ward B', 'icu', 'available', 'ICU bed with advanced monitoring'),
('B202', 'ICU Ward B', 'icu', 'occupied', 'ICU bed with advanced monitoring'),
('C301', 'Private Ward C', 'private', 'available', 'Private room with attached bathroom'),
('C302', 'Private Ward C', 'private', 'reserved', 'Private room with attached bathroom'),
('D401', 'Semi-Private Ward D', 'semi-private', 'available', 'Semi-private room for 2 patients'),
('D402', 'Semi-Private Ward D', 'semi-private', 'maintenance', 'Semi-private room for 2 patients');

-- Assign some patients to beds
UPDATE beds SET 
  patient_id = (SELECT id FROM patients WHERE full_name = 'John Doe'),
  assigned_date = NOW() - INTERVAL '2 days'
WHERE bed_number = 'A102';

UPDATE beds SET 
  patient_id = (SELECT id FROM patients WHERE full_name = 'Mary Johnson'),
  assigned_date = NOW() - INTERVAL '1 day'
WHERE bed_number = 'B202';

-- Insert sample bed assignments
INSERT INTO bed_assignments (bed_id, patient_id, assigned_by, assigned_date, reason_for_admission) VALUES
((SELECT id FROM beds WHERE bed_number = 'A102'), (SELECT id FROM patients WHERE full_name = 'John Doe'), (SELECT id FROM users WHERE email = 'dr.benson@lexcare.com'), NOW() - INTERVAL '2 days', 'Post-operative care'),
((SELECT id FROM beds WHERE bed_number = 'B202'), (SELECT id FROM patients WHERE full_name = 'Mary Johnson'), (SELECT id FROM users WHERE email = 'dr.benson@lexcare.com'), NOW() - INTERVAL '1 day', 'Respiratory monitoring');

-- Update inventory with additional data
UPDATE inventory SET 
  reorder_level = minimum_stock + 20,
  last_restocked = CURRENT_DATE - INTERVAL '10 days',
  cost_per_unit = unit_price * 0.8
WHERE item_name = 'Paracetamol 500mg';

UPDATE inventory SET 
  reorder_level = minimum_stock + 50,
  last_restocked = CURRENT_DATE - INTERVAL '5 days',
  cost_per_unit = unit_price * 0.9
WHERE item_name = 'Surgical Gloves';

-- Insert sample inventory transactions
INSERT INTO inventory_transactions (inventory_id, transaction_type, quantity, unit_cost, total_cost, reference_number, notes, created_by) VALUES
((SELECT id FROM inventory WHERE item_name = 'Paracetamol 500mg'), 'in', 100, 0.40, 40.00, 'PO-2024-001', 'Monthly restock', (SELECT id FROM users WHERE email = 'admin@lexcare.com')),
((SELECT id FROM inventory WHERE item_name = 'Surgical Gloves'), 'out', 25, 1.80, 45.00, 'REQ-2024-001', 'Surgery department request', (SELECT id FROM users WHERE email = 'dr.benson@lexcare.com'));
