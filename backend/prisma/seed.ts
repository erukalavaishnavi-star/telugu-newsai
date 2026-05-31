import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const passwordHash = await bcrypt.hash('demo1234', 12);

  const user = await prisma.user.upsert({
    where: { email: 'editor@demo.com' },
    update: {},
    create: {
      email: 'editor@demo.com',
      password: passwordHash,
      name: 'Demo Editor',
      orgName: 'Telugu News Network',
      role: 'editor',
      plan: 'pro',
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      password: await bcrypt.hash('admin1234', 12),
      name: 'Admin User',
      orgName: 'Telugu News Network',
      role: 'admin',
      plan: 'enterprise',
    },
  });

  console.log(`✅ Created admin: ${admin.email}`);
  console.log('🎉 Seeding complete!');
  console.log('');
  console.log('Demo credentials:');
  console.log('  Editor: editor@demo.com / demo1234');
  console.log('  Admin:  admin@demo.com  / admin1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
