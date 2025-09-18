-- Remove old visa type constraint first
ALTER TABLE visas DROP CONSTRAINT IF EXISTS visas_type_check;
