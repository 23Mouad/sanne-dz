// Seed categories using ts-node via npm script
const { execSync } = require('child_process');
const path = require('path');

// Run the seed via npx tsx 
process.chdir(path.join(__dirname));

const seed = `
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL } }
});

async function main() {
  const cats = await prisma.category.findMany({ select: { id: true, name: true } });
  console.log('Existing categories:', cats.map((c: any) => c.name).join(', '));

  if (cats.length > 0) {
    const ids = cats.map((c: any) => c.id);
    await (prisma.category as any).updateMany({
      where: { id: { in: ids } },
      data: { isDefault: true },
    });
    console.log('Marked ' + ids.length + ' categories as isDefault=true');
  }

  const textileSlug = 'textile';
  const existingTextile = await prisma.category.findUnique({ where: { slug: textileSlug } });
  if (!existingTextile) {
    const count = await prisma.category.count();
    await prisma.category.create({
      data: {
        name: 'Textile',
        slug: textileSlug,
        icon: 'shirt',
        color: 'from-[#C2517A] to-[#7F77DD]',
        description: 'Textile, confection et mode',
        order: count,
        isDefault: false,
        isActive: true,
      } as any,
    });
    console.log('Created Textile category');
  } else {
    console.log('Textile already exists');
  }
  console.log('Done!');
}

main().then(() => prisma.$disconnect()).catch((e: any) => { console.error(e.message); prisma.$disconnect(); });
`;

require('fs').writeFileSync('seed_categories.ts', seed);
console.log('Written seed_categories.ts');
