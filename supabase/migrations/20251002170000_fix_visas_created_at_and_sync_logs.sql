-- Fix visas table to add created_at column and update sync_item_logs constraint
-- This migration addresses the visa sync errors by adding missing created_at column
-- and updating the constraint to allow 'visas' (plural) in sync_item_logs

-- Add created_at column to visas table
ALTER TABLE "public"."visas" 
ADD COLUMN "created_at" timestamp with time zone DEFAULT now();

-- Update existing visas records to have created_at set to updated_at if not set
UPDATE "public"."visas" 
SET "created_at" = "updated_at" 
WHERE "created_at" IS NULL;

-- Make created_at NOT NULL after updating existing records
ALTER TABLE "public"."visas" 
ALTER COLUMN "created_at" SET NOT NULL;

-- First, update existing 'visa' records to 'visas' in sync_item_logs
UPDATE "public"."sync_item_logs" 
SET "item_type" = 'visas' 
WHERE "item_type" = 'visa';

-- Drop the existing constraint that only allows 'people' and 'visa' (singular)
ALTER TABLE "public"."sync_item_logs" 
DROP CONSTRAINT "sync_item_logs_item_type_check";

-- Add new constraint that allows 'people' and 'visas' (plural)
ALTER TABLE "public"."sync_item_logs" 
ADD CONSTRAINT "sync_item_logs_item_type_check" 
CHECK ((item_type = ANY (ARRAY['people'::text, 'visas'::text])));
