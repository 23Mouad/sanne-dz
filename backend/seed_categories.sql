-- Mark all existing active categories as isDefault = true
UPDATE categories SET "isDefault" = true WHERE "isActive" = true AND "isDefault" = false;

-- Insert Textile category if it doesn't exist
INSERT INTO categories (id, slug, name, icon, color, description, "order", "isActive", "isDefault", "createdAt", "updatedAt")
SELECT 
  substr(md5(random()::text), 1, 25),
  'textile',
  'Textile',
  'shirt',
  'from-[#C2517A] to-[#7F77DD]',
  'Textile, confection et mode',
  (SELECT COUNT(*) FROM categories),
  true,
  false,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'textile');

-- Reactivate Textile if it was soft-deleted
UPDATE categories SET "isActive" = true WHERE slug = 'textile' AND "isActive" = false;
