-- Create merchants table
CREATE TABLE IF NOT EXISTS merchants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  sells VARCHAR(255) NOT NULL,
  account_number VARCHAR(50),
  address TEXT NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  contact_person VARCHAR(100),
  payment_terms VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample merchants
INSERT INTO merchants (name, sells, account_number, address, phone, email, contact_person, payment_terms) VALUES
('MedSupply Co.', 'Surgical Tools, Medical Equipment', '1234567890', '123 Health St, Lagos, Nigeria', '+234 801 234 5678', 'sales@medsupply.ng', 'John Adebayo', '30 days'),
('PharmaPlus', 'Medications, Pharmaceuticals', '0987654321', '456 Cure Ave, Abuja, Nigeria', '+234 802 345 6789', 'orders@pharmaplus.ng', 'Sarah Okafor', '15 days'),
('HealthTech Solutions', 'Medical Devices, Monitoring Equipment', '1122334455', '789 Tech Boulevard, Port Harcourt, Nigeria', '+234 803 456 7890', 'info@healthtech.ng', 'Michael Eze', '45 days'),
('Global Medical Supplies', 'Laboratory Equipment, Consumables', '5566778899', '321 Medical Plaza, Kano, Nigeria', '+234 804 567 8901', 'procurement@globalmed.ng', 'Fatima Hassan', '30 days');

-- Create purchase orders table for merchant integration
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'ordered', 'received', 'cancelled')),
  total_amount DECIMAL(12,2) DEFAULT 0,
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expected_delivery DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchase order items table
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add consultation recordings table
CREATE TABLE IF NOT EXISTS consultation_recordings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  recording_type VARCHAR(20) NOT NULL CHECK (recording_type IN ('audio', 'video', 'mixed')),
  file_url TEXT NOT NULL,
  duration INTEGER, -- in seconds
  file_size BIGINT, -- in bytes
  transcription TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add AI chat sessions table
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_title VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add AI chat messages table
CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
  message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('user', 'ai')),
  content TEXT NOT NULL,
  media_type VARCHAR(20) CHECK (media_type IN ('text', 'audio', 'image', 'document')),
  media_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_merchants_status ON merchants(status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_merchant ON purchase_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_user ON ai_chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_session ON ai_chat_messages(session_id);
