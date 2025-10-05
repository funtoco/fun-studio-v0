-- Add image_path column to people table
-- This migration adds a simple image_path column to store the path to the person's image in Supabase Storage

-- Add image_path column to people table
ALTER TABLE "public"."people" 
ADD COLUMN "image_path" text;

-- Add comment to document the purpose of the column
COMMENT ON COLUMN "public"."people"."image_path" IS 'Path to the person image file in Supabase Storage (people-images bucket)';
