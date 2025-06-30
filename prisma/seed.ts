import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete existing data
  await prisma.menuItem.deleteMany();
  await prisma.venue.deleteMany();

  // Create the bar venue
  const venue = await prisma.venue.create({
    data: {
      name: 'Shisha Lounge',
      address: '789 Nightlife Ave, Springfield',
      menuItems: {
        create: [
          // Drinks
          {
            name: 'Mojito',
            description: 'Classic rum cocktail with mint, lime, and soda.',
            price: 8.5,
            category: 'drink',
          },
          {
            name: 'Espresso Martini',
            description: 'Vodka, coffee liqueur, and espresso.',
            price: 9.0,
            category: 'drink',
          },
          // Shisha
          {
            name: 'Double Apple',
            description: 'Traditional double apple shisha flavor.',
            price: 15.0,
            category: 'shisha',
          },
          {
            name: 'Mint Breeze',
            description: 'Refreshing mint shisha flavor.',
            price: 15.0,
            category: 'shisha',
          },
        ],
      },
    },
  });

  console.log('Seed data created:', { venue });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
