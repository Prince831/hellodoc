-- Create profiles table to store user roles and additional info
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null default 'patient',
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert example roles for existing users (optional)
-- insert into profiles (id, role, full_name) values ('user-uuid-1', 'doctor', 'Dr. John Doe');
-- insert into profiles (id, role, full_name) values ('user-uuid-2', 'admin', 'Admin User');
