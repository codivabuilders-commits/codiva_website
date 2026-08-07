-- Enrollments table for general courses and multi-children registrations
CREATE TABLE IF NOT EXISTS enrollments (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  parent_name text NOT NULL,
  parent_email text NOT NULL,
  parent_phone text NOT NULL,
  child_name text,
  child_age integer,
  course text,
  learning_mode text DEFAULT 'Online',
  children_json jsonb,
  amount numeric DEFAULT 0,
  discount_amount numeric DEFAULT 0,
  payment_status text DEFAULT 'Pending Payment',
  payment_method text DEFAULT 'Pay Later',
  payment_reference text,
  created_at timestamptz DEFAULT now()
);

-- Summer registrations table for Summer Innovation Academy
CREATE TABLE IF NOT EXISTS summer_registrations (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  parent_name text NOT NULL,
  child_name text,
  child_age integer,
  assigned_track text,
  parent_phone text NOT NULL,
  parent_email text NOT NULL,
  preferred_campus text DEFAULT 'Online / Virtual Campus',
  agree_updates boolean DEFAULT true,
  children_json jsonb,
  amount numeric DEFAULT 0,
  discount_amount numeric DEFAULT 0,
  payment_status text DEFAULT 'Pending Payment',
  payment_method text DEFAULT 'Pay Later',
  payment_reference text,
  created_at timestamptz DEFAULT now()
);

-- Alter existing tables if they already exist without newer columns
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS children_json jsonb;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS amount numeric DEFAULT 0;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS discount_amount numeric DEFAULT 0;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'Pending Payment';
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'Pay Later';
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS payment_reference text;

ALTER TABLE summer_registrations ADD COLUMN IF NOT EXISTS children_json jsonb;
ALTER TABLE summer_registrations ADD COLUMN IF NOT EXISTS amount numeric DEFAULT 0;
ALTER TABLE summer_registrations ADD COLUMN IF NOT EXISTS discount_amount numeric DEFAULT 0;
ALTER TABLE summer_registrations ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'Pending Payment';
ALTER TABLE summer_registrations ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'Pay Later';
ALTER TABLE summer_registrations ADD COLUMN IF NOT EXISTS payment_reference text;

-- Codiva heart keep-alive table
CREATE TABLE IF NOT EXISTS codivaheart (
  id INT PRIMARY KEY,
  last_ping TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  counter BIGINT DEFAULT 1
);

-- Initialize the single row if it doesn't exist
INSERT INTO codivaheart (id, counter) VALUES (1, 1) ON CONFLICT (id) DO NOTHING;

-- Promo Codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  code text UNIQUE NOT NULL,
  description text,
  discount_type text NOT NULL, -- 'percentage' | 'fixed'
  discount_value numeric NOT NULL,
  applies_to text DEFAULT 'All Programs',
  min_purchase numeric DEFAULT 0,
  max_discount numeric DEFAULT NULL,
  usage_limit integer DEFAULT NULL,
  usage_count integer DEFAULT 0,
  one_per_parent boolean DEFAULT false,
  expiry_date timestamptz DEFAULT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Promo Usages table
CREATE TABLE IF NOT EXISTS promo_usages (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  promo_id bigint REFERENCES promo_codes(id) ON DELETE CASCADE,
  promo_code text NOT NULL,
  parent_email text NOT NULL,
  order_reference text,
  discount_amount numeric NOT NULL,
  used_at timestamptz DEFAULT now()
);

-- Special Pricings table (One-off override links)
CREATE TABLE IF NOT EXISTS special_pricings (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  token text UNIQUE NOT NULL,
  parent_name text NOT NULL,
  parent_email text NOT NULL,
  parent_phone text NOT NULL,
  program text NOT NULL,
  num_children integer DEFAULT 1,
  original_price numeric NOT NULL,
  override_price numeric NOT NULL,
  discount_amount numeric NOT NULL,
  reason text,
  expiry_date timestamptz DEFAULT NULL,
  status text DEFAULT 'Pending', -- 'Pending' | 'Paid' | 'Expired' | 'Cancelled'
  payment_method text,
  payment_reference text,
  paid_at timestamptz DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

-- Discount Audit Logs table
CREATE TABLE IF NOT EXISTS discount_audit_logs (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  details jsonb,
  created_at timestamptz DEFAULT now()
);


