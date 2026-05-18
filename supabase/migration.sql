-- ============================================================
-- ITU İrem Vardar Giysi Odası - Supabase Migration
-- Creates: users, inventory, reservations tables
-- ============================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL CHECK (role IN ('student', 'admin', 'coordinator')) DEFAULT 'student',
  password_hash TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. INVENTORY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category TEXT NOT NULL,
  size TEXT NOT NULL,
  condition TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('AVAILABLE', 'RESERVED', 'APPROVED', 'REJECTED')) DEFAULT 'AVAILABLE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. RESERVATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_email TEXT NOT NULL,
  item_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
  pickup_date TEXT NOT NULL,
  pickup_time TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')) DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS but allow anon key full access for this demo app.
-- In production, you would tighten these policies.
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Users: allow read for login checks, allow insert for registration
CREATE POLICY "Allow public read on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert on users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on users" ON users FOR UPDATE USING (true);

-- Inventory: full access for the demo
CREATE POLICY "Allow public read on inventory" ON inventory FOR SELECT USING (true);
CREATE POLICY "Allow public insert on inventory" ON inventory FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on inventory" ON inventory FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on inventory" ON inventory FOR DELETE USING (true);

-- Reservations: full access for the demo
CREATE POLICY "Allow public read on reservations" ON reservations FOR SELECT USING (true);
CREATE POLICY "Allow public insert on reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on reservations" ON reservations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on reservations" ON reservations FOR DELETE USING (true);

-- ============================================================
-- 5. SEED DATA - Default Users
-- ============================================================
INSERT INTO users (email, name, role, password_hash) VALUES
  ('bingolh23@itu.edu.tr', 'Hilal Ayça Bingöl', 'student', 'bingolh23'),
  ('bingola23@itu.edu.tr', 'Admin Yönetici', 'admin', 'bingola23'),
  ('coord@itu.edu.tr', 'Koordinatör Üye', 'coordinator', 'coord123')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- 6. SEED DATA - Initial Inventory
-- ============================================================
INSERT INTO inventory (category, size, condition, image_url, status) VALUES
  ('Mont', 'L', 'Yeni Gibi', 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600&auto=format&fit=crop', 'AVAILABLE'),
  ('Kot Pantolon', 'M', 'İyi', 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop', 'AVAILABLE'),
  ('Kazak', 'S', 'Çok İyi', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop', 'AVAILABLE'),
  ('Sweatshirt', 'XL', 'Eski', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop', 'AVAILABLE');
