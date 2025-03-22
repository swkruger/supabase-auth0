-- Drop tables with CASCADE to handle dependencies
DROP TABLE IF EXISTS todos CASCADE;
DROP TABLE IF EXISTS folios CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create the users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,  -- Removed UNIQUE constraint from email
  auth0_id TEXT NOT NULL UNIQUE,  -- Added UNIQUE constraint to auth0_id
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the folios table
CREATE TABLE folios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

-- Create the todos table
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

-- Create indexes
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_users_auth0_id ON users(auth0_id);
CREATE INDEX idx_folios_user_id ON folios(user_id);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE folios ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read and update their own records
CREATE POLICY users_policy_self ON users 
  FOR ALL 
  USING (auth.uid()::text = auth0_id)
  WITH CHECK (auth.uid()::text = auth0_id);

-- Create policy to allow inserting new users
CREATE POLICY users_policy_insert ON users 
  FOR INSERT 
  WITH CHECK (true);

-- Policies for todos
CREATE POLICY todos_policy_select ON todos 
  FOR SELECT 
  USING (user_id IN (SELECT id FROM users WHERE auth0_id = auth.uid()::text));

CREATE POLICY todos_policy_insert ON todos 
  FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth0_id = auth.uid()::text));

CREATE POLICY todos_policy_update ON todos 
  FOR UPDATE 
  USING (user_id IN (SELECT id FROM users WHERE auth0_id = auth.uid()::text))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth0_id = auth.uid()::text));

CREATE POLICY todos_policy_delete ON todos 
  FOR DELETE 
  USING (user_id IN (SELECT id FROM users WHERE auth0_id = auth.uid()::text));

-- Policies for folios
CREATE POLICY folios_policy_select ON folios 
  FOR SELECT 
  USING (user_id IN (SELECT id FROM users WHERE auth0_id = auth.uid()::text));

CREATE POLICY folios_policy_insert ON folios 
  FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth0_id = auth.uid()::text));

CREATE POLICY folios_policy_update ON folios 
  FOR UPDATE 
  USING (user_id IN (SELECT id FROM users WHERE auth0_id = auth.uid()::text))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth0_id = auth.uid()::text));

CREATE POLICY folios_policy_delete ON folios 
  FOR DELETE 
  USING (user_id IN (SELECT id FROM users WHERE auth0_id = auth.uid()::text));