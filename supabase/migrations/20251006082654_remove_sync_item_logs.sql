-- Remove sync_item_logs table and related policies
-- This migration removes the sync_item_logs table as it's no longer needed
-- Only sync_sessions will be used for logging sync operations

-- Drop RLS policies for sync_item_logs
DROP POLICY IF EXISTS "Users can create item logs for their tenant sessions" ON "public"."sync_item_logs";
DROP POLICY IF EXISTS "Users can view item logs for their tenant sessions" ON "public"."sync_item_logs";

-- Drop the sync_item_logs table (this will also drop the foreign key constraint)
DROP TABLE IF EXISTS "public"."sync_item_logs";

-- Add comment for documentation
COMMENT ON TABLE "public"."sync_sessions" IS 'Sync session logs - tracks overall sync operations without individual item details';
