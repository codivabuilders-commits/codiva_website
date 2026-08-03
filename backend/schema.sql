-- Create the enrollments table for general courses
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

-- Create summer_registrations table for Summer Innovation Academy 2026
create table summer_registrations (
  id bigint primary key generated always as identity,
  parent_name text not null,
  child_name text not null,
  child_age integer not null,
  assigned_track text not null,
  parent_phone text not null,
  parent_email text not null,
  preferred_campus text default 'Online / Virtual Campus',
  agree_updates boolean default true,
  created_at timestamptz default now()
);
