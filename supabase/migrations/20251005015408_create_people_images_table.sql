-- Create people_images table for storing image metadata
-- This migration creates a table to store metadata for images associated with people
-- The actual image files will be stored in Supabase Storage

-- Create people_images table
CREATE TABLE "public"."people_images" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "person_id" text NOT NULL,
    "file_name" text NOT NULL,
    "file_path" text NOT NULL,
    "file_size" bigint,
    "mime_type" text,
    "kintone_file_key" text,
    "tenant_id" uuid NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- Add primary key constraint
ALTER TABLE "public"."people_images" 
ADD CONSTRAINT "people_images_pkey" PRIMARY KEY ("id");

-- Add foreign key constraint to people table
ALTER TABLE "public"."people_images" 
ADD CONSTRAINT "people_images_person_id_fkey" 
FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE CASCADE;

-- Add foreign key constraint to tenants table
ALTER TABLE "public"."people_images" 
ADD CONSTRAINT "people_images_tenant_id_fkey" 
FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;

-- Create indexes for better query performance
CREATE INDEX "idx_people_images_person_id" ON "public"."people_images"("person_id");
CREATE INDEX "idx_people_images_tenant_id" ON "public"."people_images"("tenant_id");
CREATE INDEX "idx_people_images_kintone_file_key" ON "public"."people_images"("kintone_file_key");

-- Enable Row Level Security
ALTER TABLE "public"."people_images" ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for tenant-based access
CREATE POLICY "people_images_tenant_access" ON "public"."people_images"
FOR ALL USING (
  tenant_id IN (
    SELECT tenant_id 
    FROM "public"."tenants" 
    WHERE id = tenant_id
  )
);

-- Create RLS policy for person-based access
CREATE POLICY "people_images_person_access" ON "public"."people_images"
FOR ALL USING (
  person_id IN (
    SELECT id 
    FROM "public"."people" 
    WHERE id = person_id
  )
);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION "public"."update_people_images_updated_at"()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER "update_people_images_updated_at"
  BEFORE UPDATE ON "public"."people_images"
  FOR EACH ROW
  EXECUTE FUNCTION "public"."update_people_images_updated_at"();

-- Add comments to document the table structure
COMMENT ON TABLE "public"."people_images" IS 'Stores metadata for images associated with people. Actual image files are stored in Supabase Storage.';
COMMENT ON COLUMN "public"."people_images"."person_id" IS 'Reference to the person this image belongs to';
COMMENT ON COLUMN "public"."people_images"."file_name" IS 'Original filename of the image';
COMMENT ON COLUMN "public"."people_images"."file_path" IS 'Path to the image file in Supabase Storage';
COMMENT ON COLUMN "public"."people_images"."file_size" IS 'Size of the image file in bytes';
COMMENT ON COLUMN "public"."people_images"."mime_type" IS 'MIME type of the image file (e.g., image/jpeg, image/png)';
COMMENT ON COLUMN "public"."people_images"."kintone_file_key" IS 'File key from Kintone for synchronization purposes';
COMMENT ON COLUMN "public"."people_images"."tenant_id" IS 'Tenant this image belongs to for multi-tenancy support';
