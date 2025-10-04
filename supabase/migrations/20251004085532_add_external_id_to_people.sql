-- Add external_id column to people table
-- This migration adds an external_id column to the people table
-- which can be used as an update key for external system integration

-- Add external_id column to people table
ALTER TABLE "public"."people" 
ADD COLUMN "external_id" text;

-- Create index for better query performance on external_id
CREATE INDEX "idx_people_external_id" ON "public"."people"("external_id");

-- Create unique constraint on external_id to ensure it can be used as an update key
-- Note: This allows NULL values, so multiple NULLs are allowed
CREATE UNIQUE INDEX "idx_people_external_id_unique" ON "public"."people"("external_id") 
WHERE "external_id" IS NOT NULL;

-- Add comment to document the purpose of the column
COMMENT ON COLUMN "public"."people"."external_id" IS 'External system identifier that can be used as an update key for integration purposes';
