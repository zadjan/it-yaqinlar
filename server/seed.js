const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'ikromovozod206@gmail.com' },
    update: {},
    create: { email: 'ikromovozod206@gmail.com', password: hashed },
  });

  await prisma.meetup.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'IT Yaqinlar #1',
        date: new Date('2025-06-15T14:00:00'),
        venue: 'Toshkent IT Park, 3-xona',
        topic: 'Web dasturlashga kirish: React va Node.js',
        status: 'upcoming',
      },
      {
        title: 'IT Yaqinlar #2',
        date: new Date('2025-07-20T14:00:00'),
        venue: 'Toshkent IT Park, 3-xona',
        topic: "Ma'lumotlar bazasi: PostgreSQL va Prisma ORM",
        status: 'upcoming',
      },
    ],
  });

  console.log('Seed muvaffaqiyatli bajarildi!');
  console.log('Admin: ikromovozod206@gmail.com | Parol: admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
