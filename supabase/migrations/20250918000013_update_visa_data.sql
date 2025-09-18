-- Update visa data to new types
UPDATE visas SET type = '認定申請' WHERE type = '新規';
UPDATE visas SET type = '更新申請' WHERE type = '更新';

-- Diversify visa types for better sample data
UPDATE visas SET type = '変更申請' WHERE id IN ('v003', 'v008', 'v016');
UPDATE visas SET type = '特定活動申請' WHERE id IN ('v005', 'v012');
UPDATE visas SET type = '資格変更（特定技能2号）' WHERE id IN ('v009', 'v020');
