-- Add new fields to people table
ALTER TABLE people 
ADD COLUMN IF NOT EXISTS employee_number TEXT,
ADD COLUMN IF NOT EXISTS working_status TEXT,
ADD COLUMN IF NOT EXISTS specific_skill_field TEXT,
ADD COLUMN IF NOT EXISTS residence_card_no TEXT,
ADD COLUMN IF NOT EXISTS residence_card_expiry_date DATE,
ADD COLUMN IF NOT EXISTS residence_card_issued_date DATE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_people_working_status ON people(working_status);
CREATE INDEX IF NOT EXISTS idx_people_employee_number ON people(employee_number);
CREATE INDEX IF NOT EXISTS idx_people_residence_card_expiry ON people(residence_card_expiry_date);
