import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const cats = await prisma.category.findMany({ select: { id: true, name: true } });
  console.log('Existing categories:', cats.map((c) => c.name).join(', '));

  if (cats.length > 0) {
    const ids = cats.map((c) => c.id);
    // Use raw SQL to update since Prisma Client types may not include isDefault yet in current generated client
    for (const id of ids) {
      await prisma.$executeRawUnsafe(`UPDATE categories SET "isDefault" = true WHERE id = '${id}'`);
    }
    console.log(`Marked ${ids.length} categories as isDefault=true`);
  }

  // Add Textile category
  const textileSlug = 'textile';
  const existingRows: any[] = await prisma.$queryRaw`SELECT id, name FROM categories WHERE slug = ${textileSlug} LIMIT 1`;

  if (existingRows.length === 0) {
    const count = await prisma.category.count();
    const id = require('crypto').randomUUID().replace(/-/g, '').substring(0, 25);
    await prisma.$executeRawUnsafe(
      `INSERT INTO categories (id, slug, name, icon, color, description, "order", "isActive", "isDefault", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, true, false, NOW(), NOW())`,
      id, textileSlug, 'Textile', 'shirt', 'from-[#C2517A] to-[#7F77DD]', 'Textile, confection et mode', count
    );
    console.log('Created Textile category with id:', id);
  } else if (!(existingRows[0] as any).isactive) {
    await prisma.$executeRawUnsafe(`UPDATE categories SET "isActive" = true, name = 'Textile' WHERE slug = '${textileSlug}'`);
    console.log('Reactivated Textile category');
  } else {
    console.log('Textile already active');
  }

  console.log('Done!');
}

main().then(() => prisma.$disconnect()).catch((e) => { console.error(e.message); prisma.$disconnect(); process.exit(1); });
