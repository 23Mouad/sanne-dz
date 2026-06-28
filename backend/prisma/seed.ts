import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const WILAYAS = [
  { id: '01', name: 'Adrar' }, { id: '02', name: 'Chlef' }, { id: '03', name: 'Laghouat' },
  { id: '04', name: 'Oum El Bouaghi' }, { id: '05', name: 'Batna' }, { id: '06', name: 'Béjaïa' },
  { id: '07', name: 'Biskra' }, { id: '08', name: 'Béchar' }, { id: '09', name: 'Blida' },
  { id: '10', name: 'Bouira' }, { id: '11', name: 'Tamanrasset' }, { id: '12', name: 'Tébessa' },
  { id: '13', name: 'Tlemcen' }, { id: '14', name: 'Tiaret' }, { id: '15', name: 'Tizi Ouzou' },
  { id: '16', name: 'Alger' }, { id: '17', name: 'Djelfa' }, { id: '18', name: 'Jijel' },
  { id: '19', name: 'Sétif' }, { id: '20', name: 'Saïda' }, { id: '21', name: 'Skikda' },
  { id: '22', name: 'Sidi Bel Abbès' }, { id: '23', name: 'Annaba' }, { id: '24', name: 'Guelma' },
  { id: '25', name: 'Constantine' }, { id: '26', name: 'Médéa' }, { id: '27', name: 'Mostaganem' },
  { id: '28', name: "M'Sila" }, { id: '29', name: 'Mascara' }, { id: '30', name: 'Ouargla' },
  { id: '31', name: 'Oran' }, { id: '32', name: 'El Bayadh' }, { id: '33', name: 'Illizi' },
  { id: '34', name: 'Bordj Bou Arréridj' }, { id: '35', name: 'Boumerdès' }, { id: '36', name: 'El Tarf' },
  { id: '37', name: 'Tindouf' }, { id: '38', name: 'Tissemsilt' }, { id: '39', name: 'El Oued' },
  { id: '40', name: 'Khenchela' }, { id: '41', name: 'Souk Ahras' }, { id: '42', name: 'Tipaza' },
  { id: '43', name: 'Mila' }, { id: '44', name: 'Aïn Defla' }, { id: '45', name: 'Naâma' },
  { id: '46', name: 'Aïn Témouchent' }, { id: '47', name: 'Ghardaïa' }, { id: '48', name: 'Relizane' },
  { id: '49', name: 'Timimoun' }, { id: '50', name: 'Bordj Badji Mokhtar' }, { id: '51', name: 'Ouled Djellal' },
  { id: '52', name: 'Béni Abbès' }, { id: '53', name: 'In Salah' }, { id: '54', name: 'In Guezzam' },
  { id: '55', name: 'Touggourt' }, { id: '56', name: 'Djanet' }, { id: '57', name: "El M'Ghair" },
  { id: '58', name: 'El Meniaa' }, { id: '59', name: 'Aflou' }, { id: '60', name: 'El Abiodh Sidi Cheikh' },
  { id: '61', name: 'El Aricha' }, { id: '62', name: 'El Kantara' }, { id: '63', name: 'Barika' },
  { id: '64', name: 'Bou Saâda' }, { id: '65', name: 'Bir El Ater' }, { id: '66', name: 'Ksar El Boukhari' },
  { id: '67', name: 'Ksar Chellala' }, { id: '68', name: 'Aïn Oussara' }, { id: '69', name: "M'saâd" },
];

const CATEGORIES = [
  { slug: 'ateliers-couture', name: 'Ateliers de couture', icon: 'scissors', color: 'from-pink-400 to-rose-500', description: 'Ateliers de confection, sur-mesure et prêt-à-porter', order: 0,
    subCategories: [
      { slug: 'robes-traditionnelles', name: 'Robes traditionnelles' },
      { slug: 'robes-mariee', name: 'Robes de mariée' },
      { slug: 'pret-a-porter', name: 'Prêt-à-porter' },
    ],
  },
  { slug: 'modelistes', name: 'Modélistes', icon: 'pen-tool', color: 'from-blue-400 to-indigo-500', description: 'Création de modèles et stylisme', order: 1 },
  { slug: 'patronistes', name: 'Patronistes', icon: 'ruler', color: 'from-purple-400 to-pink-500', description: 'Élaboration de patrons de couture', order: 2 },
  { slug: 'magasins-tissus', name: 'Magasins de tissus', icon: 'layers', color: 'from-orange-400 to-amber-500', description: 'Vente de tissus en gros et détail', order: 3,
    subCategories: [
      { slug: 'tissus-ameublement', name: "Tissus d'ameublement" },
      { slug: 'tissus-habillement', name: "Tissus d'habillement" },
    ],
  },
  { slug: 'merceries', name: 'Merceries', icon: 'shopping-bag', color: 'from-green-400 to-emerald-500', description: 'Fils, boutons, fermetures et accessoires', order: 4 },
  { slug: 'services-broderie', name: 'Services de broderie', icon: 'sparkles', color: 'from-yellow-400 to-orange-500', description: 'Broderie traditionnelle et industrielle', order: 5 },
  { slug: 'formation-couture', name: 'Centres de formation couture', icon: 'graduation-cap', color: 'from-slate-400 to-gray-500', description: 'Apprentissage des techniques de couture', order: 6 },
  { slug: 'location-machines', name: 'Location de machines à coudre', icon: 'cog', color: 'from-indigo-400 to-violet-500', description: 'Machines professionnelles à louer', order: 7 },
  { slug: 'textiles', name: 'Textiles', icon: 'shirt', color: 'from-red-400 to-rose-500', description: 'Produits finis et matières premières textiles', order: 8 },
  { slug: 'studios', name: 'Studios', icon: 'camera', color: 'from-teal-400 to-emerald-500', description: 'Studios de photographie et vidéo', order: 9 },
];

async function main() {
  console.log('🌱 Seeding database...');

  // ===== Wilayas =====
  for (const wilaya of WILAYAS) {
    await prisma.wilaya.upsert({
      where: { id: wilaya.id },
      create: wilaya,
      update: { name: wilaya.name },
    });
  }
  console.log('✅ 69 wilayas seeded');

  // ===== Categories =====
  for (const cat of CATEGORIES) {
    const { subCategories, ...catData } = cat;
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      create: catData,
      update: { name: catData.name, icon: catData.icon },
    });

    if (subCategories) {
      for (const sub of subCategories) {
        await prisma.subCategory.upsert({
          where: { slug: sub.slug },
          create: { ...sub, categoryId: created.id },
          update: { name: sub.name },
        });
      }
    }
  }
  console.log('✅ 10 categories seeded');

  // ===== Subscription Config =====
  const existingConfig = await prisma.subscriptionConfig.findFirst();
  if (!existingConfig) {
    await prisma.subscriptionConfig.create({
      data: { simplePriceMonthly: 0, simplePriceAnnual: 0, proPriceMonthly: 2500, proPriceAnnual: 28000, trialDays: 14, annualDiscountPercent: 20 },
    });
    console.log('✅ Subscription config seeded');
  }

  // ===== Admin User =====
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@sanne.dz';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        phone: '+213000000000',
        firstName: 'Admin',
        lastName: 'Sanne DZ',
        password: hashed,
        role: 'ADMIN',
        isEmailVerified: true,
        isActive: true,
      },
    });
    console.log(`✅ Admin created: ${adminEmail}`);
  } else {
    console.log('ℹ️  Admin already exists');
  }

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
