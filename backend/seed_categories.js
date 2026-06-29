const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Get all categories
  const cats = await prisma.category.findMany({ select: { id: true, name: true, slug: true, isActive: true } });
  console.log('Existing categories:', cats.map(c => c.name));

  // 2. Mark all currently active categories as isDefault = true (these are the original seeded ones)
  if (cats.length > 0) {
    const ids = cats.map(c => c.id);
    await prisma.category.updateMany({
      where: { id: { in: ids } },
      data: { isDefault: true },
    });
    console.log(`Marked ${ids.length} categories as isDefault=true`);
  }

  // 3. Add "Textile" as a new main category (not default — it's new)
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
        isDefault: false, // new category, can be edited
        isActive: true,
      },
    });
    console.log('Created "Textile" category');
  } else if (!existingTextile.isActive) {
    await prisma.category.update({
      where: { slug: textileSlug },
      data: { isActive: true, name: 'Textile' },
    });
    console.log('Reactivated "Textile" category');
  } else {
    console.log('"Textile" category already exists and is active');
  }

  console.log('Done!');
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
