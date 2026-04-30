-- Create the enrollments table
create table enrollments (
  id bigint primary key generated always as identity,
  child_name text not null,
  child_age integer not null,
  parent_name text not null,
  parent_email text not null,
  parent_phone text not null,
  course text not null,
  learning_mode text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security (optional but recommended)
-- alter table enrollments enable row level security;

-- Create a policy that allows anyone to insert (since it's a public signup form)
-- create policy "Allow anyone to enroll" on enrollments for insert with check (true);
