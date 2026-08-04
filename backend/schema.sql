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
