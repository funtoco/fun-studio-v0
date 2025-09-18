-- Add new constraint with updated visa types
ALTER TABLE visas ADD CONSTRAINT visas_type_check 
CHECK (type IN ('認定申請', '変更申請', '更新申請', '特定活動申請', '資格変更（特定技能2号）'));
