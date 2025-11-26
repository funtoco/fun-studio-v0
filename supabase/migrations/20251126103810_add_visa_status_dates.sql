-- Add status date columns to visas table for timeline tracking
-- Each column represents the date when a visa entered that specific status

ALTER TABLE "public"."visas" 
ADD COLUMN "document_preparation_date" timestamp with time zone,
ADD COLUMN "document_creation_date" timestamp with time zone,
ADD COLUMN "document_confirmation_date" timestamp with time zone,
ADD COLUMN "application_preparation_date" timestamp with time zone,
ADD COLUMN "visa_application_preparation_date" timestamp with time zone,
ADD COLUMN "application_date" timestamp with time zone,
ADD COLUMN "additional_documents_date" timestamp with time zone,
ADD COLUMN "visa_acquired_date" timestamp with time zone;

-- Add indexes for better query performance when filtering by status dates
CREATE INDEX "idx_visas_document_preparation_date" ON "public"."visas"("document_preparation_date");
CREATE INDEX "idx_visas_document_creation_date" ON "public"."visas"("document_creation_date");
CREATE INDEX "idx_visas_document_confirmation_date" ON "public"."visas"("document_confirmation_date");
CREATE INDEX "idx_visas_application_preparation_date" ON "public"."visas"("application_preparation_date");
CREATE INDEX "idx_visas_visa_application_preparation_date" ON "public"."visas"("visa_application_preparation_date");
CREATE INDEX "idx_visas_application_date" ON "public"."visas"("application_date");
CREATE INDEX "idx_visas_additional_documents_date" ON "public"."visas"("additional_documents_date");
CREATE INDEX "idx_visas_visa_acquired_date" ON "public"."visas"("visa_acquired_date");

